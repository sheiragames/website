const DEBUG = true;

function log(...args: unknown[]): void {
	if (DEBUG) {
		console.log(...args);
	}
}

log('Happy developing ✨');
