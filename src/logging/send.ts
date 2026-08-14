import type { z } from "zod";
import { EventSchema, WebsiteEvents, WebsiteErrorNames, SOURCE } from "@/logging/website-events-v1";
import { getSessionId } from "@/logging/session";
import { getPageName } from "@/logging/page";

function getLogEndpoint(): string {
	switch (import.meta.env.MODE) {
		case "development":
			return "http://localhost:8787/api/log";
		case "test":
			return "https://test.sheiragames.com/api/log";
		default:
			return "https://sheiragames.com/api/log";
	}
}

const LOG_ENDPOINT = getLogEndpoint();

// Omit doesn't distribute correctly over a discriminated union on its own —
// verified: it collapses per-variant narrowing on the result. This form does.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
	? Omit<T, K>
	: never;

// z.input (not z.infer/z.output) — data is optional pre-defaulting, which
// matches what's actually legal to omit when calling EventSchema.parse().
type EventInput = z.input<typeof EventSchema>;

export type ClientSuppliedFields = DistributiveOmit<
	EventInput,
	"source" | "sessionId" | "path" | "pageName"
>;

export function sendLogEvent(fields: ClientSuppliedFields): void {
	try {
		const payload = EventSchema.parse({
			...fields,
			source: SOURCE,
			sessionId: getSessionId(),
			path: location.pathname,
			pageName: getPageName(),
		});
		// if (true) console.log(payload); // uncomment locally to debug — lint blocks this from being accidentally committed uncommented
		navigator.sendBeacon(LOG_ENDPOINT, JSON.stringify(payload));
	} catch (err) {
		if (fields.event === WebsiteEvents.WEBSITE_ERROR) {
			// error reporting failing on itself is a self-referential dead end —
			// give up silently rather than trying to error-report a failed error report
			return;
		}
		// a genuine bug (e.g. schema drift) on a non-error event is worth
		// surfacing through error reporting, not swallowing silently
		logWebsiteError({
			errorName: WebsiteErrorNames.WS_INTERNAL_SERVER_ERROR,
			errorMessage: err instanceof Error ? err.message : String(err),
			stacktrace: err instanceof Error ? (err.stack ?? null) : null,
			needEmailSending: true,
		});
	}
}

export function logPageLoad(): void {
	sendLogEvent({
		event: WebsiteEvents.PAGE_LOAD_STARTED,
		level: "info",
		version: "v1",
	});
}

export function logWebsiteError(fields: {
	errorName: (typeof WebsiteErrorNames)[keyof typeof WebsiteErrorNames];
	errorMessage: string;
	stacktrace: string | null;
	needEmailSending: boolean;
}): void {
	sendLogEvent({
		event: WebsiteEvents.WEBSITE_ERROR,
		level: "error",
		version: "v1",
		...fields,
	});
}

export function testLog(needEmail = false, errorMessage = "Manual test trigger"): void {
	logWebsiteError({
		errorName: WebsiteErrorNames.WS_INTERNAL_SERVER_ERROR,
		errorMessage,
		stacktrace: null,
		needEmailSending: needEmail,
	});
}
