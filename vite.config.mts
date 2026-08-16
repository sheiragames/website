import { defineConfig } from "vitest/config";
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

function collectHtmlEntries(dir: string, keyPrefix: string, entries: Record<string, string>): void {
	for (const name of readdirSync(dir)) {
		const full = resolve(dir, name);
		if (statSync(full).isDirectory()) {
			collectHtmlEntries(full, `${keyPrefix}-${name}`, entries);
		} else if (name === "index.html") {
			entries[keyPrefix] = full;
		}
	}
}

function getPageEntries(): Record<string, string> {
	const entries: Record<string, string> = {};
	for (const locale of ["en", "hu"]) {
		const localeDir = resolve(import.meta.dirname, locale);
		if (!existsSync(localeDir)) {
			throw new Error(
				`${locale}/ doesn't exist — run \`node scripts/build-blog.ts\` and \`node scripts/build-home.ts\` before building/serving.`,
			);
		}
		collectHtmlEntries(localeDir, locale, entries);
	}
	return entries;
}

export default defineConfig(({ command }) => ({
	resolve: { tsconfigPaths: true },
	appType: "mpa",
	build:
		command === "build"
			? { rollupOptions: { input: getPageEntries() } }
			: undefined,
	test: {
		environment: "happy-dom",
	},
}));
