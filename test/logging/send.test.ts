import { describe, it, expect, beforeEach, vi } from "vitest";
import { logPageLoad } from "@/logging/send";

describe("logPageLoad", () => {
	beforeEach(() => {
		sessionStorage.clear();
		document.head.innerHTML = "";
		const meta = document.createElement("meta");
		meta.setAttribute("name", "page-name");
		meta.setAttribute("content", "homepage");
		document.head.appendChild(meta);
	});

	it("sends a PAGE_LOAD_STARTED beacon with the correct payload", () => {
		const sendBeaconSpy = vi.spyOn(navigator, "sendBeacon").mockReturnValue(true);

		logPageLoad();

		expect(sendBeaconSpy).toHaveBeenCalledTimes(1);
		const [[url, body]] = sendBeaconSpy.mock.calls;
		expect(url).toContain("/api/log");

		const payload = JSON.parse(body as string);
		expect(payload).toMatchObject({
			source: "website",
			event: "PAGE_LOAD_STARTED",
			level: "info",
			version: "v1",
			pageName: "homepage",
			data: {},
		});
		expect(typeof payload.sessionId).toBe("string");
		expect(payload.sessionId.length).toBeGreaterThan(0);
	});
});
