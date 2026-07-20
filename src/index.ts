const DEBUG: boolean = true;

function log(...args: unknown[]): void {
	if (DEBUG) {
		// eslint-disable-next-line no-console -- sanctioned logging wrapper
		console.log(...args);
	}
}

log('Happy developing ✨');
