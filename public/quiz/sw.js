// Quiz service worker. Its only job is to make the quiz installable: Chrome on Android
// needs a registered service worker with a fetch handler before it offers "Add to home screen".
// It does not cache anything, so the quiz always loads fresh from the network.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
