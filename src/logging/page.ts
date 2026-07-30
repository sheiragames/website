export function getPageName(): string {
	const meta = document.querySelector('meta[name="page-name"]');
	const content = meta?.getAttribute("content");
	if (content === null || content === undefined) {
		// TODO(#83): once error alerting is wired in, also send this to D1.
		// eslint-disable-next-line functional/no-throw-statements -- missing meta tag is a real bug (see README's "must" requirement), not a recoverable case worth a Result type
		throw new Error('Missing <meta name="page-name"> tag on this page.');
	}
	return content;
}
