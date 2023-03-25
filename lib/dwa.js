"use strict";
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DWA = void 0;
class DWA {
}
exports.DWA = DWA;
DWA.Prefer = (_a = class {
        static get(annotation) {
            return `${DWA.Prefer.IncludeAnnotations}="${annotation}"`;
        }
    },
    __setFunctionName(_a, "Prefer"),
    _a.ReturnRepresentation = "return=representation",
    _a.Annotations = (_b = class {
        },
        __setFunctionName(_b, "Annotations"),
        _b.AssociatedNavigationProperty = "Microsoft.Dynamics.CRM.associatednavigationproperty",
        _b.LookupLogicalName = "Microsoft.Dynamics.CRM.lookuplogicalname",
        _b.All = "*",
        _b.FormattedValue = "OData.Community.Display.V1.FormattedValue",
        _b.FetchXmlPagingCookie = "Microsoft.Dynamics.CRM.fetchxmlpagingcookie",
        _b),
    _a.IncludeAnnotations = "odata.include-annotations",
    _a);
//# sourceMappingURL=dwa.js.map