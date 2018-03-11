var chai = require('chai');
var expect = chai.expect;

var nock = require('nock');
var sinon = require('sinon');

var DWA = require('../lib/dwa');
var Utility = require('../lib/utilities/Utility');
var RequestConverter = require('../lib/utilities/RequestConverter');
var ErrorHelper = require('../lib/helpers/ErrorHelper');
var mocks = require("./stubs");
var dateReviver = require('../lib/requests/helpers/dateReviver');
var Request = require('../lib/requests/sendRequest');
var parseResponse = require('../lib/requests/helpers/parseResponse');

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
    it("pagingCookie is empty", function () {
        var result = Utility.getFetchXmlPagingCookie("", 2);
        expect(result).to.deep.equal({
            cookie: "",
            page: 2,
            nextPage: 3
        });
    });

    it("pagingCookie is null or undefined", function () {
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

    it("mergeLabels=true", function () {
        var dwaRequest = {
            mergeLabels: true
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: { 'MSCRM.MergeLabels': 'true' } });
    });

    it("mergeLabels=false", function () {
        var dwaRequest = {
            mergeLabels: false
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
        expect(result).to.deep.equal({ url: stubUrl, query: "$expand=property($filter=" + (encodeURIComponent("name eq 'name'")) + ")", headers: {} });
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
        expect(result).to.deep.equal({ url: stubUrl, query: "$filter=" + encodeURIComponent("name eq 'name'"), headers: {} });
    });

    it("filter - special symbols encoded", function () {
        var dwaRequest = {
            filter: "email eq 'test+email@example.com'"
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$filter=" + encodeURIComponent("email eq 'test+email@example.com'"), headers: {} });
    });

    it("filter - remove brackets from guid", function () {
        var dwaRequest = {
            filter: "name eq 'name' and testid1 eq {0000a000-0000-0000-0000-000000000001} and testid2 eq 0000a000-0000-0000-0000-000000000002 and teststring eq '{0000a000-0000-0000-0000-000000000003}'"
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "$filter=" + encodeURIComponent("name eq 'name' and testid1 eq 0000a000-0000-0000-0000-000000000001 and testid2 eq 0000a000-0000-0000-0000-000000000002 and teststring eq '{0000a000-0000-0000-0000-000000000003}'"), headers: {} });
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

    it("ifmatch & ifnonematch both specified - throws an error", function () {
        var dwaRequest = {
            ifmatch: "*",
            ifnonematch: "*"
        };

        var result = expect(function () {
            RequestConverter.convertRequestOptions(dwaRequest, "fun", stubUrl);
        }).to.throw("DynamicsWebApi.fun. Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.");
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
    });

    it("returnRepresentation null", function () {
        var dwaRequest = {
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

    it("duplicateDetection empty", function () {
        var dwaRequest = {
            duplicateDetection: false
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("duplicateDetection null", function () {
        var dwaRequest = {
            duplicateDetection: null
        };

        result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({ url: stubUrl, query: "", headers: {} });
    });

    it("duplicateDetection", function () {
        var dwaRequest = {
            duplicateDetection: true
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep
            .equal({ url: stubUrl, query: "", headers: { 'MSCRM.SuppressDuplicateDetection': 'false' } });
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

    it("includeAnnotations & returnRepresentation", function () {
        var dwaRequest = {
            returnRepresentation: true,
            includeAnnotations: DWA.Prefer.Annotations.AssociatedNavigationProperty
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"'
            }
        });
    });

    it("includeAnnotations & returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            returnRepresentation: true,
            includeAnnotations: '*',
            maxPageSize: 20
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20'
            }
        });
    });

    it("includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            includeAnnotations: '*',
            maxPageSize: 20
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: 'odata.include-annotations="*",odata.maxpagesize=20'
            }
        });
    });

    it("returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            returnRepresentation: true,
            maxPageSize: 20
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: DWA.Prefer.ReturnRepresentation + ',odata.maxpagesize=20'
            }
        });
    });

    it("prefer - return=representation", function () {
        var dwaRequest = {
            prefer: "return=representation"
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: DWA.Prefer.ReturnRepresentation
            }
        });
    });

    it("prefer - odata.include-annotations", function () {
        var dwaRequest = {
            prefer: 'odata.include-annotations=*'
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: 'odata.include-annotations="*"'
            }
        });
    });

    it("prefer - maxPageSize", function () {
        var dwaRequest = {
            prefer: 'odata.maxpagesize=20'
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: 'odata.maxpagesize=20'
            }
        });
    });

    it("prefer - includeAnnotations & returnRepresentation", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"'
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"'
            }
        });
    });

    it("prefer - includeAnnotations & returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="*",odata.maxpagesize=20'
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20'
            }
        });
    });

    it("prefer - includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'odata.include-annotations=*,odata.maxpagesize=20'
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: 'odata.include-annotations="*",odata.maxpagesize=20'
            }
        });
    });

    it("prefer - SPACE - includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'odata.include-annotations=*, odata.maxpagesize=20'
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: 'odata.include-annotations="*",odata.maxpagesize=20'
            }
        });
    });

    it("prefer - returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.maxpagesize=20'
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {
                Prefer: DWA.Prefer.ReturnRepresentation + ',odata.maxpagesize=20'
            }
        });
    });

    it("returnRepresentation: false & config.returnRepresentation: true", function () {
        var config = {
            returnRepresentation: true
        };

        var dwaRequest = {
            returnRepresentation: false
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl, null, config);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {}
        });
    });

    it("returnRepresentation: false & config.returnRepresentation: true", function () {
        var config = {
            returnRepresentation: false
        };

        var dwaRequest = {
            returnRepresentation: true
        };

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl, null, config);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: { Prefer: DWA.Prefer.ReturnRepresentation }
        });
    });

    it("config.returnRepresentation: true", function () {
        var config = {
            returnRepresentation: true
        };

        var dwaRequest = {};

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl, null, config);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: { Prefer: DWA.Prefer.ReturnRepresentation }
        });
    });

    it("config.returnRepresentation: false", function () {
        var config = {
            returnRepresentation: false
        };

        var dwaRequest = {};

        var result = RequestConverter.convertRequestOptions(dwaRequest, "", stubUrl, null, config);
        expect(result).to.deep.equal({
            url: stubUrl, query: "", headers: {}
        });
    });
});

describe("RequestConverter.convertRequest -", function () {
    //{ url: result.url, headers: result.headers }
    it("collection", function () {
        var dwaRequest = {
            collection: "cols"
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {}, async: true });
    });

    it("collection - to lower case", function () {
        var dwaRequest = {
            collection: "Cols"
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "Cols", headers: {}, async: true });
    });

    it("collection - to lower case exception", function () {
        var dwaRequest = {
            collection: "EntityDefinitions"
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "EntityDefinitions", headers: {}, async: true });
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
        expect(result).to.deep.equal({ url: "cols", headers: {}, async: true });

        dwaRequest.id = "";

        result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {}, async: true });
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
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")", headers: {}, async: true });
    });

    it("collection, id in brackets {} converted to id without brackets", function () {
        var dwaRequest = {
            collection: "cols",
            id: '{' + mocks.data.testEntityId + '}'
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")", headers: {}, async: true });
    });

    it("full", function () {
        var dwaRequest = {
            collection: "cols",
            id: mocks.data.testEntityId,
            select: ["name"],
            returnRepresentation: true
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation }, async: true });

        dwaRequest.navigationProperty = "nav";

        result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols(" + mocks.data.testEntityId + ")/nav?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation }, async: true });
    });

    it("async", function () {
        var dwaRequest = {
            collection: "cols",
            async: false
        };

        var result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {}, async: false });

        dwaRequest.async = true;

        result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {}, async: true });

        delete dwaRequest.async;

        result = RequestConverter.convertRequest(dwaRequest);
        expect(result).to.deep.equal({ url: "cols", headers: {}, async: true });
    });

    it("async - throw error", function () {
        var dwaRequest = {
            collection: "some",
            async: "something"
        };

        var test = function () {
            RequestConverter.convertRequest(dwaRequest);
        }

        expect(test).to.throw(/request\.async/);
    });
});

describe("ErrorHelper.handleErrorResponse", function () {
    it("returns a correct error object", function () {
        var errorResponse = {
            status: 500,
            message: "Invalid"
        };

        expect(function () {
            ErrorHelper.handleErrorResponse(errorResponse);
        }).to.throw("Error: 500: Invalid");
    });
});

describe("ErrorHelper.parameterCheck", function () {
    it("does not return anything", function () {
        var result = ErrorHelper.parameterCheck(2, "fun", "param", "type");
        expect(result).to.be.undefined;
    });
    it("when parameter is null it throws an error", function () {
        expect(function () {
            ErrorHelper.parameterCheck(null, "fun", "param", "type");
        }).to.throw("fun requires the param parameter to be of type type");
    });
    it("throws Error with message without type", function () {
        expect(function () {
            ErrorHelper.parameterCheck(null, "fun", "param");
        }).to.throw("fun requires the param parameter");
    });
});

describe("ErrorHelper.stringParameterCheck", function () {
    it("does not return anything", function () {
        var result = ErrorHelper.stringParameterCheck("2", "fun", "param");
        expect(result).to.be.undefined;
    });
    it("when parameter is wrong it throws an error", function () {
        expect(function () {
            ErrorHelper.stringParameterCheck(4, "fun", "param");
        }).to.throw("fun requires the param parameter to be of type String");
    });
});

describe("ErrorHelper.arrayParameterCheck", function () {
    it("does not return anything", function () {
        var result = ErrorHelper.arrayParameterCheck([], "fun", "param");
        expect(result).to.be.undefined;
    });
    it("when parameter is wrong it throws an error", function () {
        expect(function () {
            ErrorHelper.arrayParameterCheck({}, "fun", "param");
        }).to.throw("fun requires the param parameter to be of type Array");
    });
});

describe("ErrorHelper.stringOrArrayParameterCheck", function () {
    it("does not return anything", function () {
        var result = ErrorHelper.stringOrArrayParameterCheck([], "fun", "param");
        expect(result).to.be.undefined;

        result = ErrorHelper.stringOrArrayParameterCheck("ss", "fun", "param");
        expect(result).to.be.undefined;
    });
    it("when parameter is wrong it throws an error", function () {
        expect(function () {
            ErrorHelper.stringOrArrayParameterCheck({}, "fun", "param");
        }).to.throw("fun requires the param parameter to be of type String or Array");
    });
});

describe("ErrorHelper.numberParameterCheck", function () {
    it("does not return anything", function () {
        var result = ErrorHelper.numberParameterCheck(54, "fun", "param");
        expect(result).to.be.undefined;
    });
    it("when parameter is a string-number then the function does not return anything", function () {
        var result = ErrorHelper.numberParameterCheck("54", "fun", "param");
        expect(result).to.be.undefined;
    });
    it("when parameter is wrong it throws an error", function () {
        expect(function () {
            ErrorHelper.numberParameterCheck("a word", "fun", "param");
        }).to.throw("fun requires the param parameter to be of type Number");
    });
});

describe("ErrorHelper.boolParameterCheck", function () {
    it("does not return anything", function () {
        var result = ErrorHelper.boolParameterCheck(false, "fun", "param");
        expect(result).to.be.undefined;
    });
    it("when parameter is wrong it throws an error", function () {
        expect(function () {
            ErrorHelper.boolParameterCheck("a word", "fun", "param");
        }).to.throw("fun requires the param parameter to be of type Boolean");
    });
});

describe("ErrorHelper.callbackParameterCheck", function () {
    it("does not return anything", function () {
        var result = ErrorHelper.callbackParameterCheck(function () { }, "fun", "param");
        expect(result).to.be.undefined;
    });
    it("when parameter is wrong it throws an error", function () {
        expect(function () {
            ErrorHelper.callbackParameterCheck("a word", "fun", "param");
        }).to.throw("fun requires the param parameter to be of type Function");
    });
});

describe("ErrorHelper.guidParameterCheck", function () {
    it("parses guid in brackets and removes them", function () {
        var guid = "{00000000-0000-0000-0000-000000000001}";
        var result = ErrorHelper.guidParameterCheck(guid);
        expect(result).to.eq("00000000-0000-0000-0000-000000000001");
    });

    it("throws an error", function () {
        expect(function () {
            ErrorHelper.guidParameterCheck("ds", "fun", "param");
        }).to.throw("fun requires the param parameter to be of type GUID String");
    });
});

describe("ErrorHelper.keyParameterCheck", function () {
    it("parses guid in brackets and removes them", function () {
        var guid = "{00000000-0000-0000-0000-000000000001}";
        var result = ErrorHelper.keyParameterCheck(guid);
        expect(result).to.eq("00000000-0000-0000-0000-000000000001");
    });

    it("checks a correct alternate key", function () {
        var alternateKey = "altKey='value'";
        var result = ErrorHelper.keyParameterCheck(alternateKey);
        expect(result).to.eq("altKey='value'");
    });

    it("checks correct alternate keys", function () {
        var alternateKey = "altKey='value',anotherKey='value2'";
        var result = ErrorHelper.keyParameterCheck(alternateKey);
        expect(result).to.eq("altKey='value',anotherKey='value2'");
    });

    it("checks correct alternate keys (removes a space between them)", function () {
        var alternateKey = "altKey='value', anotherKey='value2'";
        var result = ErrorHelper.keyParameterCheck(alternateKey);
        expect(result).to.eq("altKey='value',anotherKey='value2'");
    });

    it("throws an error when alternate key is incorrect", function () {
        expect(function () {
            var alternateKey = "altKey='value, anotherKey='value2'";
            ErrorHelper.keyParameterCheck(alternateKey, "fun", "param");
        }).to.throw("fun requires the param parameter to be of type String representing GUID or Alternate Key");
    });

    it("throws an error", function () {
        expect(function () {
            ErrorHelper.keyParameterCheck("ds", "fun", "param");
        }).to.throw("fun requires the param parameter to be of type String representing GUID or Alternate Key");
    });

    it("throws an error when the parameter is not a string", function () {
        expect(function () {
            ErrorHelper.keyParameterCheck([], "fun", "param");
        }).to.throw("fun requires the param parameter to be of type String representing GUID or Alternate Key");
    });
});

describe("dateReviver", function () {
    it("returns date when a string matches exact 'YYYY-MM-DDTHH:MM:SSZ' teamplate", function () {
        var result = dateReviver('any', '2016-12-22T23:22:12Z');
        expect(result).to.deep.equal(new Date('2016-12-22T23:22:12Z'));
    });

    it("returns the same value when a string does not match exact 'YYYY-MM-DDTHH:MM:SSZ' teamplate", function () {
        var result = dateReviver('any', 'other');
        expect(result).to.equal('other');
    });

    it("returns the same value when its type is not String", function () {
        var result = dateReviver('any', 54);
        expect(result).to.equal(54);
    });
});

describe("DWA.Types", function () {
    it("ResponseBase", function () {
        expect(new DWA.Types.ResponseBase().oDataContext).to.eq("");
    });

    it("Response", function () {
        expect(new DWA.Types.Response().value).to.deep.equal({});
    });

    it("ReferenceResponse", function () {
        expect(new DWA.Types.ReferenceResponse()).to.deep
            .equal({ oDataContext: "", id: "", collection: "" });
    });

    it("MultipleResponse", function () {
        expect(new DWA.Types.MultipleResponse()).to.deep
            .equal({ oDataContext: "", oDataNextLink: "", oDataCount: 0, value: [] });
    });

    it("FetchXmlResponse", function () {
        expect(new DWA.Types.FetchXmlResponse()).to.deep
            .equal({
                oDataContext: "", value: [], PagingInfo: {
                    cookie: "", page: 0, nextPage: 1
                }
            });
    });
});

describe('Request.makeRequest', function () {
    describe('useEntityNames', function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            var response2 = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get('/EntityDefinitions?$select=LogicalCollectionName,LogicalName')
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get('/tests(' + mocks.data.testEntityId + ')')
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
            Request._clearEntityNames();
        });

        it("returns a correct response", function (done) {
            //{ webApiUrl: mocks.webApiUrl }
            var request = {
                collection: 'test',
                key: mocks.data.testEntityId
            };
            var config = {
                webApiUrl: mocks.webApiUrl,
                useEntityNames: true
            };
            Request.makeRequest('GET', request, 'any', config, function (object) {
                var expectedO = {
                    status: 200,
                    headers: {},
                    data: mocks.data.testEntity
                };
                expect(object).to.deep.equal(expectedO);
                done();
            }, function (object) {
                expect(object).to.be.undefined;
                done();
            });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe('useEntityNames - entity metadata requested only once', function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            var response2 = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get('/EntityDefinitions?$select=LogicalCollectionName,LogicalName')
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get('/tests(' + mocks.data.testEntityId + ')')
                .twice()
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
            Request._clearEntityNames();
        });

        it("returns a correct response", function (done) {
            var request = {
                collection: 'test',
                key: mocks.data.testEntityId
            };
            var config = {
                webApiUrl: mocks.webApiUrl,
                useEntityNames: true
            };

            var error = function (object) {
                expect(object).to.be.undefined;
                done();
            };

            Request.makeRequest('GET', request, 'any', config, function (object) {
                var expectedO = {
                    status: 200,
                    headers: {},
                    data: mocks.data.testEntity
                };
                expect(object).to.deep.equal(expectedO);

                var request2 = {
                    collection: 'test',
                    key: mocks.data.testEntityId
                };

                Request.makeRequest('GET', request2, 'any', config, function (object1) {
                    var expectedO1 = {
                        status: 200,
                        headers: {},
                        data: mocks.data.testEntity
                    };
                    expect(object1).to.deep.equal(expectedO1);
                    done();
                }, error);
            }, error);
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe('useEntityNames - request with collection name does not fail', function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            var response2 = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get('/EntityDefinitions?$select=LogicalCollectionName,LogicalName')
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get('/tests(' + mocks.data.testEntityId + ')')
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
            Request._clearEntityNames();
        });

        it("returns a correct response", function (done) {
            var request = {
                collection: 'tests',
                key: mocks.data.testEntityId
            };
            var config = {
                webApiUrl: mocks.webApiUrl,
                useEntityNames: true
            };
            Request.makeRequest('GET', request, 'any', config, function (object) {
                var expectedO = {
                    status: 200,
                    headers: {},
                    data: mocks.data.testEntity
                };
                expect(object).to.deep.equal(expectedO);
                done();
            }, function (object) {
                expect(object).to.be.undefined;
                done();
            });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe('useEntityNames - Xrm.Internal', function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            var response2 = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get('/tests(' + mocks.data.testEntityId + ')')
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
            Request._clearEntityNames();
            global.Xrm.Internal = null;
        });

        it("returns a correct response", function (done) {
            global.Xrm.Internal = {
                getEntitySetName: function (entityName) {
                    return entityName + 's';
                }
            };

            var request = {
                collection: 'test',
                key: mocks.data.testEntityId
            };
            var config = {
                webApiUrl: mocks.webApiUrl,
                useEntityNames: true
            };
            Request.makeRequest('GET', request, 'any', config, function (object) {
                var expectedO = {
                    status: 200,
                    headers: {},
                    data: mocks.data.testEntity
                };
                expect(object).to.deep.equal(expectedO);
                done();
            }, function (object) {
                expect(object).to.be.undefined;
                done();
            });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("Request.sendRequest", function () {
    describe("when url is long, request is converted to batch", function () {
        var scope;
        var url = 'test';
        while (url.length < 2001) {
            url += 'test';
        };
        var rBody = mocks.data.batch.replace('{0}', mocks.webApiUrl + url);
        var rBodys = rBody.split('\n');
        var checkBody = '';
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }

        before(function () {
            var response = mocks.responses.batch;
            scope = nock(mocks.webApiUrl + '$batch')
                .filteringRequestBody(function (body) {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, 'dwa_batch_XXX');
                    var bodys = body.split('\n');

                    var resultBody = '';
                    for (var i = 0; i < bodys.length; i++) {
                        resultBody += bodys[i];
                    }
                    return resultBody;
                })
                .post("", checkBody)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            Request.sendRequest('GET', url, { webApiUrl: mocks.webApiUrl }, null, null, function (object) {
                var multiple = mocks.responses.multiple();
                //delete multiple.oDataContext;
                var expectedO = {
                    status: 200,
                    headers: {},
                    data: multiple
                };
                expect(object).to.deep.equal(expectedO);
                done();
            }, function (object) {
                expect(object).to.be.undefined;
                done();
            });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("removes additional properties set by DynamicsWebApi", function () {
        var scope;
        var url = 'test';
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl + 'test')
                .patch("", mocks.data.testEntity)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            Request.sendRequest('PATCH', url, { webApiUrl: mocks.webApiUrl }, mocks.data.testEntityAdditionalAttributes, null, function (object) {
                var expectedO = {
                    status: mocks.responses.basicEmptyResponseSuccess.status,
                    headers: {},
                    data: null
                };
                expect(object).to.deep.equal(expectedO);
                done();
            }, function (object) {
                expect(object).to.be.undefined;
                done();
            });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("parseResponse", function () {
    it("parses formatted values", function () {
        var response = parseResponse(mocks.responses.responseFormatted200.responseText);
        expect(response).to.be.deep.equal(mocks.responses.responseFormattedEntity());
    });

    it("parses formatted values - array", function () {
        var response = parseResponse(mocks.responses.multipleFormattedResponse.responseText);
        expect(response).to.be.deep.equal(mocks.responses.multipleFormatted());
    });

    it("parses formatted and aliased values", function () {
        var response = parseResponse(mocks.responses.responseFormattedAliased200.responseText);
        expect(response).to.be.deep.equal(mocks.responses.responseFormattedAliasedEntity());
    });

    it("when alias are not unique throws error", function () {
        expect(function () {
            parseResponse(mocks.responses.responseFormattedAliasedNotUnique200.responseText);
        }).to.throw("The alias name of the linked entity must be unique!");
    });
});