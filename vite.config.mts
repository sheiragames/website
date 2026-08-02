import { defineConfig } from "vitest/config";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

function getBlogEntries(): Record<string, string> {
	const blogDir = resolve(import.meta.dirname, "blog");
	if (!existsSync(blogDir)) {
		throw new Error(
			"blog/ doesn't exist — run `node scripts/build-blog.ts` before building/serving.",
		);
	}

	const entries: Record<string, string> = {
		main: resolve(import.meta.dirname, "index.html"),
	};

	for (const name of readdirSync(blogDir)) {
		const full = resolve(blogDir, name);
		if (statSync(full).isDirectory()) {
			entries[`blog-${name}`] = resolve(full, "index.html");
		} else if (name === "index.html") {
			entries["blog-index"] = full;
		}
	}

	return entries;
}

export default defineConfig({
	resolve: { tsconfigPaths: true },
	build: {
		rollupOptions: {
			input: getBlogEntries(),
		},
	},
	test: {
		environment: "happy-dom",
	},
});
