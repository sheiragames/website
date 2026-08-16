import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { LOCALES, STRINGS, renderShell, type Locale } from "./shell.ts";

function renderHomePage(locale: Locale): string {
	const home = STRINGS[locale].home;
	const bodyHtml = `
		<svg class="mascot" viewBox="0 0 100 100" aria-hidden="true">
			<circle cx="50" cy="22" r="11" />
			<path d="M50 33 L50 62" />
			<path d="M50 40 L34 52" />
			<path d="M50 40 L68 30" />
			<path d="M50 62 L36 90" />
			<path d="M50 62 L64 90" />
		</svg>

		<h1>${home.heading}</h1>

		<hr class="rule">

		<p class="blurb">${home.blurb1}</p>

		<p class="blurb">${home.blurb2Html}</p>
	`;
	return renderShell({ locale, pathSuffix: "", pageName: "homepage", title: home.title, bodyHtml });
}

function main(): void {
	LOCALES.forEach((locale) => {
		mkdirSync(locale, { recursive: true });
		writeFileSync(join(locale, "index.html"), renderHomePage(locale));
	});
}

main();
