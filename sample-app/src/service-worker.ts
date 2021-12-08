/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
const precacheManifest = self.__WB_MANIFEST;
// Only precache static assets in production.
// Precaching in development can result in confusing situations.
// See https://github.com/facebook/create-react-app/issues/2398#issuecomment-304638935
if (process.env.NODE_ENV !== 'development') {
  precacheAndRoute(precacheManifest);
}

const cacheName = 'YEXT_ANSWERS_CACHE';
const universalSearch = /v2\/accounts\/me\/answers\/query/;
const universalAutocomplete = /v2\/accounts\/me\/answers\/autocomplete/;
const verticalAutocomplete = /v2\/accounts\/me\/answers\/vertical\/autocomplete/;
const swFetchedOnHeader = 'yxt-sw-fetched-on';

// Clear the cache when a new service worker activates
self.addEventListener('activate', event => {
  event.waitUntil(caches.delete(cacheName));
});

self.addEventListener('fetch', (event: FetchEvent) => {
  // Only cache universal search requests intended for VisualAutocomplete
  if (
    universalSearch.test(event.request.url) &&
    new URLSearchParams(event.request.url).has('restrictVerticals')
  ) {
    event.respondWith(respondUsingCache(event.request, 30 * 1000));
  }

  if ([universalAutocomplete, verticalAutocomplete].find(regex => regex.test(event.request.url))) {
    event.respondWith(respondUsingCache(event.request, 30 * 1000));
  }
});

async function respondUsingCache(request: Request, timeToLiveInMilliseconds: number): Promise<Response> {
  const cachedResponse = await caches.match(request);
  const fetchedOn = cachedResponse?.headers.get(swFetchedOnHeader);
  if (cachedResponse && fetchedOn) {
    try {
      const fetchedOnTimestamp = parseInt(fetchedOn);
      const currentTimestamp = new Date().getTime();
      if (currentTimestamp < fetchedOnTimestamp + timeToLiveInMilliseconds) {
        return cachedResponse;
      }
    } catch (e) {
      console.error(`Service worker could not parse ${swFetchedOnHeader} header with value "${fetchedOn}".`);
    }
  }

  const [cache, freshResponse] = await Promise.all<Cache, Response>([
    caches.open(cacheName),
    fetch(request)
  ]);
  const clone = freshResponse.clone();
  const headers = new Headers(freshResponse.headers);
  headers.append(swFetchedOnHeader, new Date().getTime().toString());
  const body = await clone.blob();
  const responseToCache = new Response(body, {
    status: clone.status,
    statusText: clone.statusText,
    headers
  });
  await cache.put(request, responseToCache);
  return freshResponse;
}