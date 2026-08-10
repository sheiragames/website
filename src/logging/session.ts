const SESSION_STORAGE_KEY = "sheiragames-session-id";
const generatedSessionId = crypto.randomUUID();

export function getSessionId(): string {
	try {
		const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (existing !== null) {
			return existing;
		}
		sessionStorage.setItem(SESSION_STORAGE_KEY, generatedSessionId);
		return generatedSessionId;
	} catch {
		// sessionStorage can throw (Safari private browsing, storage disabled by
		// privacy settings, etc.) — fall back to this page load's own generated
		// id so logging still works, just without persistence across navigations
		return generatedSessionId;
	}
}
