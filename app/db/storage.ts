const NS = "hiring-app:v1";

const key = (k: string) => `${NS}:${k}`;

export function get<T>(k: string, fallback: T): T {
 try {
  const raw = localStorage.getItem(key(k));
  return raw ? (JSON.parse(raw) as T) : fallback;
 } catch {
  return fallback;
 }
}

export function set<T>(k: string, v: T) {
 localStorage.setItem(key(k), JSON.stringify(v));
}
