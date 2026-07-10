import { PhpCgiWorker } from 'https://cdn.jsdelivr.net/npm/php-cgi-wasm@0.1.0/PhpCgiWorker.mjs';
import storage from './storage.mjs';
import libs from './libs.mjs';

let files = [];
let php;

self.addEventListener('install', (event) => {
    console.debug('install');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.debug('activate');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('install', event => php && php.handleInstallEvent(event));
self.addEventListener('activate', event => php && php.handleActivateEvent(event));
self.addEventListener('fetch', event => php && php.handleFetchEvent(event));
self.addEventListener('message', event => {

    if (event.data && event.data.storage) {
        const proxy = event.data.proxy ?? '';

        files = [...storage, ...event.data.storage].map(function (file) {
            const fileName = file.substring(file.lastIndexOf('/') + 1);
            const filePath = file.startsWith('https:') ? '' : file.substring(0, file.lastIndexOf('/'));
            const fileUrl = file.startsWith('https:') ? file : `${proxy}/${file}`;

            return {
                name: fileName,
                parent: '/preload/' + filePath,
                url: fileUrl
            }
        });

        console.debug(files);
    }

    if (event.data && true == event.data.init) {
        const params = new URLSearchParams(self.location.search);
        let baseHref = params.get('baseHref') ?? '';
        if (!baseHref.startsWith('/')) baseHref = '/' + baseHref;
        if (!baseHref.endsWith('/')) baseHref += '/';

        php = new PhpCgiWorker({
            docroot: '/preload',
            prefix: baseHref + 'preload',
            rewrite: (path) => baseHref + 'preload/bootstrap.php',
            sharedLibs: libs,
            files: files
        });

        console.debug(php);

        event.source.postMessage({ ready: true });
    }
});
