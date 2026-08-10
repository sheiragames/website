import { logWebsiteError } from "@/logging/send";
import { WebsiteErrorNames } from "@/logging/website-events-v1";

function toErrorDetails(error: unknown): { message: string; stack: string | null } {
	if (error instanceof Error) {
		return { message: error.message, stack: error.stack ?? null };
	}
	return { message: String(error), stack: null };
}

function isOpaqueCrossOriginError(event: ErrorEvent): boolean {
	return (
		event.message === "Script error." &&
		event.filename === "" &&
		(event.error === null || event.error === undefined)
	);
}

export function setupErrorCapture(): void {
	window.addEventListener("error", (event) => {
		if (isOpaqueCrossOriginError(event)) {
			logWebsiteError({
				errorName: WebsiteErrorNames.WS_BROWSER_ERROR,
				errorMessage: event.message,
				stacktrace: null,
				needEmailSending: false,
			});
			return;
		}
		const { message, stack } = toErrorDetails(event.error ?? event.message);
		logWebsiteError({
			errorName: WebsiteErrorNames.WS_INTERNAL_SERVER_ERROR,
			errorMessage: message,
			stacktrace: stack,
			needEmailSending: true,
		});
	});

	// unlike the "error" listener above, there's no browser-provided signal to
	// detect a third-party/not-ours rejection here — revisit if a third-party
	// script or embed is ever added (none exist today)
	window.addEventListener("unhandledrejection", (event) => {
		const { message, stack } = toErrorDetails(event.reason);
		logWebsiteError({
			errorName: WebsiteErrorNames.WS_INTERNAL_SERVER_ERROR,
			errorMessage: message,
			stacktrace: stack,
			needEmailSending: true,
		});
	});
}
