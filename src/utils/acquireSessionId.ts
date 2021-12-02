import { v4 as uuidv4 } from 'uuid';
/**
 * Retrieves session id from local storage, or generates a new uuid to use as session id.
 * The new id is then stored in local storage.
 */
export default function acquireSessionId(): string | null {
  try {
    let sessionId = window.sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      window.sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  } catch (err) {
    console.warn('Unable to use browser sessionStorage for sessionId.\n', err);
    return null;
  }
}