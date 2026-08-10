export function getPageName(): string {
	const meta = document.querySelector('meta[name="page-name"]');
	const content = meta?.getAttribute("content");
	return content ?? "unknown-page";
}
