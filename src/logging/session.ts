const SESSION_STORAGE_KEY = "sheiragames-session-id";

export function getSessionId(): string {
	const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
	if (existing !== null) {
		return existing;
	}
	const newSessionId = crypto.randomUUID();
	sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
	return newSessionId;
}
