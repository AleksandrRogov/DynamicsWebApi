﻿var chai = require('chai');
var expect = chai.expect;

var nock = require('nock');
var sinon = require('sinon');

var { DWA } = require('../lib/dwa');
var { Utility } = require('../lib/utilities/Utility');
var { RequestUtility } = require("../lib/utilities/RequestUtility");
var { ErrorHelper } = require('../lib/helpers/ErrorHelper');
var mocks = require("./stubs");
var { dateReviver } = require('../lib/requests/helpers/dateReviver');
var { RequestClient } = require('../lib/requests/RequestClient');
var { parseResponse } = require('../lib/requests/helpers/parseResponse');

describe("Utility.", function () {
    describe("buildFunctionParameters - ", function () {
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
        it("object parameter", function () {
            var result = Utility.buildFunctionParameters({ param1: { test1: "value", '@odata.type': 'account' } });
            expect(result).to.equal("(param1=@p1)?@p1={\"test1\":\"value\",\"@odata.type\":\"account\"}");
        });
        it("Microsoft.Dynamics.CRM namespace parameter", function () {
            var result = Utility.buildFunctionParameters({ param1: "Microsoft.Dynamics.CRM.Enum'Type'", param2: 2, param3: "value2" });
            expect(result).to.equal("(param1=@p1,param2=@p2,param3=@p3)?@p1=Microsoft.Dynamics.CRM.Enum'Type'&@p2=2&@p3='value2'");
        });
    });

    describe("getFetchXmlPagingCookie - ", function () {
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

            result = Utility.getFetchXmlPagingCookie();
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

    describe("getXrmContext - GetGlobalContext", function () {
        before(function () {
            global.GetGlobalContext = function () {
                return "Global Context";
            };
        });

        after(function () {
            global.GetGlobalContext = undefined;
        });

        it("returns a correct object", function () {
            var result = Utility.getXrmContext();

            expect(result).to.be.eq("Global Context");
        });
    });

    describe("getXrmContext - Xrm.Utility.getGlobalContext", function () {
        before(function () {
            global.Xrm.Utility = {
                getGlobalContext: function () {
                    return {
                        getClientUrl: function () {
                            return "Xrm.Utility";
                        }
                    };
                }
            };
        });

        after(function () {
            global.Xrm.Utility = undefined;
        });

        it("returns a correct object", function () {
            var result = Utility.getXrmContext().getClientUrl();

            expect(result).to.be.eq("Xrm.Utility");
        });
    });

    describe("getXrmContext - Form context does not exist", function () {
        before(function () {
            global.Xrm = undefined;
        });

        after(function () {
            global.Xrm = {
                Page: {
                    context: {
                        getClientUrl: function () {
                            return "http://testorg.crm.dynamics.com";
                        }
                    }
                }
            };
        });

        it("throws an error", function () {
            expect(function () {
                Utility.getXrmContext();
            }).to.throw();
        });
    });

    describe("getXrmContext - Xrm.Page is null", function () {
        before(function () {
            global.Xrm.Page = undefined;
        });

        after(function () {
            global.Xrm.Page = {
                context: {
                    getClientUrl: function () {
                        return "http://testorg.crm.dynamics.com";
                    }
                }
            };
        });

        it("throws an error", function () {
            expect(function () {
                Utility.getXrmContext();
            }).to.throw();
        });
    });

    describe("getXrmContext - Xrm.Page.context is null", function () {
        before(function () {
            global.Xrm.Page.context = null;
        });

        after(function () {
            global.Xrm.Page.context = {
                getClientUrl: function () {
                    return "http://testorg.crm.dynamics.com";
                }
            };
        });

        it("returns a correct string", function () {
            expect(function () {
                Utility.getXrmContext();
            }).to.throw();
        });
    });

    describe("getClientUrl - removes a slash at the end", function () {
        before(function () {
            global.Xrm.Page.context.getClientUrl = function () {
                return "http://testorg.crm.dynamics.com/";
            };
        });

        after(function () {
            global.Xrm.Page.context.getClientUrl = function () {
                return "http://testorg.crm.dynamics.com";
            };
        });

        it("returns a correct string", function () {
            var result = Utility.getClientUrl();

            expect(result).to.be.eq("http://testorg.crm.dynamics.com");
        });
    });
});

describe("RequestUtility.composeUrl -", function () {
    var stubUrl = mocks.webApiUrl + "tests";
    it("request is empty", function () {
        var dwaRequest;

        var result = RequestUtility.composeUrl(dwaRequest, "", null, "&", stubUrl);
        expect(result).to.equal(stubUrl);

        result = RequestUtility.composeUrl(null, "", null, "&", stubUrl);
        expect(result).to.equal(stubUrl);

        result = RequestUtility.composeUrl({}, "", null, "&", stubUrl);
        expect(result).to.equal(stubUrl);

    });

    it("count=true", function () {
        var dwaRequest = {
            count: true
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$count=true`);
    });

    it("count=false", function () {
        var dwaRequest = {
            count: false
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("expand is empty", function () {
        var dwaRequest = {
            expand: undefined
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            expand: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            expand: []
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("expand - filter without expand.property", function () {
        var dwaRequest = {
            expand: [{
                filter: "name eq 'name'"
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            expand: [{
                filter: "name eq 'name'",
                property: null
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("expand - property", function () {
        var dwaRequest = {
            expand: [{
                property: "property"
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,filter empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                filter: ""
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [{
                property: "property",
                filter: null
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,filter", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                filter: "name eq 'name'"
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($filter=${encodeURIComponent("name eq 'name'")})`);
    });

    it("expand - property,orderBy empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                orderBy: []
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [{
                property: "property",
                orderBy: null
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,orderBy", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                orderBy: ["name"]
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($orderby=name)`);

        dwaRequest = {
            expand: [{
                property: "property",
                orderBy: ["name", "subject"]
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($orderby=name,subject)`);
    });

    it("expand - property,select empty", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: []
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [{
                property: "property",
                select: null
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,select", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: ["name"]
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($select=name)`);

        dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"]
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($select=name,subject)`);
    });

    it("expand - property,top empty or <=0", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                top: 0
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [{
                property: "property",
                top: -1
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [{
                property: "property",
                top: null
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,top", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                top: 3
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($top=3)`);
    });

    it("expand - different properties", function () {
        var dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"],
                top: 3
            }]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($select=name,subject;$top=3)`);

        dwaRequest = {
            expand: [{
                property: "property",
                select: ["name", "subject"],
                orderBy: ["order"],
                top: 3
            }]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($select=name,subject;$top=3;$orderby=order)`);
    });

    it("filter empty", function () {
        var dwaRequest = {
            filter: ""
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            filter: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("filter", function () {
        var dwaRequest = {
            filter: "name eq 'name'"
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$filter=${encodeURIComponent("name eq 'name'")}`);
    });

    it("filter - special symbols encoded", function () {
        var dwaRequest = {
            filter: "email eq 'test+email@example.com'"
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$filter=${encodeURIComponent("email eq 'test+email@example.com'")}`);
    });

    it("filter - remove brackets from guid", function () {
        var dwaRequest = {
            filter: "name eq 'name' and testid1 eq {0000a000-0000-0000-0000-000000000001} and testid2 eq 0000a000-0000-0000-0000-000000000002 and teststring eq '{0000a000-0000-0000-0000-000000000003}'"
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$filter=${encodeURIComponent("name eq 'name' and testid1 eq 0000a000-0000-0000-0000-000000000001 and testid2 eq 0000a000-0000-0000-0000-000000000002 and teststring eq '{0000a000-0000-0000-0000-000000000003}'")}`);
    });

    //test bug 2018-06-11
    it("filter - grouping & remove brackets from guid ", function () {
        var dwaRequest = {
            filter: "name eq 'name' and (testid1 eq {0000a000-0000-0000-0000-000000000001} or testid2 eq {0000a000-0000-0000-0000-000000000002})"
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$filter=${encodeURIComponent("name eq 'name' and (testid1 eq 0000a000-0000-0000-0000-000000000001 or testid2 eq 0000a000-0000-0000-0000-000000000002)")}`);
    });

    //test bug 2018-06-11
    it("filter - grouping & remove brackets from a single guid", function () {
        var dwaRequest = {
            filter: "name eq 'name' and (testid1 eq {0000a000-0000-0000-0000-000000000001})"
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$filter=${encodeURIComponent("name eq 'name' and (testid1 eq 0000a000-0000-0000-0000-000000000001)")}`);
    });

    it("ifmatch empty", function () {
        var dwaRequest = {
            ifmatch: ""
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            ifmatch: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("navigationProperty empty", function () {
        var dwaRequest = {
            navigationProperty: ""
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            navigationProperty: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("navigationProperty", function () {
        var dwaRequest = {
            navigationProperty: "nav"
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl + "/nav");
    });

    it("orderBy empty", function () {
        var dwaRequest = {
            orderBy: []
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            orderBy: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("orderBy", function () {
        var dwaRequest = {
            orderBy: ["name"]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl + "?$orderby=name");

        dwaRequest = {
            orderBy: ["name", "subject"]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl + "?$orderby=name,subject");
    });

    it("select empty", function () {
        var dwaRequest = {
            select: []
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            select: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("select", function () {
        var dwaRequest = {
            select: ["name"]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl + "?$select=name");

        dwaRequest = {
            select: ["name", "subject"]
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.equal(stubUrl + "?$select=name,subject");
    });

    it("select navigation property", function () {
        var dwaRequest = {
            select: ["/nav"]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "retrieve", null, null, stubUrl);
        expect(result).to.equal(stubUrl + "/nav");

        dwaRequest = {
            select: ["/nav", "subject"]
        };

        result = RequestUtility.composeUrl(dwaRequest, "retrieve", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "/nav?$select=subject");

        dwaRequest = {
            select: ["/nav", "subject", "fullname"]
        };

        result = RequestUtility.composeUrl(dwaRequest, "retrieve", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "/nav?$select=subject,fullname");
    });

    it("select reference", function () {
        var dwaRequest = {
            select: ["nav/$ref"]
        };

        var result = RequestUtility.composeUrl(dwaRequest, "retrieve", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "/nav/$ref");
    });

    it("top empty or <=0", function () {
        var dwaRequest = {
            top: 0
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);

        dwaRequest = {
            top: -1
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);

        dwaRequest = {
            top: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);
    });

    it("top", function () {
        var dwaRequest = {
            top: 3
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?$top=3");
    });

    it("savedQuery empty", function () {
        var dwaRequest = {
            savedQuery: ""
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);

        dwaRequest = {
            savedQuery: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);
    });

    it("savedQuery", function () {
        var dwaRequest = {
            savedQuery: mocks.data.testEntityId
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?savedQuery=" + mocks.data.testEntityId);
    });

    it("userQuery empty", function () {
        var dwaRequest = {
            userQuery: ""
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);

        dwaRequest = {
            userQuery: null
        };

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);
    });

    it("userQuery", function () {
        var dwaRequest = {
            userQuery: mocks.data.testEntityId
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?userQuery=" + mocks.data.testEntityId);
    });

    it("multiple options", function () {
        var dwaRequest = {
            select: ["name", "subject"],
            orderBy: ["order"],
            top: 5
        };

        var result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?$select=name,subject&$top=5&$orderby=order");

        dwaRequest.expand = [{
            property: "property",
            select: ["name"],
            orderBy: ["order"]
        }, {
            property: "property2",
            select: ["name3"]
        }];

        result = RequestUtility.composeUrl(dwaRequest, "", null, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?$select=name,subject&$top=5&$orderby=order&$expand=property($select=name;$orderby=order),property2($select=name3)");

        //todo: move to compose
        dwaRequest.collection = "tests";
        dwaRequest.expand = null;
        dwaRequest.returnRepresentation = true;

        result = RequestUtility.compose(dwaRequest, null, "");
        expect(result).to.deep.equal({ path: "tests?$select=name,subject&$top=5&$orderby=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation }, async: true });

        dwaRequest.top = 0;
        dwaRequest.count = true;
        dwaRequest.impersonate = mocks.data.testEntityId;

        result = RequestUtility.compose(dwaRequest, null, "");
        expect(result).to.deep.equal({ path: "tests?$select=name,subject&$count=true&$orderby=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation, MSCRMCallerID: mocks.data.testEntityId }, async: true });

        dwaRequest.impersonate = null;
        dwaRequest.navigationProperty = "nav";

        result = RequestUtility.compose(dwaRequest, null, "");
        expect(result).to.deep.equal({ path: "tests/nav?$select=name,subject&$count=true&$orderby=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation }, async: true });

        dwaRequest.navigationProperty = null;
        dwaRequest.returnRepresentation = false;
        dwaRequest.includeAnnotations = DWA.Prefer.Annotations.All;
        dwaRequest.select[0] = "/nav";

        result = RequestUtility.compose(dwaRequest, null, "retrieve");
        expect(result).to.deep.equal({ path: "tests/nav?$select=subject&$count=true&$orderby=order", headers: { Prefer: 'odata.include-annotations="*"' }, async: true });
    });
});

describe("RequestUtility.composeHeaders -", function () {
    it("mergeLabels=true", function () {
        var dwaRequest = {
            mergeLabels: true
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ 'MSCRM.MergeLabels': 'true' });
    });

    it("mergeLabels=false", function () {
        var dwaRequest = {
            mergeLabels: false
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("ifmatch", function () {
        var dwaRequest = {
            ifmatch: "*"
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ "If-Match": "*" });
    });

    it("ifnonematch empty", function () {
        var dwaRequest = {
            ifnonematch: ""
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});

        dwaRequest = {
            ifnonematch: null
        };

        result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("ifnonematch", function () {
        var dwaRequest = {
            ifnonematch: "*"
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ "If-None-Match": "*" });
    });

    it("ifmatch & ifnonematch both specified - throws an error", function () {
        var dwaRequest = {
            ifmatch: "*",
            ifnonematch: "*"
        };

        expect(function () {
            RequestUtility.composeHeaders(dwaRequest, "fun");
        }).to.throw("DynamicsWebApi.fun. Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.");
    });

    it("impersonate empty", function () {
        var dwaRequest = {
            impersonate: ""
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});

        dwaRequest = {
            impersonate: null
        };

        result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("impersonate", function () {
        var dwaRequest = {
            impersonate: mocks.data.testEntityId
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ "MSCRMCallerID": mocks.data.testEntityId });
    });

    it("includeAnnotations empty", function () {
        var dwaRequest = {
            includeAnnotations: ""
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});

        dwaRequest = {
            includeAnnotations: null
        };

        result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("includeAnnotations", function () {
        var dwaRequest = {
            includeAnnotations: DWA.Prefer.Annotations.AssociatedNavigationProperty
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"' });
    });

    it("maxPageSize empty or <=0", function () {
        var dwaRequest = {
            maxPageSize: 0
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});

        dwaRequest = {
            maxPageSize: null
        };

        result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});

        dwaRequest = {
            maxPageSize: -2
        };

        result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("maxPageSize", function () {
        var dwaRequest = {
            maxPageSize: 10
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.maxpagesize=10' });
    });

    it("returnRepresentation empty", function () {
        var dwaRequest = {
            returnRepresentation: false
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("returnRepresentation null", function () {
        var dwaRequest = {
            returnRepresentation: null
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("returnRepresentation", function () {
        var dwaRequest = {
            returnRepresentation: true
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation });
    });

    it("duplicateDetection empty", function () {
        var dwaRequest = {
            duplicateDetection: false
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("duplicateDetection null", function () {
        var dwaRequest = {
            duplicateDetection: null
        };

        result = result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({});
    });

    it("duplicateDetection", function () {
        var dwaRequest = {
            duplicateDetection: true
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ 'MSCRM.SuppressDuplicateDetection': 'false' });
    });

    it("includeAnnotations & returnRepresentation", function () {
        var dwaRequest = {
            returnRepresentation: true,
            includeAnnotations: DWA.Prefer.Annotations.AssociatedNavigationProperty
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"' });
    });

    it("includeAnnotations & returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            returnRepresentation: true,
            includeAnnotations: '*',
            maxPageSize: 20
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            includeAnnotations: '*',
            maxPageSize: 20
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            returnRepresentation: true,
            maxPageSize: 20
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.maxpagesize=20' });
    });

    it("prefer - return=representation", function () {
        var dwaRequest = {
            prefer: "return=representation"
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation });
    });

    it("prefer - odata.include-annotations", function () {
        var dwaRequest = {
            prefer: 'odata.include-annotations=*'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="*"' });
    });

    it("prefer - maxPageSize", function () {
        var dwaRequest = {
            prefer: 'odata.maxpagesize=20'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.maxpagesize=20' });
    });

    it("prefer - includeAnnotations & returnRepresentation", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"' });
    });

    it("prefer - includeAnnotations & returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="*",odata.maxpagesize=20'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("prefer - includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'odata.include-annotations=*,odata.maxpagesize=20'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("prefer - SPACE - includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'odata.include-annotations=*, odata.maxpagesize=20'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("prefer - returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.maxpagesize=20'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.maxpagesize=20' });
    });

    it("prefer - trackChanges & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'odata.track-changes,odata.maxpagesize=20'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.maxpagesize=20,odata.track-changes' });
    });

    it("prefer - trackChanges & includeAnnotations", function () {
        var dwaRequest = {
            prefer: 'odata.track-changes,odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '",odata.track-changes' });
    });

    it("prefer - includeAnnotations & returnRepresentation & maxPageSize & trackChanges", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="*",odata.track-changes,odata.maxpagesize=20'
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "");
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20,odata.track-changes' });
    });

    it("returnRepresentation: false & config.returnRepresentation: true", function () {
        var config = {
            returnRepresentation: true
        };

        var dwaRequest = {
            returnRepresentation: false
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "", config);
        expect(result).to.deep.equal({});
    });

    it("returnRepresentation: false & config.returnRepresentation: true", function () {
        var config = {
            returnRepresentation: false
        };

        var dwaRequest = {
            returnRepresentation: true
        };

        var result = RequestUtility.composeHeaders(dwaRequest, "", config);
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation });
    });

    it("config.returnRepresentation: true", function () {
        var config = {
            returnRepresentation: true
        };

        var dwaRequest = {};

        var result = RequestUtility.composeHeaders(dwaRequest, "", config);
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation });
    });

    it("config.returnRepresentation: false", function () {
        var config = {
            returnRepresentation: false
        };

        var dwaRequest = {};

        var result = RequestUtility.composeHeaders(dwaRequest, "", config);
        expect(result).to.deep.equal({});
    });
});

describe("RequestUtility.compose -", function () {
    //{ url: result.url, headers: result.headers }
    it("collection", function () {
        var dwaRequest = {
            collection: "cols"
        };

        var result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols", headers: {}, async: true });
    });

    it("collection - to lower case", function () {
        var dwaRequest = {
            collection: "Cols"
        };

        var result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "Cols", headers: {}, async: true });
    });

    it("collection - to lower case exception", function () {
        var dwaRequest = {
            collection: "EntityDefinitions"
        };

        var result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "EntityDefinitions", headers: {}, async: true });
    });

    it("collection empty - throw error", function () {
        var dwaRequest = {
            collection: ""
        };

        var test = function () {
            RequestUtility.compose(dwaRequest);
        };

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

        var result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols", headers: {}, async: true });

        dwaRequest.id = "";

        result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols", headers: {}, async: true });
    });

    it("collection, id - wrong format throw error", function () {
        var dwaRequest = {
            collection: "cols",
            id: "sa"
        };

        var test = function () {
            RequestUtility.compose(dwaRequest);
        };

        expect(test).to.throw(/request\.id/);
    });

    it("collection, id", function () {
        var dwaRequest = {
            collection: "cols",
            id: mocks.data.testEntityId
        };

        var result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols(" + mocks.data.testEntityId + ")", headers: {}, async: true });
    });

    it("collection, id in brackets {} converted to id without brackets", function () {
        var dwaRequest = {
            collection: "cols",
            id: '{' + mocks.data.testEntityId + '}'
        };

        var result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols(" + mocks.data.testEntityId + ")", headers: {}, async: true });
    });

    it("full", function () {
        var dwaRequest = {
            collection: "cols",
            id: mocks.data.testEntityId,
            select: ["name"],
            returnRepresentation: true
        };

        var result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols(" + mocks.data.testEntityId + ")?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation }, async: true });

        dwaRequest.navigationProperty = "nav";

        result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols(" + mocks.data.testEntityId + ")/nav?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation }, async: true });
    });

    it("async", function () {
        var dwaRequest = {
            collection: "cols",
            async: false
        };

        var result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols", headers: {}, async: false });

        dwaRequest.async = true;

        result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols", headers: {}, async: true });

        delete dwaRequest.async;

        result = RequestUtility.compose(dwaRequest);
        expect(result).to.deep.equal({ path: "cols", headers: {}, async: true });
    });

    it("async - throw error", function () {
        var dwaRequest = {
            collection: "some",
            async: "something"
        };

        var test = function () {
            RequestUtility.compose(dwaRequest);
        };

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

    it("checks correct alternate keys string and integer", function () {
        var alternateKey = "altKey=123456,anotherKey='value2'";
        var result = ErrorHelper.keyParameterCheck(alternateKey);
        expect(result).to.eq("altKey=123456,anotherKey='value2'");
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

//describe("DWA.Types", function () {
//    it("ResponseBase", function () {
//        expect(new DWA.Types.ResponseBase().oDataContext).to.eq("");
//    });

//    it("Response", function () {
//        expect(new DWA.Types.Response().value).to.deep.equal({});
//    });

//    it("ReferenceResponse", function () {
//        expect(new DWA.Types.ReferenceResponse()).to.deep
//            .equal({ oDataContext: "", id: "", collection: "" });
//    });

//    it("MultipleResponse", function () {
//        expect(new DWA.Types.MultipleResponse()).to.deep
//            .equal({ oDataContext: "", oDataNextLink: "", oDataCount: 0, value: [] });
//    });

//    it("FetchXmlResponse", function () {
//        expect(new DWA.Types.FetchXmlResponse()).to.deep
//            .equal({
//                oDataContext: "", value: [], PagingInfo: {
//                    cookie: "", page: 0, nextPage: 1
//                }
//            });
//    });
//});

describe('RequestClient.makeRequest', function () {
    describe('useEntityNames', function () {
        var scope;
        before(function () {
            var response = mocks.responses.response200;
            var response2 = mocks.responses.responseEntityDefinitions;
            scope = nock(mocks.webApiUrl)
                .get('/EntityDefinitions?$select=EntitySetName,LogicalName')
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get('/tests(' + mocks.data.testEntityId + ')')
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
            RequestClient._clearEntityNames();
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
            RequestClient.makeRequest('GET', request, 'any', config, null, function (object) {
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
                .get('/EntityDefinitions?$select=EntitySetName,LogicalName')
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get('/tests(' + mocks.data.testEntityId + ')')
                .twice()
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
            RequestClient._clearEntityNames();
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

            RequestClient.makeRequest('GET', request, 'any', config, null, function (object) {
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

                RequestClient.makeRequest('GET', request2, 'any', config, null, function (object1) {
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
                .get('/EntityDefinitions?$select=EntitySetName,LogicalName')
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get('/tests(' + mocks.data.testEntityId + ')')
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
            RequestClient._clearEntityNames();
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
            RequestClient.makeRequest('GET', request, 'any', config, null, function (object) {
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

	describe('useEntityNames - $batch', function () {
		var scope;
		before(function () {
			var response = mocks.responses.response200;
			var response2 = mocks.responses.responseEntityDefinitions;
			scope = nock(mocks.webApiUrl)
				.get('/EntityDefinitions?$select=EntitySetName,LogicalName')
				.once()
				.reply(response2.status, response2.responseText, response2.responseHeaders)
				.post('/$batch(' + mocks.data.testEntityId + ')')
				.reply(response.status, response.responseText, response.responseHeaders);
		});

		after(function () {
			nock.cleanAll();
			RequestClient._clearEntityNames();
		});

		it("returns a correct response", function (done) {
			//{ webApiUrl: mocks.webApiUrl }
			var request = {
				collection: '$batch',
				key: mocks.data.testEntityId
			};
			var config = {
				webApiUrl: mocks.webApiUrl,
				useEntityNames: true
			};
			RequestClient.makeRequest('POST', request, 'any', config, null, function (object) {
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

	describe("timeout - socket (request timeout)", function () {
		var scope;
		var url = 'test';
		before(function () {
			var response = mocks.responses.basicEmptyResponseSuccess;
			scope = nock(mocks.webApiUrl + 'test')
				.post("", mocks.data.testEntity)
				.socketDelay(1000)
				.reply(response.status, response.responseText, response.responseHeaders);
		});

		after(function () {
			nock.cleanAll();
		});

		it("returns a correct response", function (done) {
			var request = {
				collection: url,
				timeout: 500,
				entity: mocks.data.testEntityAdditionalAttributes
			};
			var config = {
				webApiUrl: mocks.webApiUrl
			};

			RequestClient.makeRequest('POST', request, 'any', config, null, function (object) {
				expect(object).to.be.undefined;
				done(object);
			}, function (error) {
				expect(error.message).to.be.eq("socket hang up");
				expect(error.code).to.be.eq("ECONNRESET");
				done();
			});
		});

		it("all requests have been made", function () {
			expect(scope.isDone()).to.be.true;
		});
	});

	describe("timeout - socket (config)", function () {
		var scope;
		var url = 'test';
		before(function () {
			var response = mocks.responses.basicEmptyResponseSuccess;
			scope = nock(mocks.webApiUrl + 'test')
				.post("", mocks.data.testEntity)
				.socketDelay(1000)
				.reply(response.status, response.responseText, response.responseHeaders);
		});

		after(function () {
			nock.cleanAll();
		});

		it("returns a correct response", function (done) {
			var request = {
				collection: url,
				entity: mocks.data.testEntityAdditionalAttributes
			};
			var config = {
				timeout: 500,
				webApiUrl: mocks.webApiUrl
			};

			RequestClient.makeRequest('POST', request, 'any', config, null, function (object) {
				expect(object).to.be.undefined;
				done(object);
			}, function (error) {
				expect(error.message).to.be.eq("socket hang up");
				expect(error.code).to.be.eq("ECONNRESET");
				done();
			});
		});

		it("all requests have been made", function () {
			expect(scope.isDone()).to.be.true;
		});
	});

	describe("timeout - connection delay (request timeout)", function () {
		var scope;
		var url = 'test';
		before(function () {
			var response = mocks.responses.basicEmptyResponseSuccess;
			scope = nock(mocks.webApiUrl + 'test')
				.post("", mocks.data.testEntity)
				.delayConnection(1000)
				.reply(response.status, response.responseText, response.responseHeaders);
		});

		after(function () {
			nock.cleanAll();
		});

		it("returns a correct response", function (done) {
			var request = {
				collection: url,
				timeout: 500,
				entity: mocks.data.testEntityAdditionalAttributes
			};
			var config = {
				webApiUrl: mocks.webApiUrl
			};

			RequestClient.makeRequest('POST', request, 'any', config, null, function (object) {
				expect(object).to.be.undefined;
				done(object);
			}, function (error) {
				expect(error.message).to.be.eq("socket hang up");
				expect(error.code).to.be.eq("ECONNRESET");
				done();
			});
		});

		it("all requests have been made", function () {
			expect(scope.isDone()).to.be.true;
		});
	});

	describe("timeout - connection delay (config)", function () {
		var scope;
		var url = 'test';
		before(function () {
			var response = mocks.responses.basicEmptyResponseSuccess;
			scope = nock(mocks.webApiUrl + 'test')
				.post("", mocks.data.testEntity)
				.delayConnection(1000)
				.reply(response.status, response.responseText, response.responseHeaders);
		});

		after(function () {
			nock.cleanAll();
		});

		it("returns a correct response", function (done) {
			var request = {
				collection: url,
				entity: mocks.data.testEntityAdditionalAttributes
			};
			var config = {
				timeout: 500,
				webApiUrl: mocks.webApiUrl
			};

			RequestClient.makeRequest('POST', request, 'any', config, null, function (object) {
				expect(object).to.be.undefined;
				done(object);
			}, function (error) {
				expect(error.message).to.be.eq("socket hang up");
				expect(error.code).to.be.eq("ECONNRESET");
				done();
			});
		});

		it("all requests have been made", function () {
			expect(scope.isDone()).to.be.true;
		});
	});

	describe("when url is long, request is converted to batch", function () {
		var scope;
		var url = 'test';
		while (url.length < 2001) {
			url += 'test';
		}
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
			RequestClient.makeRequest("GET", { collection: url }, "test", { webApiUrl: mocks.webApiUrl }, null, function (object) {
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
});

describe("RequestClient.sendRequest", function () {
    describe("removes additional properties set by DynamicsWebApi", function () {
        var scope;
        var url = 'test';
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl + 'test')
                .patch("", mocks.data.testEntityWithExpand)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            RequestClient.sendRequest('PATCH', url, { webApiUrl: mocks.webApiUrl }, mocks.data.testEntityAdditionalAttributesWithExpand, null, null, true, null, function (object) {
                var expectedO = {
                    status: mocks.responses.basicEmptyResponseSuccess.status,
                    headers: {},
                    data: undefined
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

    describe("request error", function () {
        var scope;
        var url = 'test';
        before(function () {
            scope = nock(mocks.webApiUrl + 'test')
                .post("", mocks.data.testEntity)
                .replyWithError({ code: 'Error' });
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            RequestClient.sendRequest('POST', url, { webApiUrl: mocks.webApiUrl }, mocks.data.testEntityAdditionalAttributes, null, null, true, null, function (object) {
                expect(object).to.be.undefined;
                done(object);
            }, function (object) {
                expect(object).to.be.deep.equal({ code: "Error" });
                done();
            });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("timeout - socket", function () {
        var scope;
        var url = 'test';
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl + 'test')
                .post("", mocks.data.testEntity)
                .socketDelay(1000)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            RequestClient.sendRequest('POST', url, { webApiUrl: mocks.webApiUrl }, mocks.data.testEntityAdditionalAttributes, null, null, true, 500, function (object) {
                expect(object).to.be.undefined;
                done(object);
            }, function (error) {
                expect(error.message).to.be.eq("socket hang up");
                expect(error.code).to.be.eq("ECONNRESET");
                done();
            });
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("timeout - connection delay", function () {
        var scope;
        var url = 'test';
        before(function () {
            var response = mocks.responses.basicEmptyResponseSuccess;
            scope = nock(mocks.webApiUrl + 'test')
                .post("", mocks.data.testEntity)
                .delayConnection(1000)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            nock.cleanAll();
        });

        it("returns a correct response", function (done) {
            RequestClient.sendRequest('POST', url, { webApiUrl: mocks.webApiUrl }, mocks.data.testEntityAdditionalAttributes, null, null, true, 500, function (object) {
                expect(object).to.be.undefined;
                done(object);
            }, function (error) {
                expect(error.message).to.be.eq("socket hang up");
                expect(error.code).to.be.eq("ECONNRESET");
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
        var response = parseResponse(mocks.responses.responseFormatted200.responseText, [], [{}]);
        expect(response).to.be.deep.equal(mocks.responses.responseFormattedEntity());
	});

	it("parses formatted values with expand formatted values", function () {
		var response = parseResponse(mocks.responses.responseFormattedWithExpand200.responseText, [], [{}]);
		expect(response).to.be.deep.equal(mocks.responses.responseFormattedEntityWithExpand());
	});

    it("parses formatted values - array", function () {
        var response = parseResponse(mocks.responses.multipleFormattedResponse.responseText, [], [{}]);
        expect(response).to.be.deep.equal(mocks.responses.multipleFormatted());
    });

    it("parses formatted and aliased values", function () {
        var response = parseResponse(mocks.responses.responseFormattedAliased200.responseText, [], [{}]);
        expect(response).to.be.deep.equal(mocks.responses.responseFormattedAliasedEntity());
    });

    it("when alias are not unique throws error", function () {
        expect(function () {
            parseResponse(mocks.responses.responseFormattedAliasedNotUnique200.responseText, [], [{}]);
        }).to.throw("The alias name of the linked entity must be unique!");
    });
});