self.addEventListener('install', (event) => {
    // Basic service worker file to satisfy PWA installation criteria
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // Default fetch behavior
});
