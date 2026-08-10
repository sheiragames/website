import { logPageLoad, testLog } from "@/logging/send";
import { setupErrorCapture } from "@/logging/errors";

setupErrorCapture();
logPageLoad();

// eslint-disable-next-line functional/immutable-data -- exposing DevTools-callable test triggers requires assigning to window
window.testLog = testLog;
