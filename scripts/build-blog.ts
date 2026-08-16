import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";
import { LOCALES, STRINGS, renderShell, type Locale } from "./shell.ts";

const POSTS_DIR = "blog-posts";
const EXCERPT_LENGTH = 160;

type Post = {
	id: string;
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

function parsePost(locale: Locale, filename: string): Post {
	const match = /^(?<date>\d{4}-\d{2}-\d{2})-(?<slug>.+)\.md$/u.exec(filename);
	if (match?.groups === undefined) {
		throw new Error(`Post filename doesn't match YYYY-MM-DD-slug.md: ${locale}/${filename}`);
	}
	const { date, slug } = match.groups;

	const raw = readFileSync(join(POSTS_DIR, locale, filename), "utf-8");
	const titleMatch = /^#\s+(?<title>.+)$/mu.exec(raw);
	if (titleMatch?.groups === undefined) {
		throw new Error(`Post has no "# Title" heading: ${locale}/${filename}`);
	}
	const title = escapeHtml(titleMatch.groups.title);
	const [fullMatch] = titleMatch;
	const bodyMarkdown = raw.slice(titleMatch.index + fullMatch.length).trim();
	const [firstParagraph = ""] = bodyMarkdown.split(/\n\s*\n/u);

	return {
		id: `${date}-${slug}`,
		slug,
		date,
		title,
		bodyHtml: marked.parse(bodyMarkdown, { async: false }),
		excerpt: makeExcerpt(firstParagraph),
	};
}

function readLocalePosts(locale: Locale): Post[] {
	const filenames = readdirSync(join(POSTS_DIR, locale)).filter((f) => f.endsWith(".md"));
	return filenames
		.map((filename) => parsePost(locale, filename))
		.sort((a, b) => b.date.localeCompare(a.date));
}

function assertLocalesMatch(postsByLocale: Record<Locale, Post[]>): void {
	const idsByLocale = LOCALES.map((locale) => new Set(postsByLocale[locale].map((post) => post.id)));
	const allIds = new Set(idsByLocale.flatMap((ids) => [...ids]));
	const missing = LOCALES.flatMap((locale, i) =>
		[...allIds]
			.filter((id) => !idsByLocale[i].has(id))
			.map((id) => `${id} missing from blog-posts/${locale}/`),
	);
	if (missing.length > 0) {
		throw new Error(`Every post must exist in every locale:\n${missing.join("\n")}`);
	}
}

function renderPostPage(locale: Locale, post: Post, prev: Post | undefined, next: Post | undefined): string {
	const nav = `
		<nav class="post-nav">
			${prev === undefined ? "" : `<a class="post-nav-prev" href="/${locale}/blog/${prev.id}/">← ${prev.title}</a>`}
			${next === undefined ? "" : `<a class="post-nav-next" href="/${locale}/blog/${next.id}/">${next.title} →</a>`}
		</nav>
	`;
	const body = `
		<p class="post-breadcrumb"><a href="/${locale}/blog/">← ${STRINGS[locale].blog.allPosts}</a></p>
		<article>
			<h1>${post.title}</h1>
			<p class="post-date">${post.date}</p>
			${post.bodyHtml}
		</article>
		${nav}
	`;
	return renderShell({ locale, pathSuffix: `blog/${post.id}/`, pageName: post.id, title: post.title, bodyHtml: body });
}

function renderIndexPage(locale: Locale, posts: Post[]): string {
	const items = posts
		.map(
			(post) => `
			<li>
				<h2><a href="/${locale}/blog/${post.id}/">${post.title}</a></h2>
				<p class="post-date">${post.date}</p>
				<p>${post.excerpt}</p>
			</li>
		`,
		)
		.join("\n");
	return renderShell({ locale, pathSuffix: "blog/", pageName: "blog-index", title: STRINGS[locale].blog.title, bodyHtml: `<ul class="post-list">${items}</ul>` });
}

function main(): void {
	const postsByLocale: Record<Locale, Post[]> = {
		en: readLocalePosts("en"),
		hu: readLocalePosts("hu"),
	};
	assertLocalesMatch(postsByLocale);

	LOCALES.forEach((locale) => {
		const posts = postsByLocale[locale];
		const outDir = join(locale, "blog");
		rmSync(outDir, { recursive: true, force: true });
		mkdirSync(outDir, { recursive: true });

		posts.forEach((post, i) => {
			const prev = posts[i + 1]; // older
			const next = posts[i - 1]; // newer
			const dir = join(outDir, post.id);
			mkdirSync(dir, { recursive: true });
			writeFileSync(join(dir, "index.html"), renderPostPage(locale, post, prev, next));
		});

		writeFileSync(join(outDir, "index.html"), renderIndexPage(locale, posts));
	});
}

main();
