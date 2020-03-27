const TOKEN_KEY = "token";

export function persistToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function eraseToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);

  return token;
}
