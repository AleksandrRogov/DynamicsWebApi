/*
 DynamicsWebApi v0.9.0 (for Dynamics 365 (online), Dynamics 365 (on-premises), Dynamics CRM 2016, Dynamics CRM Online)
 
 Project references the following javascript libraries:
  > yaku (yaku.js) - https://github.com/ysmood/yaku

 Copyright (c) 2017. 
 Author: Aleksandr Rogov (https://github.com/AleksandrRogov)
 MIT License

*/

/* yaku v0.17.8 by Yad Smood.*/
!function (n) { function t(e) { if (r[e]) return r[e].exports; var o = r[e] = { exports: {}, id: e, loaded: !1 }; return n[e].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports } var r = {}; return t.m = n, t.c = r, t.p = "", t(0) }({
    0:/*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
    function (n, t, r) { (function (n) { var t = r(/*! ./yaku */80); try { n.Promise = t, window.Promise = t } catch (err) { } }).call(t, function () { return this }()) }, 80:/*!*********************!*\
  !*** ./src/yaku.js ***!
  \*********************/
    function (n, t) { (function (t) { !function () { "use strict"; function r() { return en[q][B] || D } function e(n, t) { for (var r in t) n[r] = t[r] } function o(n) { return n && "object" == typeof n } function i(n) { return "function" == typeof n } function u(n, t) { return n instanceof t } function c(n) { return u(n, A) } function f(n, t, r) { if (!t(n)) throw v(r) } function s() { try { return C.apply(F, arguments) } catch (e) { return nn.e = e, nn } } function a(n, t) { return C = n, F = t, s } function l(n, t) { function r() { for (var r = 0; r < o;) t(e[r], e[r + 1]), e[r++] = S, e[r++] = S; o = 0, e.length > n && (e.length = n) } var e = L(n), o = 0; return function (n, t) { e[o++] = n, e[o++] = t, 2 === o && en.nextTick(r) } } function h(n, t) { var r, e, o, c, f = 0; if (!n) throw v(Q); var s = n[en[q][z]]; if (i(s)) e = s.call(n); else { if (!i(n.next)) { if (u(n, L)) { for (r = n.length; f < r;) t(n[f], f++); return f } throw v(Q) } e = n } for (; !(o = e.next()).done;) if (c = a(t)(o.value, f++), c === nn) throw i(e[G]) && e[G](), c.e; return f } function v(n) { return new TypeError(n) } function _(n) { return (n ? "" : V) + (new A).stack } function d(n, t) { var r = "on" + n.toLowerCase(), e = E[r]; I && I.listeners(n).length ? n === Z ? I.emit(n, t._v, t) : I.emit(n, t) : e ? e({ reason: t._v, promise: t }) : en[n](t._v, t) } function p(n) { return n && n._s } function w(n) { if (p(n)) return new n(tn); var t, r, e; return t = new n(function (n, o) { if (t) throw v(); r = n, e = o }), f(r, i), f(e, i), t } function m(n, t) { return function (r) { H && (n[M] = _(!0)), t === U ? T(n, r) : k(n, t, r) } } function y(n, t, r, e) { return i(r) && (t._onFulfilled = r), i(e) && (n[J] && d(Y, n), t._onRejected = e), H && (t._p = n), n[n._c++] = t, n._s !== $ && on(n, t), t } function j(n) { if (n._umark) return !0; n._umark = !0; for (var t, r = 0, e = n._c; r < e;) if (t = n[r++], t._onRejected || j(t)) return !0 } function x(n, t) { function r(n) { return e.push(n.replace(/^\s+|\s+$/g, "")) } var e = []; return H && (t[M] && r(t[M]), function o(n) { n && K in n && (o(n._next), r(n[K] + ""), o(n._p)) }(t)), (n && n.stack ? n.stack : n) + ("\n" + e.join("\n")).replace(rn, "") } function g(n, t) { return n(t) } function k(n, t, r) { var e = 0, o = n._c; if (n._s === $) for (n._s = t, n._v = r, t === O && (H && c(r) && (r.longStack = x(r, n)), un(n)) ; e < o;) on(n, n[e++]); return n } function T(n, t) { if (t === n && t) return k(n, O, v(W)), n; if (t !== P && (i(t) || o(t))) { var r = a(b)(t); if (r === nn) return k(n, O, r.e), n; i(r) ? (H && p(t) && (n._next = t), p(t) ? R(n, t, r) : en.nextTick(function () { R(n, t, r) })) : k(n, U, t) } else k(n, U, t); return n } function b(n) { return n.then } function R(n, t, r) { var e = a(r, t)(function (r) { t && (t = P, T(n, r)) }, function (r) { t && (t = P, k(n, O, r)) }); e === nn && t && (k(n, O, e.e), t = P) } var S, C, F, P = null, E = "object" == typeof window ? window : t, H = !1, I = E.process, L = Array, A = Error, O = 1, U = 2, $ = 3, q = "Symbol", z = "iterator", B = "species", D = q + "(" + B + ")", G = "return", J = "_uh", K = "_pt", M = "_st", N = "Invalid this", Q = "Invalid argument", V = "\nFrom previous ", W = "Chaining cycle detected for promise", X = "Uncaught (in promise)", Y = "rejectionHandled", Z = "unhandledRejection", nn = { e: P }, tn = function () { }, rn = /^.+\/node_modules\/yaku\/.+\n?/gm, en = n.exports = function (n) { var t, r = this; if (!o(r) || r._s !== S) throw v(N); if (r._s = $, H && (r[K] = _()), n !== tn) { if (!i(n)) throw v(Q); t = a(n)(m(r, U), m(r, O)), t === nn && k(r, O, t.e) } }; en["default"] = en, e(en.prototype, { then: function (n, t) { if (void 0 === this._s) throw v(); return y(this, w(en.speciesConstructor(this, en)), n, t) }, "catch": function (n) { return this.then(S, n) }, "finally": function (n) { function t(t) { return en.resolve(n()).then(function () { return t }) } return this.then(t, t) }, _c: 0, _p: P }), en.resolve = function (n) { return p(n) ? n : T(w(this), n) }, en.reject = function (n) { return k(w(this), O, n) }, en.race = function (n) { var t = this, r = w(t), e = function (n) { k(r, U, n) }, o = function (n) { k(r, O, n) }, i = a(h)(n, function (n) { t.resolve(n).then(e, o) }); return i === nn ? t.reject(i.e) : r }, en.all = function (n) { function t(n) { k(o, O, n) } var r, e = this, o = w(e), i = []; return r = a(h)(n, function (n, u) { e.resolve(n).then(function (n) { i[u] = n, --r || k(o, U, i) }, t) }), r === nn ? e.reject(r.e) : (r || k(o, U, []), o) }, en.Symbol = E[q] || {}, a(function () { Object.defineProperty(en, r(), { get: function () { return this } }) })(), en.speciesConstructor = function (n, t) { var e = n.constructor; return e ? e[r()] || t : t }, en.unhandledRejection = function (n, t) { try { E.console.error(X, H ? t.longStack : x(n, t)) } catch (e) { } }, en.rejectionHandled = tn, en.enableLongStackTrace = function () { H = !0 }, en.nextTick = I ? I.nextTick : function (n) { setTimeout(n) }, en._s = 1; var on = l(999, function (n, t) { var r, e; return e = n._s !== O ? t._onFulfilled : t._onRejected, e === S ? void k(t, n._s, n._v) : (r = a(g)(e, n._v), r === nn ? void k(t, O, r.e) : void T(t, r)) }), un = l(9, function (n) { j(n) || (n[J] = 1, d(Z, n)) }) }() }).call(t, function () { return this }()) }
});

var DWA = {
    Types: {
        ResponseBase: function () {
            /// <field name='oDataContext' type='String'>The context URL (see [OData-Protocol]) for the payload.</field>  
            this.oDataContext = "";
        },
        Response: function () {
            /// <field name='value' type='Object'>Response value returned from the request.</field>  
            DWA.Types.ResponseBase.call(this);

            this.value = {};
        },
        ReferenceResponse: function () {
            /// <field name='id' type='String'>A String representing the GUID value of the record.</field>  
            /// <field name='collection' type='String'>The name of the Entity Collection that the record belongs to.</field>  
            DWA.Types.ResponseBase.call(this);

            this.id = "";
            this.collection = "";
        },
        MultipleResponse: function () {
            /// <field name='oDataNextLink' type='String'>The link to the next page.</field>  
            /// <field name='oDataCount' type='Number'>The count of the records.</field>  
            /// <field name='value' type='Array'>The array of the records returned from the request.</field>  
            DWA.Types.ResponseBase.call(this);

            this.oDataNextLink = "";
            this.oDataCount = 0;
            this.value = [];
        },
        FetchXmlResponse: function () {
            /// <field name='value' type='Array'>The array of the records returned from the request.</field>  
            /// <field name='fetchXmlPagingCookie' type='Object'>Paging Cookie object</field>  
            DWA.Types.ResponseBase.call(this);

            this.value = [];
            this.fetchXmlPagingCookie = {
                pageCookies: "",
                pageNumber: 0
            }
        }
    },
    Prefer: {
        /// <field type="String">return=representation</field>
        ReturnRepresentation: "return=representation",
        Annotations: {
            /// <field type="String">Microsoft.Dynamics.CRM.associatednavigationproperty</field>
            AssociatedNavigationProperty: 'Microsoft.Dynamics.CRM.associatednavigationproperty',
            /// <field type="String">Microsoft.Dynamics.CRM.lookuplogicalname</field>
            LookupLogicalName: 'Microsoft.Dynamics.CRM.lookuplogicalname',
            /// <field type="String">*</field>
            All: '*',
            /// <field type="String">OData.Community.Display.V1.FormattedValue</field>
            FormattedValue: 'OData.Community.Display.V1.FormattedValue'
        }
    }
}

var DynamicsWebApi = function (config) {
    /// <summary>DynamicsWebApi - a Microsoft Dynamics CRM Web API helper library. Current version uses Promises instead of Callbacks.</summary>
    ///<param name="config" type="Object">
    /// DynamicsWebApi Configuration object
    ///<para>   config.webApiVersion (String).
    ///             The version of Web API to use, for example: "8.1"</para>
    ///<para>   config.webApiUrl (String).
    ///             A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [optional, if used inside of CRM]</para>
    ///</param>

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

    var _webApiVersion = "8.0";

    var _initUrl = function () {
        return _getClientUrl() + "/api/data/v" + _webApiVersion + "/";
    };

    var _webApiUrl = _initUrl();

    var _propertyReplacer = function (key, value) {
        /// <param name="key" type="String">Description</param>
        if (key.endsWith("@odata.bind") && typeof value === "string" && !value.startsWith(_webApiUrl)) {
            value = _webApiUrl + value;
        }

        return value;
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

    var _parseResponseHeaders = function (headerStr) {
        var headers = {};
        if (!headerStr) {
            return headers;
        }
        var headerPairs = headerStr.split('\u000d\u000a');
        for (var i = 0, ilen = headerPairs.length; i < ilen; i++) {
            var headerPair = headerPairs[i];
            var index = headerPair.indexOf('\u003a\u0020');
            if (index > 0) {
                headers[headerPair.substring(0, index)] = headerPair.substring(index + 2);
            }
        }
        return headers;
    }

    var _sendRequest = function (action, uri, data, additionalHeaders) {
        /// <summary>Sends a request to given URL with given parameters</summary>
        /// <param name="method" type="String">Method of the request</param>
        /// <param name="url" type="String">The request URL</param>
        /// <param name="data" type="Object" optional="true">Data to send in the request</param>
        /// <param name="additionalHeaders" type="Object" optional="true">Object with additional headers.<para>IMPORTANT! This object does not contain default headers needed for every request.</para></param>
        /// <returns type="Promise" />

        return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(action, encodeURI(_webApiUrl + uri), true);
            request.setRequestHeader("OData-MaxVersion", "4.0");
            request.setRequestHeader("OData-Version", "4.0");
            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8");

            //set additional headers
            if (additionalHeaders != null) {
                var headerKeys = Object.keys(additionalHeaders);
                for (var i = 0; i < headerKeys.length; i++) {
                    request.setRequestHeader(headerKeys[i], additionalHeaders[headerKeys[i]]);
                }
            }

            request.onreadystatechange = function () {
                if (this.readyState === 4) {
                    request.onreadystatechange = null;
                    switch (this.status) {
                        case 200: // Success with content returned in response body.
                        case 204: // Success with no content returned in response body.
                        case 304: {// Success with Not Modified
                            var responseData = null;
                            if (this.responseText) {
                                responseData = JSON.parse(this.responseText, _dateReviver);
                            }

                            var response = {
                                data: responseData,
                                headers: _parseResponseHeaders(this.getAllResponseHeaders()),
                                status: this.status
                            };

                            resolve(response);
                            break;
                        }
                        default: // All other statuses are error cases.
                            //var error;
                            //try {
                            //    error = JSON.parse(request.response).error;
                            //} catch (e) {
                            //    error = new Error("Unexpected Error");
                            //}
                            reject(this);
                            break;
                    }
                }
            };
            request.send(JSON.stringify(data, _propertyReplacer));
        });
    }

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

    var _parameterCheck = function (parameter, functionName, parameterName, type) {
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
            throw new Error(type
                ? functionName + " requires the " + parameterName + " parameter with type: " + type
                : functionName + " requires the " + parameterName + " parameter.");
        }
    };
    var _stringParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is a String.");
        }
    };
    var _arrayParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is an Array.");
        }
    };
    var _numberParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is a Number.");
        }
    };
    var _boolParameterCheck = function (parameter, functionName, parameterName) {
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
            throw new Error(functionName + " requires the " + parameterName + " parameter is a Boolean.");
        }
    };

    var _guidParameterCheck = function (parameter, functionName, parameterName) {
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
            var match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];

            return match;
        }
        catch (error) {
            throw new Error(functionName + " requires the " + parameterName + " parameter is a GUID String.");
        }
    }

    var dwaExpandRequest = function () {
        return {
            select: [],
            filter: "",
            top: 0,
            orderBy: [],
            property: ""
        }
    }

    var dwaRequest = function () {
        return {
            collection: "",
            id: "",
            select: [],
            expand: [],
            filter: "",
            maxPageSize: 1,
            count: true,
            top: 1,
            orderBy: [],
            includeAnnotations: "",
            ifmatch: "",
            ifnonematch: "",
            returnRepresentation: true,
            entity: {},
            impersonate: "",
            navigationProperty: ""
        }
    };

    var setConfig = function (config) {
        ///<summary>Sets the configuration parameters for DynamicsWebApi helper.</summary>
        ///<param name="config" type="Object">
        /// Retrieve multiple request options
        ///<para>   config.webApiVersion (String). 
        ///             The version of Web API to use, for example: "8.1"</para>
        ///<para>   config.webApiUrl (String).
        ///             A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [optional, if used inside of CRM]
        ///</param>

        if (config.webApiVersion != null) {
            _stringParameterCheck(config.webApiVersion, "DynamicsWebApi.setConfig requires config.webApiVersion is a string.");
            _webApiVersion = config.webApiVersion;
            _webApiUrl = _initUrl();
        }

        if (config.webApiUrl != null) {
            _stringParameterCheck(config.webApiUrl, "DynamicsWebApi.setConfig requires config.webApiUrl is a string.");
            _webApiUrl = config.webApiUrl;
        }
    }

    if (config != null)
        setConfig(config);

    var _convertToReferenceObject = function (url) {
        var result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(url);
        return { id: result[2], collection: result[1] };
    }

    var convertOptions = function (options, functionName, url, joinSymbol) {
        /// <param name="options" type="dwaRequest">Options</param>

        joinSymbol = joinSymbol != null ? joinSymbol : "&";

        var optionsArray = [];

        if (options.navigationProperty != null) {
            _stringParameterCheck(options.navigationProperty, "DynamicsWebApi." + functionName, "request.navigationProperty");
            url += "/" + options.navigationProperty;
        }

        if (options.select != null && options.select.length) {
            _arrayParameterCheck(options.select, "DynamicsWebApi." + functionName, "request.select");

            if (functionName == "retrieve" && options.select.length == 1 && options.select[0].endsWith("/$ref")) {
                url += "/" + options.select[0];
            }
            else {
                if (options.select[0].startsWith("/") && functionName == "retrieve") {
                    if (options.navigationProperty == null) {
                        url += options.select.shift();
                    }
                    else {
                        options.select.shift();
                    }
                }

                //check if anything left in the array
                if (options.select.length) {
                    optionsArray.push("$select=" + options.select.join(','));
                }
            }
        }

        if (options.filter != null && options.filter.length) {
            _stringParameterCheck(options.filter, "DynamicsWebApi." + functionName, "request.filter");
            optionsArray.push("$filter=" + options.filter);
        }

        var headers = {};

        if (options.maxPageSize != null) {
            _numberParameterCheck(options.maxPageSize, "DynamicsWebApi." + functionName, "request.maxPageSize");
            headers['Prefer'] = 'odata.maxpagesize=' + options.maxPageSize;
        }

        if (options.count != null) {
            _boolParameterCheck(options.count, "DynamicsWebApi." + functionName, "request.count");
            optionsArray.push("$count=" + options.count);
        }

        if (options.top != null) {
            _intParameterCheck(options.top, "DynamicsWebApi." + functionName, "request.top");
            optionsArray.push("$top=" + options.top);
        }

        if (options.orderBy != null && options.orderBy.length) {
            _arrayParameterCheck(options.orderBy, "DynamicsWebApi." + functionName, "request.orderBy");
            optionsArray.push("$orderBy=" + options.orderBy.join(','));
        }

        if (options.returnRepresentation != null) {
            _boolParameterCheck(options.returnRepresentation, "DynamicsWebApi." + functionName, "request.returnRepresentation");
            headers['Prefer'] = DWA.Prefer.ReturnRepresentation;
        }

        if (options.includeAnnotations != null) {
            _stringParameterCheck(options.includeAnnotations, "DynamicsWebApi." + functionName, "request.includeAnnotations");
            headers['Prefer'] = 'odata.include-annotations="' + options.includeAnnotations + '"';
        }

        if (options.ifmatch != null && options.ifnonematch != null) {
            throw Error("DynamicsWebApi." + functionName + ". Either one of request.ifmatch or request.ifnonematch parameters shoud be used in a call, not both.")
        }

        if (options.ifmatch != null) {
            _stringParameterCheck(options.ifmatch, "DynamicsWebApi." + functionName, "request.ifmatch");
            headers['If-Match'] = options.ifmatch;
        }

        if (options.ifnonematch != null) {
            _stringParameterCheck(options.ifnonematch, "DynamicsWebApi." + functionName, "request.ifnonematch");
            headers['If-None-Match'] = options.ifnonematch;
        }

        if (options.impersonate != null) {
            _stringParameterCheck(options.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
            headers['MSCRMCallerID'] = _guidParameterCheck(options.impersonate, "DynamicsWebApi." + functionName, "request.impersonate");
        }

        if (options.expand != null && options.expand.length) {
            _arrayParameterCheck(options.expand, "DynamicsWebApi." + functionName, "request.expand");
            var expandOptionsArray = [];
            for (var i = 0; i < options.expand.length; i++) {
                var expandOptions = convertOptions(options.expand[i], functionName + " $expand", null, ";").query;
                if (expandOptions.length) {
                    expandOptions = "(" + expandOptions + ")";
                }
                expandOptionsArray.push(options.expand[i].property + expandOptions);
            }
            optionsArray.push("$expand=" + encodeURI(expandOptionsArray.join(",")));
        }

        return { url: url, query: optionsArray.join(joinSymbol), headers: headers }
    }

    var convertRequestToLink = function (options, functionName) {
        /// <summary>Builds the Web Api query string based on a passed options object parameter.</summary>
        /// <param name="options" type="dwaRequest">Options</param>
        /// <returns type="String" />

        if (options.collection == null)
            _parameterCheck(options.collection, "DynamicsWebApi." + functionName, "request.collection");
        else
            _stringParameterCheck(options.collection, "DynamicsWebApi." + functionName, "request.collection");

        var url = options.collection.toLowerCase();

        if (options.id != null) {
            _guidParameterCheck(options.id, "DynamicsWebApi." + functionName, "request.id");
            url += "(" + options.id + ")";
        }

        var result = convertOptions(options, functionName, url);

        if (result.query)
            result.url += "?" + result.query;

        return { url: result.url, headers: result.headers };
    };

    var createRecord = function (object, collection, prefer) {
        ///<summary>
        /// Sends an asynchronous request to create a new record.
        ///</summary>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the Schema name of
        /// entity attributes that are valid for create operations.
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection to create.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="prefer" type="String" optional="true">
        /// If set to "return=representation" the function will return a newly created object
        ///</param>
        /// <returns type="Promise" />

        _parameterCheck(object, "DynamicsWebApi.create", "object");
        _stringParameterCheck(collection, "DynamicsWebApi.create", "collection");

        var headers = {};

        if (prefer != null) {
            _stringParameterCheck(prefer, "DynamicsWebApi.create", "prefer");
            headers["Prefer"] = prefer;
        }

        return _sendRequest("POST", collection.toLowerCase(), object, headers)
            .then(function (response) {
                if (response.data) {
                    return response;
                }

                var entityUrl = response.headers['OData-EntityId'];
                var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                return id;
            });
    };

    var retrieveRequest = function (request) {
        ///<summary>
        /// Sends an asynchronous request to retrieve a record.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///</param>
        /// <returns type="Promise" />

        _parameterCheck(request, "DynamicsWebApi.retrieve", "request");

        var result = convertRequestToLink(request, "retrieve");

        return _sendRequest("GET", result.url, result.headers).then(function (response) {
            if (request.select != null && request.select.length == 1 && request.select[0].endsWith("/$ref") && response.data["@odata.id"] != null) {
                return _convertToReferenceObject(response.data["@odata.id"]);
            }

            return response.data;
        });
    };

    var retrieveRecord = function (id, collection, select, expand) {
        ///<summary>
        /// Sends an asynchronous request to retrieve a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection to retrieve.
        /// For an Account record, use "accounts"
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
        ///<param name="prefer" type="String">
        /// A String representing the 'Prefer: odata.include-annotations' header value. 
        /// It can be used to include annotations that will provide additional information about the data in selected properties.
        /// <para>Example values: "*"; "OData.Community.Display.V1.FormattedValue" and etc.</para>
        ///</param>
        /// <returns type="Promise" />

        _stringParameterCheck(id, "DynamicsWebApi.retrieve", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.retrieve", "id")
        _stringParameterCheck(collection, "DynamicsWebApi.retrieve", "collection");
        if (select != null)
            _arrayParameterCheck(select, "DynamicsWebApi.retrieve", "select");

        var url = collection.toLowerCase() + "(" + id + ")";

        var queryOptions = [];

        if (select.length) {
            if (select.length == 1 && select[0].endsWith("/$ref") && select[0].endsWith("/$ref")) {
                url += "/" + select[0];
            }
            else {
                if (select[0].startsWith("/")) {
                    url += select.shift();
                }

                //check if anything left in the array
                if (select.length) {
                    queryOptions.push("$select=" + select.join(','));
                }
            }
        }

        if (expand != null) {
            _stringParameterCheck(expand, "DynamicsWebApi.retrieve", "expand");
            queryOptions.push("$expand=" + expand);
        }

        if (queryOptions.length)
            url += "?" + queryOptions.join("&");

        return _sendRequest("GET", url).then(function (response) {
            if (select != null && select.length == 1 && select[0].endsWith("/$ref") && response.data["@odata.id"] != null) {
                return _convertToReferenceObject(response.data["@odata.id"]);
            }

            return response.data;
        });
    };

    var updateRequest = function (request) {
        ///<summary>
        /// Sends an asynchronous request to update a record.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///</param>
        /// <returns type="Promise" />

        _parameterCheck(request, "DynamicsWebApi.update", "request")
        _parameterCheck(request.entity, "DynamicsWebApi.update", "request.entity")

        var result = convertRequestToLink(request, "update");

        if (request.ifmatch == null) {
            result.headers['If-Match'] = '*'; //to prevent upsert
        }

        return _sendRequest("PATCH", result.url, request.entity, result.headers).then(function (response) {
            if (response.data) {
                return response.data;
            }
        })
    };

    var updateRecord = function (id, collection, object, prefer, select) {
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
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name to retrieve.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="prefer" type="String" optional="true">
        /// If set to "return=representation" the function will return a newly created object
        ///</param>
        ///<param name="select" type="Array" optional="true">
        /// Limits returned properties with update when prefer equals "return=representation". 
        ///</param>
        /// <returns type="Promise" />
        _stringParameterCheck(id, "DynamicsWebApi.update", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.update", "id")
        _parameterCheck(object, "DynamicsWebApi.update", "object");
        _stringParameterCheck(collection, "DynamicsWebApi.update", "collection");

        var headers = { "If-Match": "*" }; //to prevent upsert

        if (prefer != null) {
            _stringParameterCheck(prefer, "DynamicsWebApi.update", "prefer");
            headers["Prefer"] = prefer;
        }

        var systemQueryOptions = "";

        if (select != null) {
            _arrayParameterCheck(select, "DynamicsWebApi.update", "select");

            if (select.length > 0) {
                systemQueryOptions = "?" + select.join(",");
            }
        }

        return _sendRequest("PATCH", collection.toLowerCase() + "(" + id + ")" + systemQueryOptions, object, headers)
            .then(function (response) {
                if (response.data) {
                    return response.data;
                }
            });
    };

    var updateSingleProperty = function (id, collection, keyValuePair, prefer) {
        ///<summary>
        /// Sends an asynchronous request to update a single value in the record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        ///<param name="keyValuePair" type="Object">
        /// keyValuePair object with a logical name of the field as a key and a value. Example:
        /// <para>{subject: "Update Record"}</para>
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name to retrieve.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="prefer" type="String" optional="true">
        /// If set to "return=representation" the function will return a newly created object
        ///</param>
        /// <returns type="Promise" />

        _stringParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.updateSingleProperty", "id")
        _parameterCheck(keyValuePair, "DynamicsWebApi.updateSingleProperty", "keyValuePair");
        _stringParameterCheck(collection, "DynamicsWebApi.updateSingleProperty", "collection");

        var key = Object.keys(keyValuePair)[0];
        var keyValue = keyValuePair[key];

        var header = {};

        if (prefer != null) {
            _stringParameterCheck(prefer, "DynamicsWebApi.updateSingleProperty", "prefer");
            header["Prefer"] = prefer;
        }

        return _sendRequest("PUT", collection.toLowerCase() + "(" + id + ")/" + key, { value: keyValue }, header)
            .then(function (response) {
                if (response.data) {
                    return response.data;
                }
            });
    };

    var deleteRequest = function (request) {
        ///<summary>
        /// Sends an asynchronous request to delete a record.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///</param>
        /// <returns type="Promise" />

        _parameterCheck(request, "DynamicsWebApi.delete", "request")

        var result = convertRequestToLink(request, "delete");

        return _sendRequest("DELETE", result.url, result.headers).then(function () {
            return true; //deleted
        }).catch(function (error) {
            if (request.ifmatch != null && error.status == 412) {
                //precondition failed - not deleted
                return false;
            }
            else {
                //rethrow error otherwise
                throw error;
            }
        });
    }

    var deleteRecord = function (id, collection, propertyName) {
        ///<summary>
        /// Sends an asynchronous request to delete a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to delete.
        ///</param>
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name record to delete.
        /// For an Account record, use "accounts"
        ///</param>
        ///<param name="propertyName" type="String" optional="true">
        /// The name of the property which needs to be emptied. Instead of removing a whole record
        /// only the specified property will be cleared.
        ///</param>
        /// <returns type="Promise" />

        _stringParameterCheck(id, "DynamicsWebApi.deleteRequest", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.deleteRequest", "id")
        _stringParameterCheck(collection, "DynamicsWebApi.deleteRequest", "collection");

        if (propertyName != null)
            _stringParameterCheck(propertyName, "DynamicsWebApi.deleteRequest", "propertyName");

        var url = collection.toLowerCase() + "(" + id + ")";

        if (propertyName != null)
            url += "/" + propertyName;

        return _sendRequest("DELETE", url);
    };

    var upsertRequest = function (request) {
        ///<summary>
        /// Sends an asynchronous request to Upsert a record.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///</param>
        /// <returns type="Promise" />

        _parameterCheck(request, "DynamicsWebApi.upsert", "request")
        _parameterCheck(request.entity, "DynamicsWebApi.upsert", "request.entity")

        var result = convertRequestToLink(request, "upsert");

        return _sendRequest("PATCH", result.url, request.entity, result.headers)
            .then(function (response) {
                if (response.status == 204) {
                    var entityUrl = response.headers['odata-entityid'];
                    var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                    return id;
                }
                else if (response.data) {
                    return response.data;
                }
            }).catch(function (error) {
                /// <param name="error" type="XMLHttpRequest">Description</param>
                if (request.ifnonematch != null && error.status == 412) {
                    //if prevent update
                    return;
                }
                else if (request.ifmatch != null && error.status == 404) {
                    //if prevent create
                    return;
                }
                else {
                    //rethrow error otherwise
                    throw error;
                }
            });
    };

    var upsertRecord = function (id, collection, object, prefer, select) {
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
        ///<param name="collection" type="String">
        /// The Logical Name of the Entity Collection name to Upsert.
        /// For an Account record, use "accounts".
        ///</param>
        ///<param name="prefer" type="String" optional="true">
        /// If set to "return=representation" the function will return a newly created object
        ///</param>
        ///<param name="select" type="Array" optional="true">
        /// Limits returned properties with upsert when prefer equals "return=representation". 
        ///</param>
        /// <returns type="Promise" />

        _stringParameterCheck(id, "DynamicsWebApi.upsert", "id");
        id = _guidParameterCheck(id, "DynamicsWebApi.upsert", "id")

        _parameterCheck(object, "DynamicsWebApi.upsert", "object");
        _stringParameterCheck(collection, "DynamicsWebApi.upsert", "collection");

        var headers = {};

        if (prefer != null) {
            _stringParameterCheck(prefer, "DynamicsWebApi.upsert", "prefer");
            headers["Prefer"] = prefer;
        }

        var systemQueryOptions = "";

        if (select != null) {
            _arrayParameterCheck(select, "DynamicsWebApi.upsert", "select");

            if (select.length > 0) {
                systemQueryOptions = "?" + select.join(",");
            }
        }

        return _sendRequest("PATCH", collection.toLowerCase() + "(" + id + ")" + systemQueryOptions, object, headers)
            .then(function (response) {
                if (response.status == 204) {
                    var entityUrl = response.headers['odata-entityid'];
                    var id = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(entityUrl)[0];
                    return id;
                }
                else if (response.data) {
                    return response.data;
                }
            });
    }

    var countRecords = function (collection, filter) {
        ///<summary>
        /// Sends an asynchronous request to count records. IMPORTANT! The count value does not represent the total number of entities in the system. It is limited by the maximum number of entities that can be returned. Returns: Number
        ///</summary>
        /// <param name="collection" type="String">The Logical Name of the Entity Collection to retrieve. For an Account record, use "accounts".</param>
        /// <param name="filter" type="String" optional="true">Use the $filter system query option to set criteria for which entities will be returned.</param>
        /// <returns type="Promise" />

        if (filter == null || (filter != null && !filter.length)) {
            _stringParameterCheck(collection, "DynamicsWebApi.count", "collection");

            //if filter has not been specified then simplify the request
            return _sendRequest("GET", collection.toLowerCase() + "/$count")
                .then(function (response) {
                    return response.data ? parseInt(response.data) : 0;
                })
        }
        else {
            return retrieveMultipleRecordsAdvanced({
                collection: collection,
                filter: filter,
                count: true
            }, null)
                .then(function (response) {
                    /// <param name="response" type="DWA.Types.MultipleResponse">Request response</param>

                    return response.oDataCount ? response.oDataCount : 0;
                });
        }
    }

    var retrieveMultipleRecords = function (collection, select, filter, nextPageLink) {
        ///<summary>
        /// Sends an asynchronous request to retrieve records.
        ///</summary>
        /// <param name="collection" type="String">The Logical Name of the Entity Collection to retrieve. For an Account record, use "accounts".</param>
        /// <param name="select" type="Array">Use the $select system query option to limit the properties returned as shown in the following example.</param>
        /// <param name="filter" type="String">Use the $filter system query option to set criteria for which entities will be returned.</param>
        /// <param name="nextPageLink" type="String">Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.</param>
        /// <returns type="Promise" />

        return retrieveMultipleRecordsAdvanced({
            collection: collection,
            select: select,
            filter: filter
        }, nextPageLink);
    }

    var retrieveMultipleRecordsAdvanced = function (request, nextPageLink) {
        ///<summary>
        /// Sends an asynchronous request to retrieve records.
        ///</summary>
        ///<param name="request" type="dwaRequest">
        /// An object that represents all possible options for a current request.
        ///<para>   object.collection (String). 
        ///             The Logical Name of the Entity Collection to retrieve. For an Account record, use "accounts".</para>
        ///<para>   object.id (String).
        ///             A String representing the GUID value for the record to retrieve.</para>
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
        ///             Values can be "OData.Community.Display.V1.FormattedValue"; "*" and etc. - for lookups.</para>
        ///</param>
        ///<param name="nextPageLink" type="String" optional="true">
        /// Use the value of the @odata.nextLink property with a new GET request to return the next page of data. Pass null to retrieveMultipleOptions.
        ///</param>

        var result = convertRequestToLink(request, "retrieveMultiple");

        if (nextPageLink != null) {
            _stringParameterCheck(nextPageLink, "DynamicsWebApi.retrieveMultiple", "nextPageLink");
            result.url = nextPageLink;
        }

        return _sendRequest("GET", result.url, result.headers)
            .then(function (response) {
                if (response.data['@odata.nextLink'] != null) {
                    response.data.oDataNextLink = response.data['@odata.nextLink'];
                }
                if (response.data['@odata.count'] != null) {
                    response.data.oDataCount = parseInt(response.data['@odata.count']);
                }
                if (response.data['@odata.context'] != null) {
                    response.data.oDataContext = response.data['@odata.context'];
                }

                return response.data;
            });
    }

    var getPagingCookie = function (pageCookies) {
        var pagingInfo = {};
        var pageNumber = null;

        try {
            //get the page cokies
            pageCookies = unescape(unescape(pageCookies));

            //get the pageNumber
            pageNumber = parseInt(pageCookies.substring(pageCookies.indexOf("=") + 1, pageCookies.indexOf("pagingcookie")).replace(/\"/g, '').trim());

            // this line is used to get the cookie part
            pageCookies = pageCookies.substring(pageCookies.indexOf("pagingcookie"), (pageCookies.indexOf("/>") + 12));
            pageCookies = pageCookies.substring(pageCookies.indexOf("=") + 1, pageCookies.length);
            pageCookies = pageCookies.substring(1, pageCookies.length - 1);

            //replace special character 
            pageCookies = pageCookies.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '\'').replace(/\'/g, '&' + 'quot;');

            //append paging-cookie
            pageCookies = "paging-cookie ='" + pageCookies + "'";

            //set the parameter
            pagingInfo.pageCookies = pageCookies;
            pagingInfo.pageNumber = pageNumber;

        } catch (e) {
            throw new Error(e);
        }

        return pagingInfo;
    }

    var fetchXmlRequest = function (collection, fetchXml, includeAnnotations) {
        ///<summary>
        /// Sends an asynchronous request to count records. Returns: DWA.Types.FetchXmlResponse
        ///</summary>
        /// <param name="collection" type="String">The Logical Name of the Entity Collection to retrieve. For an Account record, use "accounts".</param>
        /// <param name="fetchXml" type="String">FetchXML is a proprietary query language that provides capabilities to perform aggregation.</param>
        /// <param name="includeAnnotations" type="String" optional="true">Use this parameter to include annotations to a result.<para>For example: * or Microsoft.Dynamics.CRM.fetchxmlpagingcookie</para></param>
        /// <returns type="Promise"/>

        _stringParameterCheck(collection, "DynamicsWebApi.executeFetchXml", "type");
        _stringParameterCheck(fetchXml, "DynamicsWebApi.executeFetchXml", "fetchXml");

        var headers = {};
        if (includeAnnotations != null) {
            _boolParameterCheck(includeAnnotations, "DynamicsWebApi.executeFetchXml", "includeAnnotations");
            headers['Prefer'] = 'odata.include-annotations="' + includeAnnotations + '"';
        }

        var encodedFetchXml = encodeURI(fetchXml);

        return _sendRequest("GET", collection.toLowerCase() + "?fetchXml=" + encodedFetchXml, headers)
            .then(function (response) {

                if (response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'] != null) {
                    response.data.fetchXmlPagingCookie = getPagingCookie(response.data['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie']);
                }

                if (response.data['@odata.context'] != null) {
                    response.data.oDataContext = response.data['@odata.context'];
                }

                return response.data;
            });
    }

    var associateRecords = function (primaryCollection, primaryId, relationshipName, relatedCollection, relatedId) {
        /// <summary>Associate for a collection-valued navigation property. (1:N or N:N)</summary>
        /// <param name="primaryCollection" type="String">Primary entity collection name.</param>
        /// <param name="primaryId" type="String">Primary entity record id.</param>
        /// <param name="relationshipName" type="String">Relationship name.</param>
        /// <param name="relatedCollection" type="String">Related colletion name.</param>
        /// <param name="relatedId" type="String">Related entity record id.</param>
        /// <returns type="Promise" />
        _stringParameterCheck(primaryCollection, "DynamicsWebApi.associate", "primarycollection");
        _stringParameterCheck(relatedCollection, "DynamicsWebApi.associate", "relatedcollection");
        _stringParameterCheck(relationshipName, "DynamicsWebApi.associate", "relationshipName");
        primaryId = _guidParameterCheck(primaryId, "DynamicsWebApi.associate", "primaryId");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.associate", "relatedId");

        return _sendRequest("POST", primaryCollection + "(" + primaryId + ")/" + relationshipName + "/$ref",
            { "@odata.id": _initUrl() + relatedCollection + "(" + relatedId + ")" });
    }

    var disassociateRecords = function (primaryCollection, primaryId, relationshipName, relatedId) {
        /// <summary>Disassociate for a collection-valued navigation property.</summary>
        /// <param name="primaryCollection" type="String">Primary entity collection name</param>
        /// <param name="primaryId" type="String">Primary entity record id</param>
        /// <param name="relationshipName" type="String">Relationship name</param>
        /// <param name="relatedId" type="String">Related entity record id</param>
        /// <returns type="Promise" />
        _stringParameterCheck(primaryCollection, "DynamicsWebApi.disassociate", "primarycollection");
        _stringParameterCheck(relationshipName, "DynamicsWebApi.disassociate", "relationshipName");
        primaryId = _guidParameterCheck(primaryId, "DynamicsWebApi.disassociate", "primaryId");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.disassociate", "relatedId");

        return _sendRequest("DELETE", primaryCollection + "(" + primaryId + ")/" + relationshipName + "(" + relatedId + ")/$ref");
    }

    var associateRecordsSingleValued = function (collection, id, singleValuedNavigationPropertyName, relatedCollection, relatedId) {
        /// <summary>Associate for a single-valued navigation property. (1:N)</summary>
        /// <param name="collection" type="String">Entity collection name that contains an attribute.</param>
        /// <param name="id" type="String">Entity record id that contains a attribute.</param>
        /// <param name="singleValuedNavigationPropertyName" type="String">Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).</param>
        /// <param name="relatedCollection" type="String">Related collection name that the lookup (attribute) points to.</param>
        /// <param name="relatedId" type="String">Related entity record id that needs to be associated.</param>
        /// <returns type="Promise" />

        _stringParameterCheck(collection, "DynamicsWebApi.associateSingleValued", "collection");
        id = _guidParameterCheck(id, "DynamicsWebApi.associateSingleValued", "id");
        relatedId = _guidParameterCheck(relatedId, "DynamicsWebApi.associateSingleValued", "relatedId");
        _stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.associateSingleValued", "singleValuedNavigationPropertyName");
        _stringParameterCheck(relatedCollection, "DynamicsWebApi.associateSingleValued", "relatedcollection");

        return _sendRequest("PUT", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref",
            { "@odata.id": _initUrl() + relatedCollection + "(" + relatedId + ")" });
    }

    var disassociateRecordsSingleValued = function (collection, id, singleValuedNavigationPropertyName) {
        /// <summary>Removes a reference to an entity for a single-valued navigation property. (1:N)</summary>
        /// <param name="collection" type="String">Entity collection name that contains an attribute.</param>
        /// <param name="id" type="String">Entity record id that contains an attribute.</param>
        /// <param name="singleValuedNavigationPropertyName" type="String">Single-valued navigation property name (usually it's a Schema Name of the lookup attribute).</param>
        /// <returns type="Promise" />

        _stringParameterCheck(collection, "DynamicsWebApi.disassociateSingleValued", "collection");
        id = _guidParameterCheck(id, "DynamicsWebApi.disassociateSingleValued", "id");
        _stringParameterCheck(singleValuedNavigationPropertyName, "DynamicsWebApi.disassociateSingleValued", "singleValuedNavigationPropertyName");

        return _sendRequest("DELETE", collection + "(" + id + ")/" + singleValuedNavigationPropertyName + "/$ref");
    }

    var executeUnboundFunction = function (functionName, parameters) {
        /// <summary>Executes an unbound function (not bound to a particular entity record)</summary>
        /// <param name="functionName" type="String">The name of the function</param>
        /// <param name="parameters" type="Object" optional="true">Function's input parameters. Example: { param1: "test", param2: 3 }</param>
        /// <returns type="Promise" />
        return _executeFunction(functionName, parameters);
    }

    var executeBoundFunction = function (id, collection, functionName, parameters) {
        /// <summary>Executes a bound function</summary>
        /// <param name="id" type="String">A String representing the GUID value for the record.</param>
        /// <param name="collection" type="String">The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.</param>
        /// <param name="functionName" type="String">The name of the function</param>
        /// <param name="parameters" type="Object" optional="true">Function's input parameters. Example: { param1: "test", param2: 3 }</param>
        /// <returns type="Promise" />
        return _executeFunction(functionName, parameters, collection, id);
    }

    var _executeFunction = function (functionName, parameters, collection, id) {
        /// <summary>Executes a bound function</summary>
        /// <param name="id" type="String" optional="true">A String representing the GUID value for the record.</param>
        /// <param name="collection" type="String" optional="true">The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.</param>
        /// <param name="functionName" type="String">The name of the function</param>
        /// <param name="parameters" type="Object" optional="true">Function's input parameters. Example: { param1: "test", param2: 3 }</param>
        /// <returns type="Promise" />

        _stringParameterCheck(functionName, "DynamicsWebApi.executeFunction", "functionName");
        var url = functionName;

        if (parameters != null) {
            var parameterNames = Object.keys(parameters);
            var functionParameters = "";
            var urlQuery = "";

            for (var i = 1; i <= parameterNames.length; i++) {
                var parameterName = parameterNames[i - 1];
                var value = parameters[parameterName];

                if (i > 1) {
                    functionParameters += ",";
                    urlQuery += "&";
                }

                functionParameters += parameterName + "=@p" + i;
                urlQuery += "@p" + i + "=" + ((typeof value == "string") ? "'" + value + "'" : value);
            }

            url += "(" + functionParameters + ")?" + urlQuery;
        }
        else {
            url += "()";
        }

        if (collection != null) {
            _stringParameterCheck(collection, "DynamicsWebApi.executeFunction", "collection");
            id = _guidParameterCheck(id, "DynamicsWebApi.executeFunction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        return _sendRequest("GET", url).then(function (response) {
            if (response.data) {
                return response.data;
            }
        });
    }

    var executeUnboundAction = function (actionName, requestObject) {
        /// <summary>Executes an unbound Web API action</summary>
        /// <param name="actionName" type="String">The name of the Web API action.</param>
        /// <param name="requestObject" type="object">Action request body object.</param>
        /// <returns type="Promise" />
        return _executeAction(actionName, requestObject);
    }

    var executeBoundAction = function (id, collection, actionName, requestObject) {
        /// <summary>Executes a bound Web API action</summary>
        /// <param name="actionName" type="String">The name of the Web API action.</param>
        /// <param name="requestObject" type="object">Action request body object.</param>
        /// <param name="id" type="String">A String representing the GUID value for the record.</param>
        /// <param name="collection" type="String">The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.</param>
        /// <returns type="Promise" />
        return _executeAction(actionName, requestObject, collection, id);
    }

    var _executeAction = function (actionName, requestObject, collection, id) {
        /// <summary>Executes a Web API action</summary>
        /// <param name="actionName" type="String">The name of the Web API action.</param>
        /// <param name="requestObject" type="object">Action request body object.</param>
        /// <param name="id" type="String" optional="true">A String representing the GUID value for the record.</param>
        /// <param name="collection" type="String" optional="true">The name of the Entity Collection, for example, for account use accounts, opportunity - opportunities and etc.</param>
        /// <returns type="Promise" />

        _stringParameterCheck(actionName, "DynamicsWebApi.executeAction", "actionName");
        var url = actionName;

        if (collection != null) {
            _stringParameterCheck(collection, "DynamicsWebApi.executeAction", "collection");
            id = _guidParameterCheck(id, "DynamicsWebApi.executeAction", "id");

            url = collection + "(" + id + ")/" + url;
        }

        return _sendRequest("POST", url, requestObject).then(function (response) {
            if (response.data) {
                return response.data;
            }
        });
    }

    var createInstance = function (config) {
        /// <summary>Creates another instance of DynamicsWebApi helper. This function copies sendRequest function into a newly created object.</summary>
        ///<param name="config" type="Object">
        /// DynamicsWebApi Configuration object
        ///<para>   config.webApiVersion (String).
        ///             The version of Web API to use, for example: "8.1"</para>
        ///<para>   config.webApiUrl (String).
        ///             A String representing a URL to Web API (webApiVersion not required if webApiUrl specified) [optional, if used inside of CRM]</para>
        ///</param>
        /// <returns type="DynamicsWebApi" />
        return new DynamicsWebApi(config);
    }

    return {
        create: createRecord,
        update: updateRecord,
        updateRequest: updateRequest,
        upsert: upsertRecord,
        upsertRequest: upsertRequest,
        deleteRecord: deleteRecord,
        deleteRequest: deleteRequest,
        executeFetchXml: fetchXmlRequest,
        count: countRecords,
        retrieve: retrieveRecord,
        retrieveRequest: retrieveRequest,
        retrieveMultiple: retrieveMultipleRecords,
        retrieveMultipleRequest: retrieveMultipleRecordsAdvanced,
        updateSingleProperty: updateSingleProperty,
        associate: associateRecords,
        disassociate: disassociateRecords,
        associateSingleValued: associateRecordsSingleValued,
        disassociateSingleValued: disassociateRecordsSingleValued,
        executeBoundFunction: executeBoundFunction,
        executeUnboundFunction: executeUnboundFunction,
        executeBoundAction: executeBoundAction,
        executeUnboundAction: executeUnboundAction,
        setConfig: setConfig,
        initializeInstance: createInstance
    }
};

var dynamicsWebApi = new DynamicsWebApi();

