import { z } from "zod";

// Event names outlive any one version's schema shape, so this doesn't really
// belong version-scoped — living here for now since there's only one file;
// revisit once a v2 actually exists and this needs a real shared home.
export const WebsiteEvents = {
	PAGE_LOAD_STARTED: "PAGE_LOAD_STARTED",
	TEST_EVENT: "TEST_EVENT",
	TEST_ERROR_EVENT: "TEST_ERROR_EVENT",
} as const;

const commonFields = {
	source: z.string(),
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

export const TestEventV1Schema = z
	.object({
		...commonFields,
		event: z.literal(WebsiteEvents.TEST_EVENT),
		version: z.literal("v1"),
		data: z
			.object({
				answers: z.array(
					z.object({
						questionId: z.string(),
						correct: z.boolean(),
					}),
				),
				meta: z.object({
					browser: z.object({
						name: z.string(),
						version: z.string(),
					}),
				}),
			})
			.strict(),
	})
	.strict();
export type TestEventV1 = z.infer<typeof TestEventV1Schema>;

export const TestErrorEventV1Schema = z
	.object({
		...commonFields,
		event: z.literal(WebsiteEvents.TEST_ERROR_EVENT),
		version: z.literal("v1"),
		data: z.object({}).strict().optional().default({}),
	})
	.strict();
export type TestErrorEventV1 = z.infer<typeof TestErrorEventV1Schema>;

export const EventSchema = z.discriminatedUnion("event", [
	PageLoadStartedV1Schema,
	TestEventV1Schema,
	TestErrorEventV1Schema,
]);
export type Event = z.infer<typeof EventSchema>;
