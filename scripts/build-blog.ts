import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

const POSTS_DIR = "blog-posts";
const OUTPUT_DIR = "blog";
const EXCERPT_LENGTH = 160;

type Post = {
	slug: string;
	date: string;
	title: string;
	bodyHtml: string;
	excerpt: string;
};

function escapeHtml(text: string): string {
	return text.replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;");
}

function makeExcerpt(paragraph: string): string {
	const plainText = paragraph
		.replace(/!\[(?<text>[^\]]*)\]\([^)]*\)/gu, "$<text>")
		.replace(/\[(?<text>[^\]]*)\]\([^)]*\)/gu, "$<text>")
		.replace(/[*_`#]/gu, "")
		.trim();
	if (plainText.length <= EXCERPT_LENGTH) {
		return plainText;
	}
	const truncated = plainText.slice(0, EXCERPT_LENGTH);
	const lastSpace = truncated.lastIndexOf(" ");
	return `${truncated.slice(0, lastSpace)}…`;
}

function parsePost(filename: string): Post {
	const match = /^(?<date>\d{4}-\d{2}-\d{2})-(?<slug>.+)\.md$/u.exec(filename);
	if (match?.groups === undefined) {
		throw new Error(`Post filename doesn't match YYYY-MM-DD-slug.md: ${filename}`);
	}
	const { date, slug } = match.groups;

	const raw = readFileSync(join(POSTS_DIR, filename), "utf-8");
	const titleMatch = /^#\s+(?<title>.+)$/mu.exec(raw);
	if (titleMatch?.groups === undefined) {
		throw new Error(`Post has no "# Title" heading: ${filename}`);
	}
	const title = escapeHtml(titleMatch.groups.title);
	const [fullMatch] = titleMatch;
	const bodyMarkdown = raw.slice(titleMatch.index + fullMatch.length).trim();
	const [firstParagraph = ""] = bodyMarkdown.split(/\n\s*\n/u);

	return {
		slug,
		date,
		title,
		bodyHtml: marked.parse(bodyMarkdown, { async: false }),
		excerpt: makeExcerpt(firstParagraph),
	};
}

function renderShell(pageName: string, title: string, bodyHtml: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg">
	<link rel="stylesheet" href="/style.css">
	<meta name="page-name" content="${pageName}">
</head>
<body>
	<div class="page">
		<a class="wordmark" href="/">sheiragames</a>
		${bodyHtml}
	</div>
	<script type="module" src="/src/index.ts"></script>
</body>
</html>
`;
}

function renderPostPage(post: Post, prev: Post | undefined, next: Post | undefined): string {
	const nav = `
		<nav class="post-nav">
			${prev === undefined ? "" : `<a class="post-nav-prev" href="/blog/${prev.date}-${prev.slug}/">← ${prev.title}</a>`}
			${next === undefined ? "" : `<a class="post-nav-next" href="/blog/${next.date}-${next.slug}/">${next.title} →</a>`}
		</nav>
	`;
	const body = `
		<p class="post-breadcrumb"><a href="/blog/">← All posts</a></p>
		<article>
			<h1>${post.title}</h1>
			<p class="post-date">${post.date}</p>
			${post.bodyHtml}
		</article>
		${nav}
	`;
	return renderShell(post.slug, post.title, body);
}

function renderIndexPage(posts: Post[]): string {
	const items = posts
		.map(
			(post) => `
			<li>
				<h2><a href="/blog/${post.date}-${post.slug}/">${post.title}</a></h2>
				<p class="post-date">${post.date}</p>
				<p>${post.excerpt}</p>
			</li>
		`,
		)
		.join("\n");
	return renderShell("blog-index", "Blog", `<ul class="post-list">${items}</ul>`);
}

function main(): void {
	const filenames = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
	const posts = filenames.map(parsePost).sort((a, b) => b.date.localeCompare(a.date));

	rmSync(OUTPUT_DIR, { recursive: true, force: true });
	mkdirSync(OUTPUT_DIR, { recursive: true });

	posts.forEach((post, i) => {
		const prev = posts[i + 1]; // older
		const next = posts[i - 1]; // newer
		const dir = join(OUTPUT_DIR, `${post.date}-${post.slug}`);
		mkdirSync(dir, { recursive: true });
		writeFileSync(join(dir, "index.html"), renderPostPage(post, prev, next));
	});

	writeFileSync(join(OUTPUT_DIR, "index.html"), renderIndexPage(posts));
}

main();
