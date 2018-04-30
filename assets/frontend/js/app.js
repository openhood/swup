/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/frontend/js";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


iframe.onload = function () {
    init();
    iframe.addEventListener('load', init);
};

function init() {
    // console log
    var c = document.getElementById('console').querySelector('.scrollable');
    function appendToConsole(event) {
        if (document.querySelector('.enabled input:checked').value == "on") {
            var record = document.createElement('div');
            record.innerHTML = event.detail;
            c.append(record);
            c.scrollTop = c.scrollHeight;
        }
    }

    var iframe = document.getElementById('iframe');
    var iframeWindow = iframe.contentWindow;
    var iframeDocument = iframeWindow.document;
    var iframeHTML = iframeDocument.documentElement;
    var swup = iframeWindow.swup;
    changeEnable();

    iframeDocument.addEventListener('swup:enabled', appendToConsole);
    iframeDocument.addEventListener('swup:disabled', appendToConsole);
    iframeDocument.addEventListener('swup:contentReplaced', appendToConsole);
    iframeDocument.addEventListener('swup:pageView', appendToConsole);
    iframeDocument.addEventListener('swup:hoverLink', appendToConsole);
    iframeDocument.addEventListener('swup:clickLink', appendToConsole);
    iframeDocument.addEventListener('swup:animationOutDone', appendToConsole);
    iframeDocument.addEventListener('swup:pagePreloaded', appendToConsole);
    iframeDocument.addEventListener('swup:pageLoaded', appendToConsole);
    iframeDocument.addEventListener('swup:scrollStart', appendToConsole);
    iframeDocument.addEventListener('swup:scrollDone', appendToConsole);
    iframeDocument.addEventListener('swup:animationInDone', appendToConsole);
    iframeDocument.addEventListener('swup:pageRetrievedFromCache', appendToConsole);
    appendToConsole({ detail: "enabled" });
    appendToConsole({ detail: "pageView" });

    // animation switching
    var css = document.querySelector('#css');
    css.onkeyup = changeAnimation;

    function changeAnimation() {
        iframeHTML.querySelector('#style').innerHTML = css.innerText.replace(/\u00a0/g, " ");
    }
    changeAnimation();

    // cache
    var cache = document.querySelector('.cache .scrollable');
    iframeDocument.addEventListener('swup:pageLoaded', updateCache);
    iframeDocument.addEventListener('swup:pagePreloaded', updateCache);
    iframeDocument.addEventListener('swup:contentReplaced', updateCache);

    function updateCache() {
        var json = iframeWindow.swup.cache.pages;
        var list = "";
        Object.keys(json).forEach(function (record) {
            var url = json[record].url.replace('/swup', '').replace('/t', '').replace('index.html', '');
            list += '<span class="tag tag--' + url.replace(/\//g, '') + '">' + url + '</span>';
        });
        cache.innerHTML = list;
    }
    updateCache();

    // on/off switching
    document.querySelector('[name="enable-swup"]').onchange = changeEnable;
    function changeEnable(event) {
        var active = document.querySelector('[name="enable-swup"]').checked;

        if (active) {
            if (!iframeHTML.classList.contains('swup-enabled')) {
                iframeWindow.swup.enable();
                updateCache();
            }
        } else {
            if (iframeHTML.classList.contains('swup-enabled')) {
                iframeWindow.swup.destroy();
                updateCache();
                c.innerHTML = "";
            }
        }
    }

    // on/off preload
    document.querySelector('[name="enable-preload"]').onchange = changePreload;
    function changePreload(event) {
        var active = document.querySelector('[name="enable-preload"]').checked;

        if (active) {
            iframeWindow.swup.options.preload = true;
        } else {
            iframeWindow.swup.options.preload = false;
        }
    }

    // on/off cache
    document.querySelector('[name="enable-cache"]').onchange = changeCache;
    function changeCache(event) {
        var active = document.querySelector('[name="enable-cache"]').checked;

        if (active) {
            iframeWindow.swup.options.cache = true;
        } else {
            iframeWindow.swup.options.cache = false;
            iframeWindow.swup.cache.empty();
        }
        updateCache();
    }

    // address bar
    iframeDocument.addEventListener('swup:clickLink', updateAddressBar);
    iframe.addEventListener('load', updateAddressBar);

    var addressBar = document.querySelector('#address-bar');
    updateAddressBar();
    function updateAddressBar() {
        setTimeout(function () {
            iframeWindow = iframe.contentWindow;
            iframeDocument = iframeWindow.document;
            iframeHTML = iframeDocument.documentElement;
            addressBar.value = iframeWindow.location.pathname.replace('/swup', '').replace('/t', '').replace('index.html', '') + iframeWindow.location.hash;
        });
    }
}

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map