export default function registerServiceWorker() {
  window.addEventListener('load', async () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    const registration = await navigator.serviceWorker.register(swUrl)
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker == null) {
        return;
      }
      installingWorker.onstatechange = () => {
        // If the service worker updates, either due to its source code changing
        // or the precache manifest changing, refresh the page to use the updated assets.
        // The refresh should be virtually unnoticeable due to precaching.
        if (installingWorker.state === 'activated') {
          window.location.reload();
        }
      }
    }
  });
}
