/*! dwa v1.4.2 (c) 2018 Aleksandr Rogov */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("DWA", [], factory);
	else if(typeof exports === 'object')
		exports["DWA"] = factory();
	else
		root["DWA"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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
            /// <field name='pagingInfo' type='Object'>Paging Information</field>  
            DWA.Types.ResponseBase.call(this);

            this.value = [];
            this.PagingInfo = {
                /// <param name='cookie' type='String'>Paging Cookie</param>  
                /// <param name='number' type='Number'>Page Number</param>  
                cookie: "",
                page: 0,
                nextPage: 1
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
            FormattedValue: 'OData.Community.Display.V1.FormattedValue',
            /// <field type="String">Microsoft.Dynamics.CRM.fetchxmlpagingcookie</field>
            FetchXmlPagingCookie: 'Microsoft.Dynamics.CRM.fetchxmlpagingcookie'
        }
    }
}

module.exports = DWA;

/***/ })
/******/ ]);
});