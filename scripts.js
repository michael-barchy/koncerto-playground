/**
 * Reload scripts from dynamic loading
 */

function reloadScript(el, force) {
    if ('false' === el.getAttribute('data-reload') && true !== force) {
        return;
    }
    if (el.hasAttribute('src')) {
        var parent = el.parentNode;
        var src = el.getAttribute('src');
        el.remove();
        var s = document.createElement('script');
        s.setAttribute('data-reload', false);
        s.setAttribute('src', src);
        parent.appendChild(s);
        s.addEventListener('load', function() {
            dispatchEvent(new Event('load'));
        });
        return;
    }
    eval(el.innerText);
    el.setAttribute('data-reload', false);
}

var root = document.querySelector('html');
var observer = new MutationObserver(function (mutations) {
    Array.prototype.slice.call(mutations).forEach(function (mutation) {
        Array.prototype.slice.call(mutation.addedNodes).forEach(function(node) {
            if ('script' === node.nodeName.toLowerCase()) {
                reloadScript(node);
            }
            if ('head' === node.nodeName.toLowerCase() || 'body' === node.nodeName.toLowerCase()) {
                var scripts = Array.prototype.slice.call(node.querySelectorAll('script'));
                scripts.forEach(function(script) {
                    reloadScript(script);
                });
            }
        });
    });
});

if (null !== root) {
    observer.observe(root, {
        attributes: true,
        childList: true,
        subtree: true,
    });
}

/** Xhr function */

var Playground = {};
Playground.xhr = function (url, callback, method, data, dataType) {
    console.debug(url, callback, method, data, dataType);
    var xhr = new XMLHttpRequest();
    if (data) {
        if (-1 === url.indexOf('?')) {
            url += '?';
        }
        url += '&' + data;
        data = null;
    }
    if (-1 === url.indexOf('?')) {
        url += '?';
    }
    url += '&_method=' + (method || 'GET');
    if (dataType) {
        url += '&_type=' + dataType;
    }
    xhr.addEventListener('readystatechange', function () {
        if (4 === this.readyState && 200 === this.status) {
            var xhrCallback = document.querySelector('[data-xhr-callback]');
            if (xhrCallback && xhrCallback.getAttribute('data-xhr-callback')) {
                var f = eval(xhrCallback.getAttribute('data-xhr-callback'));
                return f(url, callback, method, data, dataType, this.responseText);
            }
            callback(this.responseText);
        }
    });
    xhr.open('GET', url);
    xhr.send(data || null);
}

Playground.xhrCallback = function(url, callback, method, data, dataType, r) {
    if (null === document.querySelector('[data-xhr-callback]')) {
        return callback(r);
    }

    r = r.replace(/data-reload="false"/g, '');

    var xhr = document.createElement('iframe');
    xhr.setAttribute('src', url);
    xhr.setAttribute('style', 'display: none;');
    document.body.appendChild(xhr);

    xhr.addEventListener('load', function() {
        xhr.contentWindow.addEventListener('php:output', function() {
            var r = xhr.contentWindow.document.body.innerHTML;
            console.debug(r);
            callback(r);
            setTimeout(function() {
                document.body.removeChild(xhr);
            }, 1000);
        });
    });
}

window.Playground = Playground;
