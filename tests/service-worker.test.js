import { describe, expect, it, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const swSource = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const appBaseUrl = 'https://trivia.test/app/';

function response(body, status = 200) {
  return {
    body,
    status,
    ok: status >= 200 && status < 300,
    clone() { return response(body, status); },
    async json() { return JSON.parse(body); },
  };
}

function cacheKey(request) {
  const value = typeof request === 'string' ? request : request.url;
  return new URL(value, appBaseUrl).href;
}

function createServiceWorker({ offline = false } = {}) {
  const listeners = new Map();
  const cacheData = new Map();
  const requests = [];
  const cacheNames = [];
  let isOffline = offline;
  const cacheStorage = {
    async open(name) {
      if (!cacheData.has(name)) cacheData.set(name, new Map());
      if (!cacheNames.includes(name)) cacheNames.push(name);
      const entries = cacheData.get(name);
      return {
        async addAll(assets) {
          const missing = assets.filter((asset) => {
            const localPath = join(projectRoot, asset.replace(/^\.\//, ''));
            return !existsSync(localPath);
          });
          if (missing.length) throw new Error(`Missing local precache files: ${missing.join(', ')}`);
          assets.forEach((asset) => entries.set(cacheKey(asset), response(`cached:${asset}`)));
        },
        async add(asset) {
          const fetched = await fakeFetch(asset);
          if (!fetched.ok) throw new Error(`Unable to cache ${asset}`);
          entries.set(cacheKey(asset), fetched.clone());
        },
        async match(request) { return entries.get(cacheKey(request)); },
        async put(request, value) { entries.set(cacheKey(request), value); },
      };
    },
    async match(request) {
      for (const entries of cacheData.values()) {
        const found = entries.get(cacheKey(request));
        if (found) return found;
      }
      return undefined;
    },
    async keys() { return [...cacheData.keys()]; },
    async delete(name) { return cacheData.delete(name); },
  };
  async function fakeFetch(request) {
    const rawUrl = typeof request === 'string' ? request : request.url;
    requests.push(rawUrl);
    if (isOffline) throw new Error('offline');
    if (rawUrl === './databases/list.json') {
      return response(JSON.stringify([{ path: 'databases/categories/general_pl.json' }]));
    }
    if (rawUrl === './databases/categories/general_pl.json') {
      return response('{"name":"offline fixture","questions":[]}');
    }
    if (rawUrl.startsWith('https://')) throw new Error('remote CDN unavailable in test');
    return response(`network:${rawUrl}`);
  }

  const serviceWorker = {
    clients: { claim: vi.fn(async () => {}) },
    skipWaiting: vi.fn(async () => {}),
    addEventListener(type, listener) { listeners.set(type, listener); },
  };
  runInNewContext(swSource, {
    self: serviceWorker,
    caches: cacheStorage,
    fetch: fakeFetch,
    URL,
    console: { log() {}, warn() {}, error() {} },
  });

  return {
    cacheData,
    cacheNames,
    cacheStorage,
    fakeFetch,
    listeners,
    requests,
    serviceWorker,
    setOffline(value) { isOffline = value; },
  };
}

async function install(app) {
  let installPromise;
  app.listeners.get('install')({ waitUntil(promise) { installPromise = promise; } });
  await installPromise;
}

async function activate(app) {
  let activationPromise;
  app.listeners.get('activate')({ waitUntil(promise) { activationPromise = promise; } });
  await activationPromise;
}

async function request(app, { path, mode = 'same-origin', method = 'GET' }) {
  let responsePromise;
  app.listeners.get('fetch')({
    request: { url: new URL(path, appBaseUrl).href, mode, method },
    respondWith(promise) { responsePromise = promise; },
  });
  return responsePromise;
}

describe('service worker lifecycle and offline requests', () => {
  it('installs local app assets, tolerates unavailable CDNs, and caches listed categories', async () => {
    const app = createServiceWorker();
    await install(app);

    const [activeCacheName] = await app.cacheStorage.keys();
    expect(activeCacheName).toMatch(/^trivia-board-game-v\d+$/);
    const activeCache = app.cacheData.get(activeCacheName);
    const cachedPaths = [...activeCache.keys()].map((key) => new URL(key).pathname);
    for (const path of [
      '/app/index.html',
      '/app/style.css',
      '/app/presentation-rework.css',
      '/app/board-rework.css',
      '/app/reading-rework.css',
      '/app/tv-rework.css',
      '/app/js/theme.js',
      '/app/js/trivia/reading-cards.js',
      '/app/databases/categories/general_pl.json',
    ]) {
      expect(cachedPaths).toContain(path);
    }
    expect(app.serviceWorker.skipWaiting).toHaveBeenCalledOnce();
    expect(app.requests).toContain('./databases/categories/general_pl.json');
    expect(app.requests.some((url) => url.startsWith('https://'))).toBe(true);
  });

  it('claims clients and removes prior caches on activation', async () => {
    const app = createServiceWorker();
    app.cacheData.set('trivia-board-game-v18', new Map());
    app.cacheData.set('unrelated-old-cache', new Map());
    await install(app);
    const activeCacheName = (await app.cacheStorage.keys()).find((name) =>
      /^trivia-board-game-v\d+$/.test(name) && name !== 'trivia-board-game-v18'
    );
    await activate(app);

    expect(await app.cacheStorage.keys()).toEqual([activeCacheName]);
    expect(app.serviceWorker.clients.claim).toHaveBeenCalledOnce();
  });

  it('serves cached shell and category data offline, with navigation fallback to index', async () => {
    const app = createServiceWorker();
    await install(app);
    app.setOffline(true);

    const shellResponse = await request(app, { path: './style.css' });
    expect(shellResponse.body).toBe('cached:./style.css');

    const categoryResponse = await request(app, {
      path: './databases/categories/general_pl.json',
    });
    expect(categoryResponse.body).toBe('{"name":"offline fixture","questions":[]}');

    const fallback = await request(app, { path: './missing-route', mode: 'navigate' });
    expect(fallback.body).toBe('cached:./index.html');
  });

  it('bypasses CacheStorage for API and non-GET requests', async () => {
    const app = createServiceWorker();
    let respondWithCalled = false;
    app.listeners.get('fetch')({
      request: { url: 'https://api.openai.com/v1/responses', method: 'POST', mode: 'cors' },
      respondWith() { respondWithCalled = true; },
    });
    expect(respondWithCalled).toBe(false);

    app.listeners.get('fetch')({
      request: { url: new URL('./save', appBaseUrl).href, method: 'POST', mode: 'same-origin' },
      respondWith() { respondWithCalled = true; },
    });
    expect(respondWithCalled).toBe(false);
  });
});
