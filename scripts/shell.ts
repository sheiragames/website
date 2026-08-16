import { en } from "../src/strings/en.ts";
import { hu } from "../src/strings/hu.ts";
import type { Strings } from "../src/strings/types.ts";

export const SITE_ORIGIN = "https://sheiragames.com";
export const LOCALES = ["en", "hu"] as const;

export type Locale = (typeof LOCALES)[number];

export const STRINGS: Record<Locale, Strings> = { en, hu };

export function otherLocale(locale: Locale): Locale {
	return locale === "en" ? "hu" : "en";
}

export type ShellOptions = {
	locale: Locale;
	pathSuffix: string;
	pageName: string;
	title: string;
	bodyHtml: string;
};

export function renderShell({ locale, pathSuffix, pageName, title, bodyHtml }: ShellOptions): string {
	const other = otherLocale(locale);
	return `<!DOCTYPE html>
<html lang="${locale}">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title}</title>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg">
	<link rel="stylesheet" href="/style.css">
	<link rel="alternate" hreflang="${locale}" href="${SITE_ORIGIN}/${locale}/${pathSuffix}">
	<link rel="alternate" hreflang="${other}" href="${SITE_ORIGIN}/${other}/${pathSuffix}">
	<meta name="page-name" content="${pageName}">
</head>
<body>
	<div class="page">
		<div class="site-header">
			<a class="wordmark" href="/${locale}/">sheiragames</a>
			<a class="lang-switch" href="/${other}/${pathSuffix}">${other.toUpperCase()}</a>
		</div>
		${bodyHtml}
	</div>
	<script type="module" src="/src/index.ts"></script>
</body>
</html>
`;
}
