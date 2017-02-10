/*
 DynamicsWebApi v0.1.0 (for Microsoft Dynamics CRM 2016)
 
 Project references the following javascript libraries:
  > yaku (yaku.js) - https://github.com/ysmood/yaku
  > axios (axios.js) - https://github.com/mzabriskie/axios

 Copyright (c) 2017. 
 Author: Aleksandr Rogov (https://github.com/o4u)
 MIT License

*/

/* yaku v0.17.8 by Yad Smood.*/
!function(n){function t(e){if(r[e])return r[e].exports;var o=r[e]={exports:{},id:e,loaded:!1};return n[e].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var r={};return t.m=n,t.c=r,t.p="",t(0)}({0:/*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
function(n,t,r){(function(n){var t=r(/*! ./yaku */80);try{n.Promise=t,window.Promise=t}catch(err){}}).call(t,function(){return this}())},80:/*!*********************!*\
  !*** ./src/yaku.js ***!
  \*********************/
function(n,t){(function(t){!function(){"use strict";function r(){return en[q][B]||D}function e(n,t){for(var r in t)n[r]=t[r]}function o(n){return n&&"object"==typeof n}function i(n){return"function"==typeof n}function u(n,t){return n instanceof t}function c(n){return u(n,A)}function f(n,t,r){if(!t(n))throw v(r)}function s(){try{return C.apply(F,arguments)}catch(e){return nn.e=e,nn}}function a(n,t){return C=n,F=t,s}function l(n,t){function r(){for(var r=0;r<o;)t(e[r],e[r+1]),e[r++]=S,e[r++]=S;o=0,e.length>n&&(e.length=n)}var e=L(n),o=0;return function(n,t){e[o++]=n,e[o++]=t,2===o&&en.nextTick(r)}}function h(n,t){var r,e,o,c,f=0;if(!n)throw v(Q);var s=n[en[q][z]];if(i(s))e=s.call(n);else{if(!i(n.next)){if(u(n,L)){for(r=n.length;f<r;)t(n[f],f++);return f}throw v(Q)}e=n}for(;!(o=e.next()).done;)if(c=a(t)(o.value,f++),c===nn)throw i(e[G])&&e[G](),c.e;return f}function v(n){return new TypeError(n)}function _(n){return(n?"":V)+(new A).stack}function d(n,t){var r="on"+n.toLowerCase(),e=E[r];I&&I.listeners(n).length?n===Z?I.emit(n,t._v,t):I.emit(n,t):e?e({reason:t._v,promise:t}):en[n](t._v,t)}function p(n){return n&&n._s}function w(n){if(p(n))return new n(tn);var t,r,e;return t=new n(function(n,o){if(t)throw v();r=n,e=o}),f(r,i),f(e,i),t}function m(n,t){return function(r){H&&(n[M]=_(!0)),t===U?T(n,r):k(n,t,r)}}function y(n,t,r,e){return i(r)&&(t._onFulfilled=r),i(e)&&(n[J]&&d(Y,n),t._onRejected=e),H&&(t._p=n),n[n._c++]=t,n._s!==$&&on(n,t),t}function j(n){if(n._umark)return!0;n._umark=!0;for(var t,r=0,e=n._c;r<e;)if(t=n[r++],t._onRejected||j(t))return!0}function x(n,t){function r(n){return e.push(n.replace(/^\s+|\s+$/g,""))}var e=[];return H&&(t[M]&&r(t[M]),function o(n){n&&K in n&&(o(n._next),r(n[K]+""),o(n._p))}(t)),(n&&n.stack?n.stack:n)+("\n"+e.join("\n")).replace(rn,"")}function g(n,t){return n(t)}function k(n,t,r){var e=0,o=n._c;if(n._s===$)for(n._s=t,n._v=r,t===O&&(H&&c(r)&&(r.longStack=x(r,n)),un(n));e<o;)on(n,n[e++]);return n}function T(n,t){if(t===n&&t)return k(n,O,v(W)),n;if(t!==P&&(i(t)||o(t))){var r=a(b)(t);if(r===nn)return k(n,O,r.e),n;i(r)?(H&&p(t)&&(n._next=t),p(t)?R(n,t,r):en.nextTick(function(){R(n,t,r)})):k(n,U,t)}else k(n,U,t);return n}function b(n){return n.then}function R(n,t,r){var e=a(r,t)(function(r){t&&(t=P,T(n,r))},function(r){t&&(t=P,k(n,O,r))});e===nn&&t&&(k(n,O,e.e),t=P)}var S,C,F,P=null,E="object"==typeof window?window:t,H=!1,I=E.process,L=Array,A=Error,O=1,U=2,$=3,q="Symbol",z="iterator",B="species",D=q+"("+B+")",G="return",J="_uh",K="_pt",M="_st",N="Invalid this",Q="Invalid argument",V="\nFrom previous ",W="Chaining cycle detected for promise",X="Uncaught (in promise)",Y="rejectionHandled",Z="unhandledRejection",nn={e:P},tn=function(){},rn=/^.+\/node_modules\/yaku\/.+\n?/gm,en=n.exports=function(n){var t,r=this;if(!o(r)||r._s!==S)throw v(N);if(r._s=$,H&&(r[K]=_()),n!==tn){if(!i(n))throw v(Q);t=a(n)(m(r,U),m(r,O)),t===nn&&k(r,O,t.e)}};en["default"]=en,e(en.prototype,{then:function(n,t){if(void 0===this._s)throw v();return y(this,w(en.speciesConstructor(this,en)),n,t)},"catch":function(n){return this.then(S,n)},"finally":function(n){function t(t){return en.resolve(n()).then(function(){return t})}return this.then(t,t)},_c:0,_p:P}),en.resolve=function(n){return p(n)?n:T(w(this),n)},en.reject=function(n){return k(w(this),O,n)},en.race=function(n){var t=this,r=w(t),e=function(n){k(r,U,n)},o=function(n){k(r,O,n)},i=a(h)(n,function(n){t.resolve(n).then(e,o)});return i===nn?t.reject(i.e):r},en.all=function(n){function t(n){k(o,O,n)}var r,e=this,o=w(e),i=[];return r=a(h)(n,function(n,u){e.resolve(n).then(function(n){i[u]=n,--r||k(o,U,i)},t)}),r===nn?e.reject(r.e):(r||k(o,U,[]),o)},en.Symbol=E[q]||{},a(function(){Object.defineProperty(en,r(),{get:function(){return this}})})(),en.speciesConstructor=function(n,t){var e=n.constructor;return e?e[r()]||t:t},en.unhandledRejection=function(n,t){try{E.console.error(X,H?t.longStack:x(n,t))}catch(e){}},en.rejectionHandled=tn,en.enableLongStackTrace=function(){H=!0},en.nextTick=I?I.nextTick:function(n){setTimeout(n)},en._s=1;var on=l(999,function(n,t){var r,e;return e=n._s!==O?t._onFulfilled:t._onRejected,e===S?void k(t,n._s,n._v):(r=a(g)(e,n._v),r===nn?void k(t,O,r.e):void T(t,r))}),un=l(9,function(n){j(n)||(n[J]=1,d(Z,n))})}()}).call(t,function(){return this}())}});

/* axios v0.15.3 | (c) 2016 by Matt Zabriskie */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.axios=t():e.axios=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function r(e){var t=new i(e),n=s(i.prototype.request,t);return o.extend(n,i.prototype,t),o.extend(n,t),n}var o=n(2),s=n(3),i=n(4),a=n(5),u=r(a);u.Axios=i,u.create=function(e){return r(o.merge(a,e))},u.Cancel=n(22),u.CancelToken=n(23),u.isCancel=n(19),u.all=function(e){return Promise.all(e)},u.spread=n(24),e.exports=u,e.exports.default=u},function(e,t,n){"use strict";function r(e){return"[object Array]"===C.call(e)}function o(e){return"[object ArrayBuffer]"===C.call(e)}function s(e){return"undefined"!=typeof FormData&&e instanceof FormData}function i(e){var t;return t="undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer}function a(e){return"string"==typeof e}function u(e){return"number"==typeof e}function c(e){return"undefined"==typeof e}function f(e){return null!==e&&"object"==typeof e}function p(e){return"[object Date]"===C.call(e)}function d(e){return"[object File]"===C.call(e)}function l(e){return"[object Blob]"===C.call(e)}function h(e){return"[object Function]"===C.call(e)}function m(e){return f(e)&&h(e.pipe)}function y(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams}function w(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}function g(){return"undefined"!=typeof window&&"undefined"!=typeof document&&"function"==typeof document.createElement}function v(e,t){if(null!==e&&"undefined"!=typeof e)if("object"==typeof e||r(e)||(e=[e]),r(e))for(var n=0,o=e.length;n<o;n++)t.call(null,e[n],n,e);else for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.call(null,e[s],s,e)}function x(){function e(e,n){"object"==typeof t[n]&&"object"==typeof e?t[n]=x(t[n],e):t[n]=e}for(var t={},n=0,r=arguments.length;n<r;n++)v(arguments[n],e);return t}function b(e,t,n){return v(t,function(t,r){n&&"function"==typeof t?e[r]=E(t,n):e[r]=t}),e}var E=n(3),C=Object.prototype.toString;e.exports={isArray:r,isArrayBuffer:o,isFormData:s,isArrayBufferView:i,isString:a,isNumber:u,isObject:f,isUndefined:c,isDate:p,isFile:d,isBlob:l,isFunction:h,isStream:m,isURLSearchParams:y,isStandardBrowserEnv:g,forEach:v,merge:x,extend:b,trim:w}},function(e,t){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},function(e,t,n){"use strict";function r(e){this.defaults=e,this.interceptors={request:new i,response:new i}}var o=n(5),s=n(2),i=n(16),a=n(17),u=n(20),c=n(21);r.prototype.request=function(e){"string"==typeof e&&(e=s.merge({url:arguments[0]},arguments[1])),e=s.merge(o,this.defaults,{method:"get"},e),e.baseURL&&!u(e.url)&&(e.url=c(e.baseURL,e.url));var t=[a,void 0],n=Promise.resolve(e);for(this.interceptors.request.forEach(function(e){t.unshift(e.fulfilled,e.rejected)}),this.interceptors.response.forEach(function(e){t.push(e.fulfilled,e.rejected)});t.length;)n=n.then(t.shift(),t.shift());return n},s.forEach(["delete","get","head"],function(e){r.prototype[e]=function(t,n){return this.request(s.merge(n||{},{method:e,url:t}))}}),s.forEach(["post","put","patch"],function(e){r.prototype[e]=function(t,n,r){return this.request(s.merge(r||{},{method:e,url:t,data:n}))}}),e.exports=r},function(e,t,n){"use strict";function r(e,t){!s.isUndefined(e)&&s.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}function o(){var e;return"undefined"!=typeof XMLHttpRequest?e=n(7):"undefined"!=typeof process&&(e=n(7)),e}var s=n(2),i=n(6),a=/^\)\]\}',?\n/,u={"Content-Type":"application/x-www-form-urlencoded"},c={adapter:o(),transformRequest:[function(e,t){return i(t,"Content-Type"),s.isFormData(e)||s.isArrayBuffer(e)||s.isStream(e)||s.isFile(e)||s.isBlob(e)?e:s.isArrayBufferView(e)?e.buffer:s.isURLSearchParams(e)?(r(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):s.isObject(e)?(r(t,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if("string"==typeof e){e=e.replace(a,"");try{e=JSON.parse(e)}catch(e){}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,validateStatus:function(e){return e>=200&&e<300}};c.headers={common:{Accept:"application/json, text/plain, */*"}},s.forEach(["delete","get","head"],function(e){c.headers[e]={}}),s.forEach(["post","put","patch"],function(e){c.headers[e]=s.merge(u)}),e.exports=c},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t){r.forEach(e,function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])})}},function(e,t,n){"use strict";var r=n(2),o=n(8),s=n(11),i=n(12),a=n(13),u=n(9),c="undefined"!=typeof window&&window.btoa&&window.btoa.bind(window)||n(14);e.exports=function(e){return new Promise(function(t,f){var p=e.data,d=e.headers;r.isFormData(p)&&delete d["Content-Type"];var l=new XMLHttpRequest,h="onreadystatechange",m=!1;if("undefined"==typeof window||!window.XDomainRequest||"withCredentials"in l||a(e.url)||(l=new window.XDomainRequest,h="onload",m=!0,l.onprogress=function(){},l.ontimeout=function(){}),e.auth){var y=e.auth.username||"",w=e.auth.password||"";d.Authorization="Basic "+c(y+":"+w)}if(l.open(e.method.toUpperCase(),s(e.url,e.params,e.paramsSerializer),!0),l.timeout=e.timeout,l[h]=function(){if(l&&(4===l.readyState||m)&&(0!==l.status||l.responseURL&&0===l.responseURL.indexOf("file:"))){var n="getAllResponseHeaders"in l?i(l.getAllResponseHeaders()):null,r=e.responseType&&"text"!==e.responseType?l.response:l.responseText,s={data:r,status:1223===l.status?204:l.status,statusText:1223===l.status?"No Content":l.statusText,headers:n,config:e,request:l};o(t,f,s),l=null}},l.onerror=function(){f(u("Network Error",e)),l=null},l.ontimeout=function(){f(u("timeout of "+e.timeout+"ms exceeded",e,"ECONNABORTED")),l=null},r.isStandardBrowserEnv()){var g=n(15),v=(e.withCredentials||a(e.url))&&e.xsrfCookieName?g.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}if("setRequestHeader"in l&&r.forEach(d,function(e,t){"undefined"==typeof p&&"content-type"===t.toLowerCase()?delete d[t]:l.setRequestHeader(t,e)}),e.withCredentials&&(l.withCredentials=!0),e.responseType)try{l.responseType=e.responseType}catch(e){if("json"!==l.responseType)throw e}"function"==typeof e.onDownloadProgress&&l.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&l.upload&&l.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(e){l&&(l.abort(),f(e),l=null)}),void 0===p&&(p=null),l.send(p)})}},function(e,t,n){"use strict";var r=n(9);e.exports=function(e,t,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?t(r("Request failed with status code "+n.status,n.config,null,n)):e(n)}},function(e,t,n){"use strict";var r=n(10);e.exports=function(e,t,n,o){var s=new Error(e);return r(s,t,n,o)}},function(e,t){"use strict";e.exports=function(e,t,n,r){return e.config=t,n&&(e.code=n),e.response=r,e}},function(e,t,n){"use strict";function r(e){return encodeURIComponent(e).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var o=n(2);e.exports=function(e,t,n){if(!t)return e;var s;if(n)s=n(t);else if(o.isURLSearchParams(t))s=t.toString();else{var i=[];o.forEach(t,function(e,t){null!==e&&"undefined"!=typeof e&&(o.isArray(e)&&(t+="[]"),o.isArray(e)||(e=[e]),o.forEach(e,function(e){o.isDate(e)?e=e.toISOString():o.isObject(e)&&(e=JSON.stringify(e)),i.push(r(t)+"="+r(e))}))}),s=i.join("&")}return s&&(e+=(e.indexOf("?")===-1?"?":"&")+s),e}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e){var t,n,o,s={};return e?(r.forEach(e.split("\n"),function(e){o=e.indexOf(":"),t=r.trim(e.substr(0,o)).toLowerCase(),n=r.trim(e.substr(o+1)),t&&(s[t]=s[t]?s[t]+", "+n:n)}),s):s}},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){function e(e){var t=e;return n&&(o.setAttribute("href",t),t=o.href),o.setAttribute("href",t),{href:o.href,protocol:o.protocol?o.protocol.replace(/:$/,""):"",host:o.host,search:o.search?o.search.replace(/^\?/,""):"",hash:o.hash?o.hash.replace(/^#/,""):"",hostname:o.hostname,port:o.port,pathname:"/"===o.pathname.charAt(0)?o.pathname:"/"+o.pathname}}var t,n=/(msie|trident)/i.test(navigator.userAgent),o=document.createElement("a");return t=e(window.location.href),function(n){var o=r.isString(n)?e(n):n;return o.protocol===t.protocol&&o.host===t.host}}():function(){return function(){return!0}}()},function(e,t){"use strict";function n(){this.message="String contains an invalid character"}function r(e){for(var t,r,s=String(e),i="",a=0,u=o;s.charAt(0|a)||(u="=",a%1);i+=u.charAt(63&t>>8-a%1*8)){if(r=s.charCodeAt(a+=.75),r>255)throw new n;t=t<<8|r}return i}var o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";n.prototype=new Error,n.prototype.code=5,n.prototype.name="InvalidCharacterError",e.exports=r},function(e,t,n){"use strict";var r=n(2);e.exports=r.isStandardBrowserEnv()?function(){return{write:function(e,t,n,o,s,i){var a=[];a.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),r.isString(o)&&a.push("path="+o),r.isString(s)&&a.push("domain="+s),i===!0&&a.push("secure"),document.cookie=a.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()},function(e,t,n){"use strict";function r(){this.handlers=[]}var o=n(2);r.prototype.use=function(e,t){return this.handlers.push({fulfilled:e,rejected:t}),this.handlers.length-1},r.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},r.prototype.forEach=function(e){o.forEach(this.handlers,function(t){null!==t&&e(t)})},e.exports=r},function(e,t,n){"use strict";function r(e){e.cancelToken&&e.cancelToken.throwIfRequested()}var o=n(2),s=n(18),i=n(19),a=n(5);e.exports=function(e){r(e),e.headers=e.headers||{},e.data=s(e.data,e.headers,e.transformRequest),e.headers=o.merge(e.headers.common||{},e.headers[e.method]||{},e.headers||{}),o.forEach(["delete","get","head","post","put","patch","common"],function(t){delete e.headers[t]});var t=e.adapter||a.adapter;return t(e).then(function(t){return r(e),t.data=s(t.data,t.headers,e.transformResponse),t},function(t){return i(t)||(r(e),t&&t.response&&(t.response.data=s(t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)})}},function(e,t,n){"use strict";var r=n(2);e.exports=function(e,t,n){return r.forEach(n,function(n){e=n(e,t)}),e}},function(e,t){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},function(e,t){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},function(e,t){"use strict";e.exports=function(e,t){return e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,"")}},function(e,t){"use strict";function n(e){this.message=e}n.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},n.prototype.__CANCEL__=!0,e.exports=n},function(e,t,n){"use strict";function r(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise(function(e){t=e});var n=this;e(function(e){n.reason||(n.reason=new o(e),t(n.reason))})}var o=n(22);r.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},r.source=function(){var e,t=new r(function(t){e=t});return{token:t,cancel:e}},e.exports=r},function(e,t){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}}])});

var DynamicsWebApi = function () {

    var _context = function () {
        ///<summary>
        /// Private function to the context object.
        ///</summary>
        ///<returns>Context</returns>
        if (typeof GetGlobalContext != "undefined")
        { return GetGlobalContext(); }
        else {
            if (typeof Xrm != "undefined") {
                return Xrm.Page.context;
            }
            else { throw new Error("Context is not available."); }
        }
    };

    var isCrm8 = function () {
        /// <summary>
        /// Indicates whether it's CRM 2016 (and later) or earlier. 
        /// Used to check if Web API is available.
        /// </summary>

        //isOutlookClient is removed in CRM 2016 
        return typeof DynamicsWebApi._context().isOutlookClient == 'undefined';
    };

    var _getClientUrl = function () {
        ///<summary>
        /// Private function to return the server URL from the context
        ///</summary>
        ///<returns>String</returns>

        var clientUrl = Xrm.Page.context.getClientUrl();

        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }
        return clientUrl;
    };

    var webApiVersion = "8.0";

    var _webApiPath = function () {
        ///<summary>
        /// Private function to return the path to the Web API endpoint.
        ///</summary>
        ///<returns>String</returns>
        return _getClientUrl() + "/api/data/v" + webApiVersion + "/";
    };

    var _dateReviver = function (key, value) {
        ///<summary>
        /// Private function to convert matching string values to Date objects.
        ///</summary>
        ///<param name="key" type="String">
        /// The key used to identify the object property
        ///</param>
        ///<param name="value" type="String">
        /// The string value representing a date
        ///</param>
        var a;
        if (typeof value === 'string') {
            a = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.exec(value);
            if (a) {
                return new Date(value);
            }
        }
        return value;
    };

    var PROTECTION_PREFIX = /^\)\]\}',?\n/;

    var axiosCrm = axios.create({
        baseURL: _webApiPath(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'OData-Version': '4.0',
            'OData-MaxVersion': '4.0'
        },
        transformResponse: [function transformResponse(data) {
            /*eslint no-param-reassign:0*/
            if (typeof data === 'string') {
                data = data.replace(PROTECTION_PREFIX, '');
                try {
                    data = JSON.parse(data, _dateReviver);
                } catch (e) { /* Ignore */ }
            }
            return data;
        }]
    });

    var _errorHandler = function (req) {
        ///<summary>
        /// Private function return an Error object to the errorCallback
        ///</summary>
        ///<param name="req" type="XMLHttpRequest">
        /// The XMLHttpRequest response that returned an error.
        ///</param>
        ///<returns>Error</returns>
        return new Error("Error : " +
              req.status + ": " +
              req.statusText + ": " +
              JSON.parse(req.responseText).error.message);
    };

    var _parameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Object">
        /// The parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if ((typeof parameter === "undefined") || parameter === null) {
            throw new Error(message);
        }
    };
    var _stringParameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "string") {
            throw new Error(message);
        }
    };
    var _arrayParameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (parameter.constructor !== Array) {
            throw new Error(message);
        }
    };
    var _numberParameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Number">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "number") {
            throw new Error(message);
        }
    };
    var _boolParameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Boolean">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "boolean") {
            throw new Error(message);
        }
    };

    var _guidParameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameter is a valid GUID
        ///</summary>
        ///<param name="parameter" type="String">
        /// The GUID parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        /// <returns type="String" />

        try {
            return /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];
        }
        catch (error) {
            throw new Error(message);
        }
    }

    var retrieveMultipleOptions = function () {
        return {
            type: "",
            id: "",
            select: [],
            filter: "",
            maxPageSize: 1,
            count: true,
            top: 1,
            orderBy: [],
            includeAnnotations: ""
        }
    };
    var keyValuePairObject = function () {
        return {
            key: "",
            value: ""
        }
    };

    var convertOptionsToLink = function (options) {
        /// <summary>Builds the Web Api query string based on a passed options object parameter.</summary>
        /// <param name="options" type="retrieveMultipleOptions">Options</param>
        /// <returns type="String" />

        var optionString = "";

        if (options.type == null)
            _parameterCheck(options.type, "DynamicsWebApi.retrieveMultipleRecords requires object.type parameter");
        else
            _stringParameterCheck(options.type, "DynamicsWebApi.retrieveMultipleRecords requires the object.type parameter is a string.");

        if (options.select != null) {
            _arrayParameterCheck(options.select, "DynamicsWebApi.retrieveMultipleRecords requires the object.select parameter is an array.");

            if (options.select.length > 0) {
                optionString = "$select=" + options.select.join(',');
            }
        }

        if (options.filter != null) {
            _stringParameterCheck(options.filter, "DynamicsWebApi.retrieveMultipleRecords requires the object.filter parameter is a string.");

            if (optionString != null)
                optionString += "&";

            optionString += "$filter=" + options.filter;
        }

        if (options.maxPageSize != null) {
            _numberParameterCheck(options.maxPageSize, "DynamicsWebApi.retrieveMultipleRecords requires the object.maxPageSize parameter is a number.");
        }

        if (options.count != null) {
            _boolParameterCheck(options.count, "DynamicsWebApi.retrieveMultipleRecords requires the object.count parameter is a boolean.");

            if (optionString != null)
                optionString += "&";

            optionString += "$count=" + options.count;
        }

        if (options.top != null) {
            _intParameterCheck(options.top, "DynamicsWebApi.retrieveMultipleRecords requires the object.top parameter is a number.");

            if (optionString != null)
                optionString += "&";

            optionString += "$top=" + options.top;
        }

        if (options.orderBy != null) {
            _arrayParameterCheck(options.orderBy, "DynamicsWebApi.retrieveMultipleRecords requires the object.orderBy parameter is an array.");

            if (options.orderBy.length > 0) {
                optionString = "$orderBy=" + options.orderBy.join(',');
            }
        }

        if (options.includeAnnotations != null) {
            _stringParameterCheck(options.includeAnnotations, "DynamicsWebApi.retrieveMultipleRecords requires the object.includeAnnotations parameter is a string.");
        }

        var url = options.type.toLowerCase() + "s";

        if (options.id != null) {
            _guidParameterCheck(options.id, "DynamicsWebApi.retrieveMultipleRecords requires object.id parameter is a guid");
            url += "(" + options.id + ")"
        }

        if (optionString != null)
            url += "?" + optionString;

        return url;
    };

    var createRecord = function (object, type, returnData) {
        ///<summary>
        /// Sends an asynchronous request to create a new record.
        ///</summary>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the Schema name of
        /// entity attributes that are valid for create operations.
        ///</param>
        ///<param name="type" type="String">
        /// The Logical Name of the Entity type record to create.
        /// For an Account record, use "account"
        ///</param>
        ///<param name="returnData" type="Boolean" optional="true">
        /// If indicated and "true" the operation returns a created object
        ///</param>
        /// <returns type="Promise" />

        _parameterCheck(object, "DynamicsWebApi.createRequest requires the object parameter.");
        _stringParameterCheck(type, "DynamicsWebApi.createRequest requires the type parameter is a string.");

        var additionalConfig = null;

        if (returnData != null) {
            _boolParameterCheck(returnData, "DynamicsWebApi.createRecord requires the returnData parameter a boolean.");
            additionalConfig = { headers: { "Prefer": "return=representation" } };
        }

        return axiosCrm
            .post(type.toLowerCase() + "s", object, additionalConfig)
            .then(function (response) {
                if (returnData) {
                    return response;
                }

                var entityUrl = response.headers['odata-entityid'];
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                return id;
            });
    };

    var retrieveRecord = function (id, type, select, expand) {
        ///<summary>
        /// Sends an asynchronous request to retrieve a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="type" type="String">
        /// The Logical Name of the Entity type record to retrieve.
        /// For an Account record, use "account"
        ///</param>
        ///<param name="select" type="Array">
        /// An Array representing the $select OData System Query Option to control which
        /// attributes will be returned. This is a list of Attribute names that are valid for retrieve.
        /// If null all properties for the record will be returned
        ///</param>
        ///<param name="expand" type="String">
        /// A String representing the $expand OData System Query Option value to control which
        /// related records are also returned. This is a comma separated list of of up to 6 entity relationship names
        /// If null no expanded related records will be returned.
        ///</param>
        /// <returns type="Promise" />

        _stringParameterCheck(id, "DynamicsWebApi.retrieveRecord requires the id parameter is a string.");
        id = _guidParameterCheck(id, "DynamicsWebApi.retrieveRecord requires the id is GUID.")
        _stringParameterCheck(type, "DynamicsWebApi.retrieveRecord requires the type parameter is a string.");
        if (select != null)
            _arrayParameterCheck(select, "DynamicsWebApi.retrieveRecord requires the select parameter is an array.");
        if (expand != null)
            _stringParameterCheck(expand, "DynamicsWebApi.retrieveRecord requires the expand parameter is a string.");

        var systemQueryOptions = "";

        if (select != null || expand != null) {
            systemQueryOptions = "?";
            if (select != null && select.length > 0) {
                var selectString = "$select=" + select.join(',');
                if (expand != null) {
                    selectString = selectString + "," + expand;
                }
                systemQueryOptions = systemQueryOptions + selectString;
            }
            if (expand != null) {
                systemQueryOptions = systemQueryOptions + "&$expand=" + expand;
            }
        }

        return axiosCrm.get(type.toLowerCase() + "s" + "(" + id + ")" + systemQueryOptions).then(function (response) {
            return response.data;
        });
    };
    var updateRecord = function (id, type, object, returnData, select) {
        ///<summary>
        /// Sends an asynchronous request to update a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the logical names for
        /// entity attributes that are valid for update operations.
        ///</param>
        ///<param name="type" type="String">
        /// The Logical Name of the Entity type record to retrieve.
        /// For an Account record, use "account"
        ///</param>
        ///<param name="returnData" type="Boolean" optional="true">
        /// If indicated and "true" the operation returns an updated object
        ///</param>
        ///<param name="select" type="Array" optional="true">
        /// Limits returned properties with updateRequest when returnData equals "true". 
        ///</param>
        /// <returns type="Promise" />
        _stringParameterCheck(id, "DynamicsWebApi.updateRecord requires the id parameter.");
        id = _guidParameterCheck(id, "DynamicsWebApi.updateRecord requires the id is GUID.")
        _parameterCheck(object, "DynamicsWebApi.updateRecord requires the object parameter.");
        _stringParameterCheck(type, "DynamicsWebApi.updateRecord requires the type parameter.");

        var additionalConfig = null;

        if (returnData != null) {
            _boolParameterCheck(returnData, "DynamicsWebApi.updateRecord requires the returnData parameter a boolean.");
            additionalConfig = { headers: { "Prefer": "return=representation" } };
        }

        var systemQueryOptions = "";

        if (select != null) {
            _arrayParameterCheck(select, "DynamicsWebApi.updateRecord requires the select parameter an array.");

            if (select != null && select.length > 0) {
                systemQueryOptions = "?" + select.join(",");
            }
        }

        return axiosCrm.patch(type.toLowerCase() + "s" + "(" + id + ")" + systemQueryOptions, object, additionalConfig);
    };
    var updateSingleProperty = function (id, type, keyValuePair) {
        ///<summary>
        /// Sends an asynchronous request to update a single value in the record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="keyValuePair" type="keyValuePairObject">
        /// keyValuePair object with a name of the field as a key and a value. Example:
        /// <para>{key: "subject", value: "Update Record"}</para>
        ///</param>
        ///<param name="type" type="String">
        /// The Logical Name of the Entity type record to retrieve.
        /// For an Account record, use "account"
        ///</param>
        /// <returns type="Promise" />

        _stringParameterCheck(id, "DynamicsWebApi.updateSingleProperty requires the id parameter.");
        id = _guidParameterCheck(id, "DynamicsWebApi.updateSingleProperty requires the id is GUID.")
        _parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty requires the keyValuePair parameter.");
        _stringParameterCheck(type, "DynamicsWebApi.updateSingleProperty requires the type parameter.");

        return axiosCrm.put(type.toLowerCase() + "s" + "(" + id + ")/" + keyValuePair.key, { value: keyValuePair.value });
    };
    var deleteRequest = function (id, type, propertyName) {
        ///<summary>
        /// Sends an asynchronous request to delete a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to delete.
        ///</param>
        ///<param name="type" type="String">
        /// The Logical Name of the Entity type record to delete.
        /// For an Account record, use "account"
        ///</param>
        ///<param name="propertyName" type="String" optional="true">
        /// The name of the property which needs to be emptied. Instead of removing a whole record
        /// only the specified property will be cleared.
        ///</param>
        /// <returns type="Promise" />

        _stringParameterCheck(id, "DynamicsWebApi.deleteRequest requires the id parameter.");
        id = _guidParameterCheck(id, "DynamicsWebApi.deleteRequest requires the id is GUID.")
        _stringParameterCheck(type, "DynamicsWebApi.deleteRequest requires the type parameter.");

        if (propertyName != null)
            _stringParameterCheck(propertyName, "DynamicsWebApi.deleteRequest requires the propertyName parameter.");

        var url = type.toLowerCase() + "s(" + id + ")";

        if (propertyName != null)
            url += "/" + propertyName;

        return axiosCrm.delete(url);
    };

    var upsertRecord = function (id, type, object, ifmatch, ifnonematch) {
        ///<summary>
        /// Sends an asynchronous request to Upsert a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the logical names for
        /// entity attributes that are valid for upsert operations.
        ///</param>
        ///<param name="type" type="String">
        /// The Logical Name of the Entity type record to Upsert.
        /// For an Account record, use "account".
        ///</param>
        ///<param name="ifmatch" type="String" optional="true">
        /// To prevent a creation of the record use "*". Sets header "If-Match".
        ///</param>
        ///<param name="ifnonematch" type="String" optional="true">
        /// To prevent an update of the record use "*". Sets header "If-None-Match".
        ///</param>
        /// <returns type="Promise" />

        _stringParameterCheck(id, "DynamicsWebApi.upsertRecord requires the id parameter.");
        id = _guidParameterCheck(id, "DynamicsWebApi.upsertRecord requires the id is GUID.")

        _parameterCheck(object, "DynamicsWebApi.upsertRecord requires the object parameter.");
        _stringParameterCheck(type, "DynamicsWebApi.upsertRecord requires the type parameter.");

        if (ifmatch != null && ifnonematch != null) {
            throw Error("Either one of ifmatch or ifnonematch parameters shoud be used in a call, not both.")
        }

        var additionalConfig = null;

        if (ifmatch != null) {
            _stringParameterCheck(ifmatch, "DynamicsWebApi.upsertRecord requires the ifmatch parameter is a string.");

            additionalConfig = { headers: { 'If-Match': ifmatch } };
        }

        if (ifnonematch != null) {
            _stringParameterCheck(ifmatch, "DynamicsWebApi.upsertRecord requires the ifnonematch parameter is a string.");

            additionalConfig = { headers: { 'If-None-Match': ifnonematch } };
        }

        return axiosCrm.patch(type.toLowerCase() + "s" + "(" + id + ")", object, additionalConfig)
            .then(function (response) {
                if (response.status == 204) {
                    var entityUrl = response.headers['odata-entityid'];
                    var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                    return id;
                }
            })
            .catch(function (error) {
                if (ifnonematch != null && error.response.status == 412) {
                    //if prevent update
                    return;
                }
                else if (ifmatch != null && error.response.status == 404) {
                    //if prevent create
                    return;
                }
                else {
                    //rethrow error otherwise
                    throw error;
                }
            });
    }

    var countRecords = function (type, filter) {
        ///<summary>
        /// Sends an asynchronous request to count records.
        ///</summary>
        /// <param name="type" type="String">The Logical Name of the Entity to retrieve. For an Account record, use "account".</param>
        /// <param name="filter" type="String">Use the $filter system query option to set criteria for which entities will be returned.</param>
        /// <returns type="Promise" />

        return retrieveMultipleRecordsAdvanced({
            type: type,
            select: [type.toLowerCase() + "id"],
            filter: filter,
            count: true
        }, null)
            .then(function (response) {
                return response.oDataCount != null ? response.oDataCount : 0;
            });
    }


    var retrieveMultipleRecords = function (type, select, filter, nextPageLink) {
        ///<summary>
        /// Sends an asynchronous request to retrieve records.
        ///</summary>
        /// <param name="type" type="String">The Logical Name of the Entity to retrieve. For an Account record, use "account".</param>
        /// <param name="select" type="Array">Use the $select system query option to limit the properties returned as shown in the following example.</param>
        /// <param name="filter" type="String">Use the $filter system query option to set criteria for which entities will be returned.</param>
        /// <param name="nextPageLink" type="String">Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.</param>
        /// <returns type="Promise" />

        return retrieveMultipleRecordsAdvanced({
            type: type,
            select: select,
            filter: filter
        }, nextPageLink);
    }

    var retrieveMultipleRecordsAdvanced = function (retrieveMultipleOptions, nextPageLink) {
        ///<summary>
        /// Sends an asynchronous request to retrieve records.
        ///</summary>
        ///<param name="retrieveMultipleOptions" type="Object">
        /// Retrieve multiple request options
        ///<para>   object.type (String). 
        ///             The Logical Name of the Entity to retrieve. For an Account record, use "account".</para>
        ///<para>   object.id (String).
        ///             A String representing the GUID value for the record to retrieve.
        ///<para>   object.select (Array). 
        ///             Use the $select system query option to limit the properties returned as shown in the following example.</para>
        ///<para>   object.filter (String). 
        ///             Use the $filter system query option to set criteria for which entities will be returned.</para>
        ///<para>   object.maxPageSize (Number). 
        ///             Use the odata.maxpagesize preference value to request the number of entities returned in the response.</para>
        ///<para>   object.count (Boolean). 
        ///             Use the $count system query option with a value of true to include a count of entities that match the filter criteria up to 5000. Do not use $top with $count!</para>
        ///<para>   object.top (Number). 
        ///             Limit the number of results returned by using the $top system query option. Do not use $top with $count!</para>
        ///<para>   object.orderBy (Array). 
        ///             Use the order in which items are returned using the $orderby system query option. Use the asc or desc suffix to specify ascending or descending order respectively. The default is ascending if the suffix isn't applied.</para>
        ///<para>   object.includeAnnotations (String). 
        ///             Values can be "OData.Community.Display.V1.FormattedValue"; "*" - for lookups.</para>
        ///</param>
        ///<param name="select" type="nextPageLink" optional="true">
        /// Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
        ///</param>

        if (nextPageLink != null)
            _stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple requires the nextPageLink parameter is a string.");

        var url = nextPageLink == null
            ? convertOptionsToLink(retrieveMultipleOptions)
            : nextPageLink;

        var additionalConfig = null;

        if (nextPageLink == null) {
            if (retrieveMultipleOptions.maxPageSize != null) {
                additionalConfig = { headers: { 'Prefer': 'odata.maxpagesize=' + retrieveMultipleOptions.maxPageSize } };
            }
            if (retrieveMultipleOptions.includeAnnotations != null) {
                additionalConfig = { headers: { 'Prefer': 'odata.include-annotations="' + retrieveMultipleOptions.includeAnnotations + '"' } };
            }
        }

        return axiosCrm.get(url, additionalConfig)
            .then(function (response) {
                if (response.data['@odata.nextLink'] != null) {
                    response.data.value.oDataNextLink = response.data['@odata.nextLink'];
                }
                if (response.data['@odata.count'] != null) {
                    response.data.value.oDataCount = response.data['@odata.count'];
                }

                return response.data.value;
            });
    }

    var getPagingCookie = function (pageCokies) {
        var pagingInfo = {};
        var pageNumber = null;
 
        try {
            //get the page cokies
            pageCokies = unescape(unescape(pageCokies));
 
            //get the pageNumber
            pageNumber = parseInt(pageCokies.substring(pageCokies.indexOf("=") + 1, pageCokies.indexOf("pagingcookie")).replace(/\"/g, '').trim());
 
            // this line is used to get the cookie part
            pageCokies = pageCokies.substring(pageCokies.indexOf("pagingcookie"), (pageCokies.indexOf("/>") + 12));
            pageCokies = pageCokies.substring(pageCokies.indexOf("=") + 1, pageCokies.length);
            pageCokies = pageCokies.substring(1, pageCokies.length - 1);
 
            //replace special character 
            pageCokies = pageCokies.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '\'').replace(/\'/g, '&' + 'quot;');
 
            //append paging-cookie
            pageCokies = "paging-cookie ='" + pageCokies + "'";
 
            //set the parameter
            pagingInfo.pageCokies = pageCokies;
            pagingInfo.pageNumber = pageNumber;
 
        } catch (e) {
            throw new Error(e);
        }
 
        return pagingInfo;
    }

    var fetchXmlRequest = function (type, fetchXml, includeAnnotations) {
        ///<summary>
        /// Sends an asynchronous request to count records.
        ///</summary>
        /// <param name="type" type="String">The Logical Name of the Entity to retrieve. For an Account record, use "account".</param>
        /// <param name="fetchXml" type="String">FetchXML is a proprietary query language that provides capabilities to perform aggregation.</param>
        /// <param name="includeAnnotations" type="String" optional="true">Use this parameter to include annotations to a result.<para>For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie</para></param>
        /// <returns type="Promise" />

        _stringParameterCheck(type, "DynamicsWebApi.fetchXmlRequest requires the type parameter.");
        _stringParameterCheck(fetchXml, "DynamicsWebApi.fetchXmlRequest requires the fetchXml parameter.");

        var additionalConfig = null;
        if (includeAnnotations != null) {
            _stringParameterCheck(includeAnnotations, "DynamicsWebApi.fetchXmlRequest requires the includeAnnotations as a string.");
            additionalConfig = { headers: { 'Prefer': 'odata.include-annotations="' + includeAnnotations + '"' } };
        }

        var encodedFetchXml = encodeURI(fetchXml);

        return axiosCrm.get(type.toLowerCase() + "s" + "?fetchXml=" + encodedFetchXml, additionalConfig)
            .then(function (response) {
                if (response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'] != null) {
                    response.data.value.fetchXmlPagingCookie = getPagingCookie(response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie']);
                }
                return response.data.value;
            });
    }

    return {
        createRequest: createRecord,
        updateRequest: updateRecord,
        upsertRequest: upsertRecord,
        deleteRequest: deleteRequest,
        fetchXmlRequest: fetchXmlRequest,
        countRecords: countRecords,
        retrieveRecord: retrieveRecord,
        retrieveMultiple: retrieveMultipleRecords,
        retrieveMultipleAdvanced: retrieveMultipleRecordsAdvanced,
        updateSingleProperty: updateSingleProperty,
        webApiVersion: webApiVersion
    }
}();

//DynamicsWebApi.webApiVersion = "8.0";