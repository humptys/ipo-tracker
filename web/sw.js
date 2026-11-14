// 공모주 기록장 서비스 워커: 앱 설치(홈 화면 앱) 조건 + 오프라인일 때 마지막 화면 보여 주기
// 항상 네트워크를 먼저 써서(network-first) 배포한 새 버전이 바로 반영되게 함. GitHub API 등 다른 사이트 요청은 건드리지 않음
const CACHE = "ipo-tracker-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res.ok) {
        const copy = res.clone();
        // 캐시 키에서 ?v=, ?t= 같은 값은 빼서 파일마다 최신본 1개만 보관
        const key = new URL(req.url); key.search = "";
        caches.open(CACHE).then((c) => c.put(key.href, copy)).catch(() => {});
      }
      return res;
    } catch (err) {
      const c = await caches.open(CACHE);
      const key = new URL(req.url); key.search = "";
      return (await c.match(key.href)) || (req.mode === "navigate" && (await c.match(new URL("./", self.location).href))) || Response.error();
    }
  })());
});
