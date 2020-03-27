import { getToken } from "./auth.storage";

export function authFetch(url: RequestInfo, init?: RequestInit) {
  if (!init || !init.headers) {
    return fetch(url, init);
  }

  const token = getToken();

  const headers = new Headers({ ...init.headers });
  if (token) {
    headers.append("Authorization", `Token ${token!}`);
  }

  const newInit: RequestInit = {
    ...init,
    headers
  };

  return fetch(url, newInit);
}
