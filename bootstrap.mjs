import { onMessage, sendMessageFor } from 'https://cdn.jsdelivr.net/npm/php-cgi-wasm@0.1.0/msg-bus.mjs';

let baseHref = document.querySelector('base[href]')?.getAttribute('href') ?? '';
if (!baseHref.startsWith('/')) baseHref = '/' + baseHref;
if (!baseHref.endsWith('/')) baseHref += '/';

const SERVICE_WORKER_SCRIPT_URL = baseHref + 'worker.mjs?baseHref=' + baseHref;

const r = await navigator.serviceWorker.register(SERVICE_WORKER_SCRIPT_URL, {
    type: 'module',
    updateViaCache: 'none'
});
r.update();

navigator.serviceWorker.addEventListener('message', onMessage);

const sendMessage = sendMessageFor(SERVICE_WORKER_SCRIPT_URL);


const bootstrap = async (r) => {
    const root = new URL(location.href);
    if (!root.pathname.endsWith('/')) {
        const parts = root.pathname.split('/');
        parts.pop();
        root.pathname = parts.join('/');
    }
    const storage = (document.querySelector('script#bootstrap').getAttribute('data-storage') ?? '').split(',');
    const proxy = document.querySelector('script#bootstrap').getAttribute('data-proxy') ?? root.toString();

    r.active.postMessage({storage, proxy});
    r.active.postMessage({init: true});

    const url = new URL(location.href);
    if (-1 === new String(url.pathname).indexOf('/preload')) {
        if (!url.pathname.endsWith('/')) url.pathname += '/';
        url.pathname = url.pathname + 'preload';
    }

    if (url.searchParams.has('_route')) {
        url.pathname += url.searchParams.get('_route');
        url.searchParams.delete('_route');
    }

    const f = await fetch(url.toString(), { cache: 'no-store' });
    document.querySelector(':root').innerHTML = await f.text();

    history.replaceState({}, null, url.toString());
}

const timeout = setTimeout(() => bootstrap(r), 2000);

if (navigator.serviceWorker.controller) {
    clearTimeout(timeout);
    console.debug(`timeout`);
    await bootstrap(r);
} else {
    navigator.serviceWorker.addEventListener('controllerchange', async (event) => {
        clearTimeout(timeout);
        console.debug(`controllerchange`)
        await bootstrap(r);
    });
}
