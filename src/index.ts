import { logPageLoad, logTestEvent, logTestErrorEvent } from "@/logging/send";

logPageLoad();

// eslint-disable-next-line functional/immutable-data -- exposing DevTools-callable test triggers requires assigning to window
window.testLog = logTestEvent;
// eslint-disable-next-line functional/immutable-data -- same as above
window.testErrorLog = logTestErrorEvent;
