import type { z } from "zod";
import { EventSchema, WebsiteEvents } from "@/logging/website-events-v1";
import { getSessionId } from "@/logging/session";
import { getPageName } from "@/logging/page";

const LOG_ENDPOINT = import.meta.env.DEV
	? "http://localhost:8787/api/log"
	: "https://sheiragames.com/api/log";

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
	const payload = EventSchema.parse({
		...fields,
		source: "website",
		sessionId: getSessionId(),
		path: location.pathname,
		pageName: getPageName(),
	});
	// if (true) console.log(payload); // uncomment locally to debug — lint blocks this from being accidentally committed uncommented
	navigator.sendBeacon(LOG_ENDPOINT, JSON.stringify(payload));
}

export function logPageLoad(): void {
	sendLogEvent({
		event: WebsiteEvents.PAGE_LOAD_STARTED,
		level: "info",
		version: "v1",
	});
}

export function logTestEvent(): void {
	sendLogEvent({
		event: WebsiteEvents.TEST_EVENT,
		level: "info",
		version: "v1",
		data: {
			answers: [
				{ questionId: "sample-question-1", correct: true },
				{ questionId: "sample-question-2", correct: false },
			],
			meta: {
				browser: { name: "sample-browser", version: "1.0" },
			},
		},
	});
}

export function logTestErrorEvent(): void {
	sendLogEvent({
		event: WebsiteEvents.TEST_ERROR_EVENT,
		level: "error",
		version: "v1",
	});
}
