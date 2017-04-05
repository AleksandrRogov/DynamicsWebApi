var chai = require('chai');
var expect = chai.expect;

var DWA = require('../lib/dwa');
var Utility = require('../lib/utilities/Utility');
var RequestConverter = require('../lib/utilities/RequestConverter');
var ErrorHelper = require('../lib/helpers/ErrorHelper');
var mocks = require("./stubs");

describe("Utility.buildFunctionParameters - ", function () {
    it("no parameters", function () {
        var result = Utility.buildFunctionParameters();
        expect(result).to.equal("()");
    });
    it("1 parameter", function () {
        var result = Utility.buildFunctionParameters({ param1: "value1" });
        expect(result).to.equal("(param1=@p1)?@p1='value1'");
    });
    it("2 parameters", function () {
        var result = Utility.buildFunctionParameters({ param1: "value1", param2: 2 });
        expect(result).to.equal("(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
    });
    it("3 parameters", function () {
        var result = Utility.buildFunctionParameters({ param1: "value1", param2: 2, param3: "value2" });
        expect(result).to.equal("(param1=@p1,param2=@p2,param3=@p3)?@p1='value1'&@p2=2&@p3='value2'");
    });
});

describe("Utility.getFetchXmlPagingCookie -", function () {
    it("paginCookie is empty", function () {
        var result = Utility.getFetchXmlPagingCookie("", 2);
        expect(result).to.deep.equal({
            cookie: "",
            page: 2,
            nextPage: 3
        });
    });

    it("paginCookie is null or undefined", function () {
        var result = Utility.getFetchXmlPagingCookie(null, 2);
        expect(result).to.deep.equal({
            cookie: "",
            page: 2,
            nextPage: 3
        });

        var result = Utility.getFetchXmlPagingCookie();
        expect(result).to.deep.equal({
            cookie: "",
            page: 1,
            nextPage: 2
        });
    });

    it("pagingCookie is normal", function () {
        var result = Utility.getFetchXmlPagingCookie(mocks.data.fetchXmls.cookiePage2, 2);
        expect(result).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie.PagingInfo);

        result = Utility.getFetchXmlPagingCookie(mocks.data.fetchXmls.cookiePage1, 2);
        expect(result).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo);

        result = Utility.getFetchXmlPagingCookie(mocks.data.fetchXmls.cookiePage2);
        expect(result).to.deep.equal(mocks.data.fetchXmls.fetchXmlResultPage2Cookie.PagingInfo);

    });
});

describe("RequestConverter.convertRequestOptions -", function () {
    var stubUrl = mocks.webApiUrl + "tests";
    it("request is empty", function () {
        var dwaRequest;

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl, "&");
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        result = RequestConverter.convertRequestOptions(null, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        result = RequestConverter.convertRequestOptions({}, "", stubUrl, "&");
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

    });

    it("count=true", function () {
        var dwaRequest = {
            count: true
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$count=true", headers: {} });
    });

    it("count=false", function () {
        var dwaRequest = {
            count: false
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("expand is empty", function () {
        var dwaRequest = {
            expand: undefined
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            expand: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            expand: []
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("expand - filter without expand.property", function () {
        var dwaRequest = {
            expand: [{
                filter: "name eq 'name'"
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            expand: [{
                filter: "name eq 'name'",
                property: null
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("expand - property", function () {
        var dwaRequest = {
            expand: [{
                property: "property"
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,filter empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                filter: ""
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                filter: null
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,filter", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                filter: "name eq 'name'"
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($filter=" + encodeURI("name eq 'name'") + ")", headers: {} });
    });

    it("expand - property,orderBy empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                orderBy: []
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                orderBy: null
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,orderBy", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                orderBy: ["name"]
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($orderby=name)", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                orderBy: ["name", "subject"]
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($orderby=name,subject)", headers: {} });
    });

    it("expand - property,select empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: []
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                select: null
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,select", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: ["name"]
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($select=name)", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"]
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($select=name,subject)", headers: {} });
    });

    it("expand - property,top empty or <=0", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                top: 0
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                top: -1
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                top: null
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property", headers: {} });
    });

    it("expand - property,top", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                top: 3
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($top=3)", headers: {} });
    });

    it("expand - different properties", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"],
                top: 3
            }]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($select=name,subject;$top=3)", headers: {} });

        dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"],
                orderBy: ["order"],
                top: 3
            }]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($select=name,subject;$top=3;$orderby=order)", headers: {} });
    });

    it("filter empty", function () {
        var dwaRequest = {
            filter: ""
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            filter: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("filter", function () {
        var dwaRequest = {
            filter: "name eq 'name'"
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$filter=name eq 'name'", headers: {} });
    });

    it("ifmatch empty", function () {
        var dwaRequest = {
            ifmatch: ""
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            ifmatch: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("ifmatch", function () {
        var dwaRequest = {
            ifmatch: "*"
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { "If-Match": "*" } });
    });

    it("ifnonematch empty", function () {
        var dwaRequest = {
            ifnonematch: ""
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            ifnonematch: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("ifnonematch", function () {
        var dwaRequest = {
            ifnonematch: "*"
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { "If-None-Match": "*" } });
    });

    it("impersonate empty", function () {
        var dwaRequest = {
            impersonate: ""
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            impersonate: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("impersonate", function () {
        var dwaRequest = {
            impersonate: mocks.data.testEntityId
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { "MSCRMCallerID": mocks.data.testEntityId } });
    });

    it("includeAnnotations empty", function () {
        var dwaRequest = {
            includeAnnotations: ""
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            includeAnnotations: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("includeAnnotations", function () {
        var dwaRequest = {
            includeAnnotations: DWA.Prefer.Annotations.AssociatedNavigationProperty
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"' } });
    });

    it("maxPageSize empty or <=0", function () {
        var dwaRequest = {
            maxPageSize: 0
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            maxPageSize: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            maxPageSize: -2
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("maxPageSize", function () {
        var dwaRequest = {
            maxPageSize: 10
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { Prefer: 'odata.maxpagesize=10' } });
    });

    it("navigationProperty empty", function () {
        var dwaRequest = {
            navigationProperty: ""
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            navigationProperty: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("navigationProperty", function () {
        var dwaRequest = {
            navigationProperty: "nav"
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "", headers: {} });
    });

    it("orderBy empty", function () {
        var dwaRequest = {
            orderBy: []
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            orderBy: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("orderBy", function () {
        var dwaRequest = {
            orderBy: ["name"]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$orderby=name", headers: {} });

        dwaRequest = {
            orderBy: ["name", "subject"]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "$orderby=name,subject", headers: {}
        });
    });

    it("returnRepresentation empty", function () {
        var dwaRequest = {
            returnRepresentation: false
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            returnRepresentation: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("returnRepresentation", function () {
        var dwaRequest = {
            returnRepresentation: true
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });
    });

    it("select empty", function () {
        var dwaRequest = {
            select: []
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            select: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("select", function () {
        var dwaRequest = {
            select: ["name"]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name", headers: {} });

        dwaRequest = {
            select: ["name", "subject"]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject", headers: {} });
    });

    it("select navigation property", function () {
        var dwaRequest = {
            select: ["/nav"]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "", headers: {} });

        dwaRequest = {
            select: ["/nav", "subject"]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "$select=subject", headers: {} });

        dwaRequest = {
            select: ["/nav", "subject", "fullname"]
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "$select=subject,fullname", headers: {} });
    });

    it("select reference", function () {
        var dwaRequest = {
            select: ["nav/$ref"]
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav/$ref", query: "", headers: {} });
    });

    it("top empty or <=0", function () {
        var dwaRequest = {
            top: 0
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            top: -1
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            top: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("top", function () {
        var dwaRequest = {
            top: 3
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$top=3", headers: {} });
    });

    it("savedQuery empty", function () {
        var dwaRequest = {
            savedQuery: ""
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            savedQuery: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("savedQuery", function () {
        var dwaRequest = {
            savedQuery: mocks.data.testEntityId
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "savedQuery=" + mocks.data.testEntityId, headers: {} });
    });

    it("userQuery empty", function () {
        var dwaRequest = {
            userQuery: ""
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });

        dwaRequest = {
            userQuery: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("userQuery", function () {
        var dwaRequest = {
            userQuery: mocks.data.testEntityId
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "userQuery=" + mocks.data.testEntityId, headers: {} });
    });

    it("multiple options", function () {
        var dwaRequest = {
            select: ["name", "subject"],
            orderBy: ["order"],
            top: 5
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject&$top=5&$orderby=order", headers: {} });

        dwaRequest.expand = [{
            property: "property",
            select: ["name"],
            orderBy: ["order"]
        }, {
            property: "property2",
            select: ["name3"]
        }];

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject&$top=5&$orderby=order&$expand=property($select=name;$orderby=order),property2($select=name3)", headers: {} });

        dwaRequest.expand = null;
        dwaRequest.returnRepresentation = true;

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject&$top=5&$orderby=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

        dwaRequest.top = 0;
        dwaRequest.count = true;
        dwaRequest.impersonate = mocks.data.testEntityId;

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$select=name,subject&$count=true&$orderby=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation, MSCRMCallerID: mocks.data.testEntityId } });

        dwaRequest.impersonate = null;
        dwaRequest.navigationProperty = "nav";

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "$select=name,subject&$count=true&$orderby=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

        dwaRequest.navigationProperty = null;
        dwaRequest.returnRepresentation = false;
        dwaRequest.includeAnnotations = DWA.Prefer.Annotations.All;
        dwaRequest.select[0] = "/nav";

        result = RequestConverter.convertRequestOptions(dwaRequest, "retrieve", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl + "/nav", query: "$select=subject&$count=true&$orderby=order", headers: { Prefer: 'odata.include-annotations="*"' } });
    });
});

describe("RequestConverter.convertRequest -", function () {
    //{ url: result.url, headers: result.headers }
    it("collection", function () {
        var dwaRequest = {
            collection: "cols"
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {} });
    });

    it("collection empty - throw error", function () {
        var dwaRequest = {
            collection: ""
        };

        var test = function () {
            RequestConverter.convertRequest(dwaRequest);
        }

        expect(test).to.throw(/request\.collection/);

        dwaRequest.collection = 0;
        expect(test).to.throw(/request\.collection/);

        dwaRequest.collection = null;
        expect(test).to.throw(/request\.collection/);
    });

    it("collection, id empty", function () {
        var dwaRequest = {
            collection: "cols",
            id: null
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {} });

        dwaRequest.id = "";

        result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {} });
    });

    it("collection, id - wrong format throw error", function () {
        var dwaRequest = {
            collection: "cols",
            id: "sa"
        };

        var test = function () {
            RequestConverter.convertRequest(dwaRequest);
        }

        expect(test).to.throw(/request\.id/);
    });

    it("collection, id", function () {
        var dwaRequest = {
            collection: "cols",
            id: mocks.data.testEntityId
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")", headers: {} });
    });

    it("collection, id in brackets {} converted to id without brackets", function () {
        var dwaRequest = {
            collection: "cols",
            id: '{' + mocks.data.testEntityId + '}'
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")", headers: {} });
    });

    it("full", function () {
        var dwaRequest = {
            collection: "cols",
            id: mocks.data.testEntityId,
            select: ["name"],
            returnRepresentation: true
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

        dwaRequest.navigationProperty = "nav";

        result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")/nav?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });
    });
});

describe("ErrorHelper.guidParameterCheck", function () {
    it("parses guid in brackets and removes them", function () {
        var guid = "{00000000-0000-0000-0000-000000000001}";

        var result = ErrorHelper.guidParameterCheck(guid);

        expect(result).to.eq("00000000-0000-0000-0000-000000000001");
    });

    it("throws an error with a specified message", function() {
        expect(function() {
            ErrorHelper.guidParameterCheck("ds", "fun", "param");
        }).to.throw("fun requires the param parameter is a GUID String");
    });
});