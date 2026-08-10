import { z } from "zod";

// Event names outlive any one version's schema shape, so this doesn't really
// belong version-scoped — living here for now since there's only one file;
// revisit once a v2 actually exists and this needs a real shared home.
export const SOURCE = "website";

export const WebsiteEvents = {
	PAGE_LOAD_STARTED: "PAGE_LOAD_STARTED",
	WEBSITE_ERROR: "WEBSITE_ERROR",
} as const;

export const WebsiteErrorNames = {
	WS_INTERNAL_SERVER_ERROR: "WS_INTERNAL_SERVER_ERROR",
	WS_BROWSER_ERROR: "WS_BROWSER_ERROR",
} as const;

const commonFields = {
	source: z.literal(SOURCE),
	sessionId: z.string(),
	level: z.enum(["info", "warn", "error", "debug"]),
	path: z.string(),
	pageName: z.string(),
};

export const PageLoadStartedV1Schema = z
	.object({
		...commonFields,
		event: z.literal(WebsiteEvents.PAGE_LOAD_STARTED),
		version: z.literal("v1"),
		data: z.object({}).strict().optional().default({}),
	})
	.strict();
export type PageLoadStartedV1 = z.infer<typeof PageLoadStartedV1Schema>;

export const WebsiteErrorV1Schema = z
	.object({
		...commonFields,
		event: z.literal(WebsiteEvents.WEBSITE_ERROR),
		version: z.literal("v1"),
		errorName: z.enum([WebsiteErrorNames.WS_INTERNAL_SERVER_ERROR, WebsiteErrorNames.WS_BROWSER_ERROR]),
		errorMessage: z.string(),
		stacktrace: z.string().nullable(),
		needEmailSending: z.boolean(),
	})
	.strict();
export type WebsiteErrorV1 = z.infer<typeof WebsiteErrorV1Schema>;

export const EventSchema = z.discriminatedUnion("event", [
	PageLoadStartedV1Schema,
	WebsiteErrorV1Schema,
]);
export type Event = z.infer<typeof EventSchema>;
