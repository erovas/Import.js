/**
 * Import.js v1.0.0
 * Pequeña librería para "importar" scripts y estilos de forma sincrona, asincrona ó diferido (default)
 * (c) 2021 Emanuel Rojas Vásquez
 * MIT License
 * [Compatibility IE11+]
 * https://github.com/erovas/Import.js
 */
Object.defineProperty(window, 'Import', {
    value: (function(document){

        const sync = 'sync';
        const async = 'async';
        //const defer = 'defer';

        const _xhrImportant = function(src_href){
            const xhr = new XMLHttpRequest();
            xhr.open('GET', src_href, false);
            xhr.send();
            return xhr;
        }

        const _xhrAsync = function(src_href, callback, onerror){
            const xhr = new XMLHttpRequest();
            xhr.onload = function(){
                callback(xhr.responseText);
            };
            xhr.onerror = function(){
                onerror(src_href, xhr.status, xhr.statusText);
            };
            xhr.open('GET', src_href, true);
            xhr.send();
        }

        const _get = function(tag, src_href, options){
            const isStyle = tag.tagName === 'STYLE'? true: false;

            options = typeof options !== 'object'? { mode: 'normal' } : options;
            options.onload = typeof options.onload !== 'function'? function(){} : options.onload;
            options.onerror = typeof options.onerror !== 'function'? function(){} : options.onerror;

            const onerror = options.onerror;

            switch ((options.mode+'').toLowerCase()) {
                case sync:
                    const xhr = _xhrImportant(src_href);
                    if(xhr.status === 200){
                        tag.innerHTML = xhr.responseText;
                        document.head.appendChild(tag);
                        if(!isStyle)
                            document.head.removeChild(tag);
                        options.onload(tag);
                    }
                    else 
                        onerror(src_href, xhr.status, xhr.statusText);
                    break;
                
                case async:
                    _xhrAsync(src_href, function(innerHTML){
                        tag.innerHTML = innerHTML;
                        document.head.appendChild(tag);
                        if(!isStyle)
                            document.head.removeChild(tag);
                        options.onload(tag);
                    }, onerror);
                    break;
            
                default:
                    if(isStyle)
                        tag = document.createElement('link');
                    
                    tag.onload = function(){
                        if(!isStyle)
                            tag.parentNode.removeChild(tag);
                        options.onload(tag);
                    };
                    tag.onerror = function(e){
                        tag.parentNode.removeChild(tag);
                        onerror(src_href, -1, 'unknow');
                    }
                    if(isStyle) {
                        tag.href = src_href;
                        tag.rel = 'stylesheet';
                    }
                    else {
                        tag.async = false;
                        tag.src = src_href;
                    }
                    document.head.appendChild(tag);
                    break;
            }
        }

        const JS = function(src, options){
            _get(document.createElement('script'), src + '.js', options);
        }

        const CSS = function(href, options){
            _get(document.createElement('style'), href + '.css', options);
        }

        return {
            JS: JS,
            CSS: CSS
        }
    })(document),
    writable: false
});