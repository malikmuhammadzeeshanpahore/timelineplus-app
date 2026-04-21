self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (e) => {
    e.waitUntil(self.registration.unregister());
});
self.addEventListener('fetch', () => { /* No-op to bypass interception */ });
self.addEventListener('push', () => {});
self.addEventListener('notificationclick', () => {});
