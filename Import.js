/**
 * Import.js v1.0.1
 * Pequeña librería para "importar" scripts y estilos de forma sincrona, asincrona ó diferido (default)
 * (c) 2021 Emanuel Rojas Vásquez
 * MIT License
 * [Compatibility IE11+]
 * https://github.com/erovas/Import.js
 */
(function(window, document){

    if(window.Import)
        return console.error('Import.js has already been defined');

    let HEAD = document.head;
    let FN = function(){};
    let LOAD = 'load';
    let ERROR = 'error';
    let SYNC = 'sync';
    let ASYNC = 'async';
    //let DEFER = 'defer';

    //#region Funciones auxiliares descarga de fichero

    function _aux_XHR_Sync(src, load, error){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', src, false);
        xhr.send();
        let xhrStatus = xhr.status;
        //respuesta satisfactoria (200 a 299) ó cache (304)
        if((xhrStatus >= 200 && xhrStatus < 300) || xhrStatus == 304)
            load(xhr.responseText);
        else
            error(src, xhrStatus, xhr.statusText);
    }

    function _aux_XHR_Async(src, load, error){
        let xhr = new XMLHttpRequest();
        xhr.onloadend = function(){
            let xhrStatus = xhr.status;
            //respuesta satisfactoria (200 a 299) ó cache (304)
            if((xhrStatus >= 200 && xhrStatus < 300) || xhrStatus == 304)
                load(xhr.responseText);
            else
                error(src, xhrStatus, xhr.statusText);
        }
        xhr.open('GET', src, true);
        xhr.send();
    }

    function _aux_load(tag, isStyle, load){
        return function(responseText){
            if(isStyle){
                //Generar estilos
                let style_temp = document.createElement('style');
                style_temp.innerHTML = responseText;
                HEAD.appendChild(style_temp);
                HEAD.appendChild(tag);

                let rules = style_temp.sheet.cssRules
                for (let i = 0; i < rules.length; i++)
                    tag.sheet.insertRule(rules[i].cssText, i);
                
                HEAD.removeChild(style_temp);
                load(tag);
            }
            else {
                tag.innerHTML = responseText;
                //Cargar el script al DOM
                HEAD.appendChild(tag);
                //remover el <tag> del DOM
                HEAD.removeChild(tag);
                load(tag);
            }
        }
    }

    //#endregion

    function _aux_GET(tag, src, options){
        let isStyle = tag.tagName == 'STYLE'? true : false;
        let opts = options || {};
        let mode = opts.mode;
        let load = opts[LOAD]? opts[LOAD] : FN;
        let error = opts[ERROR]? opts[ERROR] : FN;

        if(mode == SYNC)
            _aux_XHR_Sync(src, _aux_load(tag, isStyle, load), error);

        else if(mode == ASYNC)
            _aux_XHR_Async(src, _aux_load(tag, isStyle, load), error);

        else{ //DEFER
            if(isStyle){
                tag = document.createElement('link');
                tag.href = src;
                tag.rel = 'stylesheet';
            }
            else {
                tag.async = false;
                tag.defer = true;
                tag.src = src;
            }
            tag.onload = function(){
                if(!isStyle)  //es un SCRIPT
                    HEAD.removeChild(tag);
                load(tag);
            };
            tag.onerror = function(e){
                HEAD.removeChild(tag);
                error(src, -1, 'unknow');
            }

            //Se agrega el <tag> al DOM para cargarlo
            HEAD.appendChild(tag);
        }
    }

    //Revelacion
    window.Import = {
        JS: function(src, options){
            _aux_GET(document.createElement('script'), src + '.js' , options);
        },
        CSS: function(href, options){
            _aux_GET(document.createElement('style'), href + '.css', options);
        }
    }

})(window, document);