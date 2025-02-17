import { expect } from "chai";

import nock, { cleanAll } from "nock";

import { DWA } from "../src/dwa";
import * as Utility from "../src/utils/Utility";
import { composeUrl, compose, composeHeaders } from "../src/utils/Request";
import { ErrorHelper } from "../src/helpers/ErrorHelper";
import { data as _data, webApiUrl, responses } from "./stubs";
import { dateReviver } from "../src/client/helpers/dateReviver";
import * as RequestClient from "../src/client/RequestClient";
import { parseResponse } from "../src/client/helpers/parseResponse";
import { InternalRequest } from "../src/types";
import { InternalConfig } from "../src/utils/Config";

describe("Utility.", function () {
    describe("buildFunctionParameters - ", function () {
        it("no parameters", function () {
            const result = Utility.buildFunctionParameters();
            expect(result).to.deep.equal({ key: "()" });
        });
        it("1 parameter == null", function () {
            const result = Utility.buildFunctionParameters({ param1: null });
            expect(result).to.deep.equal({ key: "()", queryParams: [] });
        });
        it("1 parameter", function () {
            const result = Utility.buildFunctionParameters({ param1: "value1" });
            expect(result).to.deep.equal({ key: "(param1=@p1)", queryParams: ["@p1='value1'"] });
        });
        it("2 parameters", function () {
            const result = Utility.buildFunctionParameters({ param1: "value1", param2: 2 });
            expect(result).to.deep.equal({ key: "(param1=@p1,param2=@p2)", queryParams: ["@p1='value1'", "@p2=2"] });
        });
        it("3 parameters", function () {
            const result = Utility.buildFunctionParameters({ param1: "value1", param2: 2, param3: "value2" });
            expect(result).to.deep.equal({ key: "(param1=@p1,param2=@p2,param3=@p3)", queryParams: ["@p1='value1'", "@p2=2", "@p3='value2'"] });
        });
        it("object parameter", function () {
            const result = Utility.buildFunctionParameters({ param1: { test1: "value", "@odata.type": "account" } });
            expect(result).to.deep.equal({ key: "(param1=@p1)", queryParams: ['@p1={"test1":"value","@odata.type":"account"}'] });
        });
        it("Microsoft.Dynamics.CRM namespace parameter", function () {
            const result = Utility.buildFunctionParameters({ param1: "Microsoft.Dynamics.CRM.Enum'Type'", param2: 2, param3: "value2" });
            expect(result).to.deep.equal({
                key: "(param1=@p1,param2=@p2,param3=@p3)",
                queryParams: ["@p1=Microsoft.Dynamics.CRM.Enum'Type'", "@p2=2", "@p3='value2'"],
            });
        });
        it("Guid parameter", function () {
            const result = Utility.buildFunctionParameters({
                param1: "Microsoft.Dynamics.CRM.Enum'Type'",
                param2: 2,
                param3: "value2",
                param4: "fb15ee32-524d-41be-b6a0-7d0f28055d52",
            });
            expect(result).to.deep.equal({
                key: "(param1=@p1,param2=@p2,param3=@p3,param4=@p4)",
                queryParams: ["@p1=Microsoft.Dynamics.CRM.Enum'Type'", "@p2=2", "@p3='value2'", "@p4=fb15ee32-524d-41be-b6a0-7d0f28055d52"],
            });
        });
    });

    describe("getFetchXmlPagingCookie - ", function () {
        it("pagingCookie is empty", function () {
            var result = Utility.getFetchXmlPagingCookie("", 2);
            expect(result).to.deep.equal({
                cookie: "",
                page: 2,
                nextPage: 3,
            });
        });

        it("pagingCookie is null or undefined", function () {
            var result = Utility.getFetchXmlPagingCookie(undefined, 2);
            expect(result).to.deep.equal({
                cookie: "",
                page: 2,
                nextPage: 3,
            });

            result = Utility.getFetchXmlPagingCookie();
            expect(result).to.deep.equal({
                cookie: "",
                page: 1,
                nextPage: 2,
            });
        });

        it("pagingCookie is normal", function () {
            var result = Utility.getFetchXmlPagingCookie(_data.fetchXmls.cookiePage2, 2);
            expect(result).to.deep.equal(_data.fetchXmls.fetchXmlResultPage2Cookie.PagingInfo);

            result = Utility.getFetchXmlPagingCookie(_data.fetchXmls.cookiePage1, 2);
            expect(result).to.deep.equal(_data.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo);

            result = Utility.getFetchXmlPagingCookie(_data.fetchXmls.cookiePage2);
            expect(result).to.deep.equal(_data.fetchXmls.fetchXmlResultPage2Cookie.PagingInfo);
        });
    });

    describe("getXrmContext - GetGlobalContext", function () {
        before(function () {
            // @ts-ignore
            global.GetGlobalContext = function () {
                return "Global Context";
            };
        });

        after(function () {
            // @ts-ignore
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
                // @ts-ignore
                getGlobalContext: function () {
                    return {
                        getClientUrl: function () {
                            return "Xrm.Utility";
                        },
                    };
                },
            };
        });

        after(function () {
            // @ts-ignore
            global.Xrm.Utility = undefined;
        });

        it("returns a correct object", function () {
            var result = Utility.getXrmContext().getClientUrl();

            expect(result).to.be.eq("Xrm.Utility");
        });
    });

    describe("getXrmContext - Form context does not exist", function () {
        before(function () {
            // @ts-ignore
            global.Xrm = undefined;
        });

        after(function () {
            global.Xrm = {
                Page: {
                    // @ts-ignore
                    context: {
                        getClientUrl: function () {
                            return "http://testorg.crm.dynamics.com";
                        },
                    },
                },
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
            // @ts-ignore
            global.Xrm.Page = undefined;
        });

        after(function () {
            global.Xrm.Page = {
                // @ts-ignore
                context: {
                    getClientUrl: function () {
                        return "http://testorg.crm.dynamics.com";
                    },
                },
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
            // @ts-ignore
            global.Xrm.Page.context = null;
        });

        after(function () {
            // @ts-ignore
            global.Xrm.Page.context = {
                getClientUrl: function () {
                    return "http://testorg.crm.dynamics.com";
                },
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
    var stubUrl = webApiUrl + "tests";
    it("request is empty", function () {
        var dwaRequest = {
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl, "&");
        expect(result).to.equal(stubUrl);

        result = composeUrl(null, null, stubUrl, "&");
        expect(result).to.equal(stubUrl);

        result = composeUrl({}, null, stubUrl, "&");
        expect(result).to.equal(stubUrl);
    });

    it("count=true", function () {
        var dwaRequest = {
            count: true,
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$count=true`);
    });

    it("count=false", function () {
        var dwaRequest = {
            count: false,
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("expand is empty", function () {
        let dwaRequest: InternalRequest = {
            expand: undefined,
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            expand: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            expand: [],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("expand - filter without expand.property", function () {
        let dwaRequest: InternalRequest = {
            expand: [
                {
                    filter: "name eq 'name'",
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            expand: [
                {
                    filter: "name eq 'name'",
                    //@ts-ignore - testing if it works even with null
                    property: null,
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("expand - is a string", function () {
        let dwaRequest: InternalRequest = {
            expand: "string",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=string`);
    });

    it("expand - property", function () {
        var dwaRequest = {
            expand: [
                {
                    property: "property",
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,filter empty", function () {
        let dwaRequest: InternalRequest = {
            expand: [
                {
                    property: "property",
                    filter: "",
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [
                {
                    property: "property",
                    //@ts-ignore - testing if it works even with null
                    filter: null,
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,filter", function () {
        var dwaRequest = {
            expand: [
                {
                    property: "property",
                    filter: "name eq 'name'",
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($filter=${encodeURIComponent("name eq 'name'")})`);
    });

    it("expand - property,orderBy empty", function () {
        var dwaRequest = {
            expand: [
                {
                    property: "property",
                    orderBy: [],
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [
                {
                    property: "property",
                    //@ts-ignore - testing if it works even with null
                    orderBy: null,
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,orderBy", function () {
        var dwaRequest = {
            expand: [
                {
                    property: "property",
                    orderBy: ["name"],
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($orderby=name)`);

        dwaRequest = {
            expand: [
                {
                    property: "property",
                    orderBy: ["name", "subject"],
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($orderby=name,subject)`);
    });

    it("expand - property,select empty", function () {
        var dwaRequest = {
            expand: [
                {
                    property: "property",
                    select: [],
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [
                {
                    property: "property",
                    //@ts-ignore - testing if it works even with null
                    select: null,
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,select", function () {
        var dwaRequest = {
            expand: [
                {
                    property: "property",
                    select: ["name"],
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($select=name)`);

        dwaRequest = {
            expand: [
                {
                    property: "property",
                    select: ["name", "subject"],
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($select=name,subject)`);
    });

    it("expand - property,top empty or <=0", function () {
        var dwaRequest = {
            expand: [
                {
                    property: "property",
                    top: 0,
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [
                {
                    property: "property",
                    top: -1,
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);

        dwaRequest = {
            expand: [
                {
                    property: "property",
                    //@ts-ignore - testing if it works even with null
                    top: null,
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property`);
    });

    it("expand - property,top", function () {
        var dwaRequest = {
            expand: [
                {
                    property: "property",
                    top: 3,
                },
            ],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($top=3)`);
    });

    it("expand - different properties", function () {
        let dwaRequest: InternalRequest = {
            expand: [
                {
                    property: "property",
                    select: ["name", "subject"],
                    top: 3,
                },
            ],
            functionName: "",
        };

        let result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($select=name,subject;$top=3)`);

        dwaRequest = {
            expand: [
                {
                    property: "property",
                    select: ["name", "subject"],
                    orderBy: ["order"],
                    top: 3,
                },
            ],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$expand=property($select=name,subject;$top=3;$orderby=order)`);
    });

    it("filter empty", function () {
        var dwaRequest = {
            filter: "",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            filter: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("filter", function () {
        var dwaRequest = {
            filter: "name eq 'name'",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$filter=${encodeURIComponent("name eq 'name'")}`);
    });

    it("filter - special symbols encoded", function () {
        var dwaRequest = {
            filter: "email eq 'test+email@example.com'",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$filter=${encodeURIComponent("email eq 'test+email@example.com'")}`);
    });

    it("filter - remove brackets from guid", function () {
        var dwaRequest = {
            filter: "name eq 'name' and testid1 eq {0000a000-0000-0000-0000-000000000001} and testid2 eq 0000a000-0000-0000-0000-000000000002 and teststring eq '{0000a000-0000-0000-0000-000000000003}'",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(
            `${stubUrl}?$filter=${encodeURIComponent(
                "name eq 'name' and testid1 eq 0000a000-0000-0000-0000-000000000001 and testid2 eq 0000a000-0000-0000-0000-000000000002 and teststring eq '{0000a000-0000-0000-0000-000000000003}'",
            )}`,
        );
    });

    it("filter - remove brackets from guid; except for a guid inside the quotation marks", function () {
        var dwaRequest = {
            filter: "name eq 'name' and testid1 eq {0000a000-0000-0000-0000-000000000001} and testid2 eq 0000a000-0000-0000-0000-000000000002 and teststring eq 'here is some text {0000a000-0000-0000-0000-000000000003}'",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(
            `${stubUrl}?$filter=${encodeURIComponent(
                "name eq 'name' and testid1 eq 0000a000-0000-0000-0000-000000000001 and testid2 eq 0000a000-0000-0000-0000-000000000002 and teststring eq 'here is some text {0000a000-0000-0000-0000-000000000003}'",
            )}`,
        );
    });

    //test bug 2018-06-11
    it("filter - grouping & remove brackets from guid ", function () {
        var dwaRequest = {
            filter: "name eq 'name' and (testid1 eq {0000a000-0000-0000-0000-000000000001} or testid2 eq {0000a000-0000-0000-0000-000000000002})",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(
            `${stubUrl}?$filter=${encodeURIComponent(
                "name eq 'name' and (testid1 eq 0000a000-0000-0000-0000-000000000001 or testid2 eq 0000a000-0000-0000-0000-000000000002)",
            )}`,
        );
    });

    //test bug 2018-06-11
    it("filter - grouping & remove brackets from a single guid", function () {
        var dwaRequest = {
            filter: "name eq 'name' and (testid1 eq {0000a000-0000-0000-0000-000000000001})",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(`${stubUrl}?$filter=${encodeURIComponent("name eq 'name' and (testid1 eq 0000a000-0000-0000-0000-000000000001)")}`);
    });

    it("ifmatch empty", function () {
        let dwaRequest: InternalRequest = {
            ifmatch: "",
            functionName: "",
        };

        let result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            ifmatch: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("navigationProperty empty", function () {
        let dwaRequest: InternalRequest = {
            navigationProperty: "",
            functionName: "",
        };

        let result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            navigationProperty: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("navigationProperty", function () {
        var dwaRequest = {
            navigationProperty: "nav",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "/nav");
    });

    //todo: delete in the future
    it("fieldName", function () {
        const dwaRequest = {
            fieldName: "property",
            functionName: "",
        };

        const result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "/property");
    });

    it("property", function () {
        const dwaRequest = {
            property: "property",
            functionName: "",
        };

        const result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "/property");
    });

    it("fieldName must be replaced by property", function () {
        const dwaRequest = {
            property: "property",
            fieldName: "fieldName",
            functionName: "",
        };

        const result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "/property");
    });

    it("orderBy empty", function () {
        let dwaRequest: InternalRequest = {
            orderBy: [],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            orderBy: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("orderBy", function () {
        var dwaRequest = {
            orderBy: ["name"],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "?$orderby=name");

        dwaRequest = {
            orderBy: ["name", "subject"],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "?$orderby=name,subject");
    });

    it("select empty", function () {
        let dwaRequest: InternalRequest = {
            select: [],
            functionName: "",
        };

        let result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            select: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl);
    });

    it("select", function () {
        var dwaRequest = {
            select: ["name"],
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "?$select=name");

        dwaRequest = {
            select: ["name", "subject"],
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "?$select=name,subject");
    });

    it("select navigation property", function () {
        var dwaRequest = {
            select: ["/nav"],
            functionName: "retrieve",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.equal(stubUrl + "/nav");

        dwaRequest = {
            select: ["/nav", "subject"],
            functionName: "retrieve",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "/nav?$select=subject");

        dwaRequest = {
            select: ["/nav", "subject", "fullname"],
            functionName: "retrieve",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "/nav?$select=subject,fullname");
    });

    it("select reference", function () {
        var dwaRequest = {
            select: ["nav/$ref"],
            functionName: "retrieve",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "/nav/$ref");
    });

    it("top empty or <=0", function () {
        let dwaRequest: InternalRequest = {
            top: 0,
            functionName: "",
        };

        let result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);

        dwaRequest = {
            top: -1,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            top: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);
    });

    it("top", function () {
        let dwaRequest = {
            top: 3,
            functionName: "",
        };

        let result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?$top=3");
    });

    it("savedQuery empty", function () {
        let dwaRequest: InternalRequest = {
            savedQuery: "",
            functionName: "",
        };

        let result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            savedQuery: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);
    });

    it("savedQuery", function () {
        var dwaRequest = {
            savedQuery: _data.testEntityId,
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?savedQuery=" + _data.testEntityId);
    });

    it("userQuery empty", function () {
        let dwaRequest: InternalRequest = {
            userQuery: "",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            userQuery: null,
            functionName: "",
        };

        result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl);
    });

    it("userQuery", function () {
        var dwaRequest = {
            userQuery: _data.testEntityId,
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?userQuery=" + _data.testEntityId);
    });

    it("partitionId", function () {
        var dwaRequest = {
            partitionId: "partition1",
            functionName: "",
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?partitionid='partition1'");
    });

    it("queryParams", function () {
        var dwaRequest = {
            filter: "something eq 2",
            queryParams: ["p1=bla", "@p2=[22,23]"],
        };

        var result = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?$filter=" + encodeURIComponent("something eq 2") + "&p1=bla&@p2=[22,23]");
    });

    it("multiple options", function () {
        let dwaRequest: InternalRequest = {
            select: ["name", "subject"],
            orderBy: ["order"],
            top: 5,
            functionName: "",
        };

        let result: InternalRequest | string = composeUrl(dwaRequest, null, stubUrl);
        expect(result).to.deep.equal(stubUrl + "?$select=name,subject&$top=5&$orderby=order");

        dwaRequest.expand = [
            {
                property: "property",
                select: ["name"],
                orderBy: ["order"],
            },
            {
                property: "property2",
                select: ["name3"],
            },
        ];

        result = composeUrl(dwaRequest, null, stubUrl);

        expect(result).to.deep.equal(
            stubUrl + "?$select=name,subject&$top=5&$orderby=order&$expand=property($select=name;$orderby=order),property2($select=name3)",
        );

        //todo: move to compose
        dwaRequest.collection = "tests";
        dwaRequest.expand = null;
        dwaRequest.returnRepresentation = true;

        //@ts-ignore - testing if it works even with null
        result = compose(dwaRequest, {});

        var expectedObject = Utility.copyObject(dwaRequest);
        expectedObject.path = "tests?$select=name,subject&$top=5&$orderby=order";
        expectedObject.headers = { Prefer: DWA.Prefer.ReturnRepresentation };
        expectedObject.async = true;

        expect(result).to.deep.equal(expectedObject);

        dwaRequest.top = 0;
        dwaRequest.count = true;
        dwaRequest.impersonate = _data.testEntityId;

        //@ts-ignore - testing if it works even with null
        result = compose(dwaRequest, {});

        expectedObject = Utility.copyObject(dwaRequest);
        expectedObject.path = "tests?$select=name,subject&$count=true&$orderby=order";
        expectedObject.headers = { Prefer: DWA.Prefer.ReturnRepresentation, MSCRMCallerID: _data.testEntityId };
        expectedObject.async = true;

        expect(result).to.deep.equal(expectedObject);

        //@ts-ignore - testing if it works even with null
        dwaRequest.impersonate = null;
        dwaRequest.navigationProperty = "nav";

        //@ts-ignore - testing if it works with an incomplete object
        result = compose(dwaRequest, {});

        expectedObject = Utility.copyObject(dwaRequest);
        expectedObject.path = "tests/nav?$select=name,subject&$count=true&$orderby=order";
        expectedObject.headers = { Prefer: DWA.Prefer.ReturnRepresentation };
        expectedObject.async = true;

        expect(result).to.deep.equal(expectedObject);

        //@ts-ignore - testing if it works even with null
        dwaRequest.navigationProperty = null;
        dwaRequest.returnRepresentation = false;
        dwaRequest.includeAnnotations = DWA.Prefer.Annotations.All;
        dwaRequest.select![0] = "/nav";
        dwaRequest.functionName = "retrieve";

        //@ts-ignore - testing if it works even with null
        result = compose(dwaRequest, {});

        expectedObject = Utility.copyObject(dwaRequest);
        expectedObject.path = "tests/nav?$select=subject&$count=true&$orderby=order";
        expectedObject.headers = { Prefer: 'odata.include-annotations="*"' };
        expectedObject.async = true;

        expect(result).to.deep.equal(expectedObject);
    });
});

describe("RequestUtility.composeHeaders -", function () {
    it("mergeLabels=true", function () {
        var dwaRequest = {
            mergeLabels: true,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ "MSCRM.MergeLabels": "true" });
    });

    it("mergeLabels=false", function () {
        var dwaRequest = {
            mergeLabels: false,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("ifmatch", function () {
        var dwaRequest = {
            ifmatch: "*",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ "If-Match": "*" });
    });

    it("ifnonematch empty", function () {
        let dwaRequest: InternalRequest = {
            ifnonematch: "",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            ifnonematch: null,
            functionName: "",
        };

        result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("ifnonematch", function () {
        var dwaRequest = {
            ifnonematch: "*",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ "If-None-Match": "*" });
    });

    it("ifmatch & ifnonematch both specified - throws an error", function () {
        var dwaRequest = {
            ifmatch: "*",
            ifnonematch: "*",
            functionName: "fun",
        };

        expect(function () {
            composeHeaders(dwaRequest, {});
        }).to.throw("DynamicsWebApi.fun. Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.");
    });

    it("impersonate empty", function () {
        let dwaRequest: InternalRequest = {
            impersonate: "",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            impersonate: null,
            functionName: "",
        };

        result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("impersonate", function () {
        var dwaRequest = {
            impersonate: _data.testEntityId,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ MSCRMCallerID: _data.testEntityId });
    });

    it("impersonateAAD empty", function () {
        let dwaRequest: InternalRequest = {
            impersonateAAD: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});

        dwaRequest = {
            //@ts-ignore - testing if it works even with null
            impersonateAAD: null,
        };

        result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("impersonateAAD", function () {
        var dwaRequest = {
            impersonateAAD: _data.testEntityId,
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ CallerObjectId: _data.testEntityId });
    });

    it("includeAnnotations empty", function () {
        let dwaRequest: InternalRequest = {
            includeAnnotations: "",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});

        dwaRequest = {
            includeAnnotations: null,
            functionName: "",
        };

        result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("includeAnnotations", function () {
        var dwaRequest = {
            includeAnnotations: DWA.Prefer.Annotations.AssociatedNavigationProperty,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"' });
    });

    it("maxPageSize empty or <=0", function () {
        let dwaRequest: InternalRequest = {
            maxPageSize: 0,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});

        dwaRequest = {
            maxPageSize: null,
            functionName: "",
        };

        result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});

        dwaRequest = {
            maxPageSize: -2,
            functionName: "",
        };

        result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("maxPageSize", function () {
        var dwaRequest = {
            maxPageSize: 10,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: "odata.maxpagesize=10" });
    });

    it("continueOnError", function () {
        var dwaRequest = {
            continueOnError: true,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: "odata.continue-on-error" });
    });

    it("returnRepresentation empty", function () {
        var dwaRequest = {
            returnRepresentation: false,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("returnRepresentation null", function () {
        var dwaRequest = {
            returnRepresentation: null,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("returnRepresentation", function () {
        var dwaRequest = {
            returnRepresentation: true,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation });
    });

    it("duplicateDetection empty", function () {
        var dwaRequest = {
            duplicateDetection: false,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("duplicateDetection null", function () {
        let dwaRequest: InternalRequest = {
            //@ts-ignore - testing if it works even with null
            duplicateDetection: null,
            functionName: "",
        };

        let result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("duplicateDetection", function () {
        var dwaRequest = {
            duplicateDetection: true,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ "MSCRM.SuppressDuplicateDetection": "false" });
    });

    it("bypassCustomPluginExecution empty", function () {
        var dwaRequest = {
            bypassCustomPluginExecution: false,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("bypassCustomPluginExecution null", function () {
        let dwaRequest: InternalRequest = {
            bypassCustomPluginExecution: null,
            functionName: "",
        };

        let result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({});
    });

    it("bypassCustomPluginExecution true", function () {
        var dwaRequest = {
            bypassCustomPluginExecution: true,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ "MSCRM.BypassCustomPluginExecution": "true" });
    });

    it("includeAnnotations & returnRepresentation", function () {
        var dwaRequest = {
            returnRepresentation: true,
            includeAnnotations: DWA.Prefer.Annotations.AssociatedNavigationProperty,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({
            Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"',
        });
    });

    it("includeAnnotations & returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            returnRepresentation: true,
            includeAnnotations: "*",
            maxPageSize: 20,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("includeAnnotations & returnRepresentation & maxPageSize & continueOnError", function () {
        var dwaRequest = {
            returnRepresentation: true,
            includeAnnotations: "*",
            maxPageSize: 20,
            continueOnError: true,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({
            Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20,odata.continue-on-error',
        });
    });

    it("includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            includeAnnotations: "*",
            maxPageSize: 20,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            returnRepresentation: true,
            maxPageSize: 20,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ",odata.maxpagesize=20" });
    });

    it("prefer - return=representation", function () {
        var dwaRequest = {
            prefer: "return=representation",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation });
    });

    it("prefer - odata.include-annotations", function () {
        var dwaRequest = {
            prefer: "odata.include-annotations=*",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="*"' });
    });

    it("prefer - maxPageSize", function () {
        var dwaRequest = {
            prefer: "odata.maxpagesize=20",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: "odata.maxpagesize=20" });
    });

    it("prefer - includeAnnotations & returnRepresentation", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"',
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({
            Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"',
        });
    });

    it("prefer - includeAnnotations & returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="*",odata.maxpagesize=20',
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("prefer - includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            prefer: "odata.include-annotations=*,odata.maxpagesize=20",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("prefer - SPACE - includeAnnotations & maxPageSize", function () {
        var dwaRequest = {
            prefer: "odata.include-annotations=*, odata.maxpagesize=20",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="*",odata.maxpagesize=20' });
    });

    it("prefer - returnRepresentation & maxPageSize", function () {
        var dwaRequest = {
            prefer: "return=representation,odata.maxpagesize=20",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ",odata.maxpagesize=20" });
    });

    it("prefer - trackChanges & maxPageSize", function () {
        var dwaRequest = {
            prefer: "odata.track-changes,odata.maxpagesize=20",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: "odata.maxpagesize=20,odata.track-changes" });
    });

    it("prefer - trackChanges & includeAnnotations", function () {
        var dwaRequest = {
            prefer: 'odata.track-changes,odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"',
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '",odata.track-changes' });
    });

    it("prefer - odata.continue-on-error", function () {
        var dwaRequest = {
            prefer: "odata.continue-on-error",
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: "odata.continue-on-error" });
    });

    it("prefer - includeAnnotations & returnRepresentation & maxPageSize & trackChanges", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="*",odata.track-changes,odata.maxpagesize=20',
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20,odata.track-changes' });
    });

    it("prefer - includeAnnotations & returnRepresentation & maxPageSize & trackChanges & continueOnError", function () {
        var dwaRequest = {
            prefer: 'return=representation,odata.include-annotations="*",odata.track-changes,odata.maxpagesize=20,odata.continue-on-error',
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, {});
        expect(result).to.deep.equal({
            Prefer: DWA.Prefer.ReturnRepresentation + ',odata.include-annotations="*",odata.maxpagesize=20,odata.track-changes,odata.continue-on-error',
        });
    });

    it("returnRepresentation: false & config.returnRepresentation: true", function () {
        var config = {
            returnRepresentation: true,
        };

        var dwaRequest = {
            returnRepresentation: false,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, config);
        expect(result).to.deep.equal({});
    });

    it("returnRepresentation: true & config.returnRepresentation: false", function () {
        var config = {
            returnRepresentation: false,
        };

        var dwaRequest = {
            returnRepresentation: true,
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, config);
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation });
    });

    it("config.returnRepresentation: true", function () {
        var config = {
            returnRepresentation: true,
        };

        var dwaRequest = {
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, config);
        expect(result).to.deep.equal({ Prefer: DWA.Prefer.ReturnRepresentation });
    });

    it("config.returnRepresentation: false", function () {
        var config = {
            returnRepresentation: false,
        };

        var dwaRequest = {
            functionName: "",
        };

        var result = composeHeaders(dwaRequest, config);
        expect(result).to.deep.equal({});
    });
});

describe("RequestUtility.compose -", function () {
    //{ url: result.url, headers: result.headers }
    it("collection", function () {
        var dwaRequest = {
            collection: "cols",
        };

        var result = compose(dwaRequest, {});

        let expected = Utility.copyObject(dwaRequest);
        expected.path = "cols";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);
    });

    it("collection - to lower case", function () {
        var dwaRequest = {
            collection: "Cols",
        };

        var result = compose(dwaRequest, {});

        let expected = Utility.copyObject(dwaRequest);
        expected.path = "Cols";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);
    });

    it("collection - to lower case exception", function () {
        var dwaRequest = {
            collection: "EntityDefinitions",
        };

        var result = compose(dwaRequest, {});

        let expected = Utility.copyObject(dwaRequest);
        expected.path = "EntityDefinitions";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);
    });

    it("collection empty - throw error", function () {
        let dwaRequest: InternalRequest = {
            collection: "",
        };

        let test = function () {
            compose(dwaRequest, {});
        };

        expect(test).to.throw(/request\.collection/);

        //@ts-ignore - testing if a wrong parameter type throws an error
        dwaRequest.collection = 0;
        expect(test).to.throw(/request\.collection/);

        dwaRequest.collection = null;
        expect(test).to.throw(/request\.collection/);
    });

    it("collection, key empty", function () {
        let dwaRequest: InternalRequest = {
            collection: "cols",
            //@ts-ignore - testing if it works even with null
            key: null,
        };

        var result = compose(dwaRequest, {});

        let expected = Utility.copyObject(dwaRequest);
        expected.path = "cols";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);

        dwaRequest.key = "";

        result = compose(dwaRequest, {});

        expected = Utility.copyObject(dwaRequest);
        expected.path = "cols";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);
    });

    it("collection, key - wrong format throw error", function () {
        var dwaRequest = {
            collection: "cols",
            key: "sa",
        };

        var test = function () {
            compose(dwaRequest, {});
        };

        expect(test).to.throw(/request\.key/);
    });

    it("collection, key", function () {
        var dwaRequest = {
            collection: "cols",
            key: _data.testEntityId,
        };

        var result = compose(dwaRequest, {});

        let expected = Utility.copyObject(dwaRequest);
        expected.path = "cols(" + _data.testEntityId + ")";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);
    });

    it("collection, key in brackets {} converted to id without brackets", function () {
        var dwaRequest = {
            collection: "cols",
            key: "{" + _data.testEntityId + "}",
        };

        var result = compose(dwaRequest, {});

        let expected = Utility.copyObject(dwaRequest);
        expected.path = "cols(" + _data.testEntityId + ")";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);
    });

    it("full", function () {
        let dwaRequest: InternalRequest = {
            collection: "cols",
            key: _data.testEntityId,
            select: ["name"],
            returnRepresentation: true,
        };

        var result = compose(dwaRequest, {});

        let expected = Utility.copyObject(dwaRequest);
        expected.path = "cols(" + _data.testEntityId + ")?$select=name";
        expected.headers = { Prefer: DWA.Prefer.ReturnRepresentation };
        expected.async = true;

        expect(result).to.deep.equal(expected);

        dwaRequest.navigationProperty = "nav";

        result = compose(dwaRequest, {});

        expected = Utility.copyObject(dwaRequest);
        expected.path = "cols(" + _data.testEntityId + ")/nav?$select=name";
        expected.headers = { Prefer: DWA.Prefer.ReturnRepresentation };
        expected.async = true;

        expect(result).to.deep.equal(expected);
    });

    it("async", function () {
        let dwaRequest: InternalRequest = {
            collection: "cols",
            async: false,
        };

        var result = compose(dwaRequest, {});

        let expected = Utility.copyObject(dwaRequest);
        expected.path = "cols";
        expected.headers = {};
        expected.async = false;

        expect(result).to.deep.equal(expected);

        dwaRequest.async = true;

        result = compose(dwaRequest, {});

        expected = Utility.copyObject(dwaRequest);
        expected.path = "cols";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);

        delete dwaRequest.async;

        result = compose(dwaRequest, {});

        expected = Utility.copyObject(dwaRequest);
        expected.path = "cols";
        expected.headers = {};
        expected.async = true;

        expect(result).to.deep.equal(expected);
    });

    it("async - throw error", function () {
        let dwaRequest: InternalRequest = {
            collection: "some",
            //@ts-ignore - testing if the wrong parameter type thrown an error
            async: "something",
        };

        var test = function () {
            compose(dwaRequest, {});
        };

        expect(test).to.throw(/request\.async/);
    });
});

describe("ErrorHelper.handleErrorResponse", function () {
    it("returns a correct error object", function () {
        var errorResponse = {
            status: 500,
            message: "Invalid",
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
        }).to.throw("fun requires a param parameter to be of type type");
    });
    it("throws Error with message without type", function () {
        expect(function () {
            ErrorHelper.parameterCheck(null, "fun", "param");
        }).to.throw("fun requires a param parameter");
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
        }).to.throw("fun requires a param parameter to be of type String");
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
        }).to.throw("fun requires a param parameter to be of type Array");
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
        }).to.throw("fun requires a param parameter to be of type String or Array");
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
        }).to.throw("fun requires a param parameter to be of type Number");
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
        }).to.throw("fun requires a param parameter to be of type Boolean");
    });
});

describe("ErrorHelper.callbackParameterCheck", function () {
    it("does not return anything", function () {
        //@ts-ignore
        var result = ErrorHelper.callbackParameterCheck(function () {}, "fun", "param");
        expect(result).to.be.undefined;
    });
    it("when parameter is wrong it throws an error", function () {
        expect(function () {
            //@ts-ignore testing a wrong parameter type
            ErrorHelper.callbackParameterCheck("a word", "fun", "param");
        }).to.throw("fun requires a param parameter to be of type Function");
    });
});

describe("ErrorHelper.maxLengthStringParameterCheck", function () {
    it("does not return anything if param is null", function () {
        var result = ErrorHelper.maxLengthStringParameterCheck(null, "fun", "param", 20);
        expect(result).to.be.undefined;
    });
    it("does not return anything", function () {
        var result = ErrorHelper.maxLengthStringParameterCheck("not long enough", "fun", "param", 20);
        expect(result).to.be.undefined;
    });
    it("when parameter is too long it throws an error", function () {
        expect(function () {
            ErrorHelper.maxLengthStringParameterCheck("tooo long", "fun", "param", 3);
        }).to.throw("param has a 3 character limit.");
    });
});

describe("ErrorHelper.throwBatchNotStarted", function () {
    it("false - throws an error", function () {
        expect(function () {
            ErrorHelper.throwBatchNotStarted(false);
        }).to.throw(
            "Batch operation has not been started. Please call a DynamicsWebApi.startBatch() function prior to calling DynamicsWebApi.executeBatch() to perform a batch request correctly.",
        );
    });
});

describe("ErrorHelper.guidParameterCheck", function () {
    it("parses guid in brackets and removes them", function () {
        var guid = "{00000000-0000-0000-0000-000000000001}";
        var result = ErrorHelper.guidParameterCheck(guid, "fun", "param");
        expect(result).to.eq("00000000-0000-0000-0000-000000000001");
    });

    it("throws an error", function () {
        expect(function () {
            ErrorHelper.guidParameterCheck("ds", "fun", "param");
        }).to.throw("fun requires a param parameter to be of type GUID String");
    });
});

describe("ErrorHelper.keyParameterCheck", function () {
    it("parses guid in brackets and removes them", function () {
        var guid = "{00000000-0000-0000-0000-000000000001}";
        var result = ErrorHelper.keyParameterCheck(guid, "fun", "param");
        expect(result).to.eq("00000000-0000-0000-0000-000000000001");
    });

    it("checks a correct alternate key", function () {
        var alternateKey = "altKey='value'";
        var result = ErrorHelper.keyParameterCheck(alternateKey, "fun", "param");
        expect(result).to.eq("altKey='value'");
    });

    it("checks correct alternate keys", function () {
        var alternateKey = "altKey='value',anotherKey='value2'";
        var result = ErrorHelper.keyParameterCheck(alternateKey, "fun", "param");
        expect(result).to.eq("altKey='value',anotherKey='value2'");
    });

    it("checks correct alternate keys (removes a space between them)", function () {
        var alternateKey = "altKey='value', anotherKey='value2'";
        var result = ErrorHelper.keyParameterCheck(alternateKey, "fun", "param");
        expect(result).to.eq("altKey='value',anotherKey='value2'");
    });

    it("checks correct alternate keys (replaces double quotes with single quotes)", function () {
        var alternateKey = 'altKey="value", anotherKey="value2"';
        var result = ErrorHelper.keyParameterCheck(alternateKey, "fun", "param");
        expect(result).to.eq("altKey='value',anotherKey='value2'");
    });

    it("checks correct alternate keys string and integer", function () {
        var alternateKey = "altKey=123456,anotherKey='value2'";
        var result = ErrorHelper.keyParameterCheck(alternateKey, "fun", "param");
        expect(result).to.eq("altKey=123456,anotherKey='value2'");
    });

    it("throws an error when alternate key is incorrect", function () {
        expect(function () {
            var alternateKey = "altKey=";
            ErrorHelper.keyParameterCheck(alternateKey, "fun", "param");
        }).to.throw("fun requires a param parameter to be of type String representing GUID or Alternate Key");
    });

    it("throws an error", function () {
        expect(function () {
            ErrorHelper.keyParameterCheck("ds", "fun", "param");
        }).to.throw("fun requires a param parameter to be of type String representing GUID or Alternate Key");
    });

    it("throws an error when the parameter is not a string", function () {
        expect(function () {
            ErrorHelper.keyParameterCheck([], "fun", "param");
        }).to.throw("fun requires a param parameter to be of type String representing GUID or Alternate Key");
    });
});

describe("dateReviver", function () {
    it("returns date when a string matches exact 'YYYY-MM-DDTHH:MM:SSZ' teamplate", function () {
        var result = dateReviver("any", "2016-12-22T23:22:12Z");
        expect(result).to.deep.equal(new Date("2016-12-22T23:22:12Z"));
    });

    it("returns the same value when a string does not match exact 'YYYY-MM-DDTHH:MM:SSZ' teamplate", function () {
        var result = dateReviver("any", "other");
        expect(result).to.equal("other");
    });

    it("returns the same value when its type is not String", function () {
        var result = dateReviver("any", 54);
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
//            .equal({ oDataContext: "", key: "", collection: "" });
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

describe("RequestClient.makeRequest", function () {
    before(() => {
        global.DWA_BROWSER = false;
    });
    describe("useEntityNames", function () {
        var scope;
        before(function () {
            var response = responses.response200;
            var response2 = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get("/EntityDefinitions?$select=EntitySetName,LogicalName")
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get("/tests(" + _data.testEntityId + ")")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            //{ webApiUrl: mocks.webApiUrl }
            let request: InternalRequest = {
                method: "GET",
                collection: "test",
                key: _data.testEntityId,
                functionName: "any",
            };
            let config: InternalConfig = {
                dataApi: { url: webApiUrl },
                searchApi: { url: webApiUrl },
                useEntityNames: true,
            };
            const object = await RequestClient.makeRequest(request, config);

            const expectedO = {
                status: 200,
                headers: _data.defaultResponseHeaders,
                data: _data.testEntity,
            };
            expect(object).to.deep.equal(expectedO);
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("useEntityNames - entity metadata requested only once", function () {
        var scope;
        before(function () {
            var response = responses.response200;
            var response2 = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get("/EntityDefinitions?$select=EntitySetName,LogicalName")
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get("/tests(" + _data.testEntityId + ")")
                .twice()
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            let request: InternalRequest = {
                method: "GET",
                collection: "test",
                key: _data.testEntityId,
                functionName: "any",
            };
            let config: InternalConfig = {
                dataApi: { url: webApiUrl },
                searchApi: { url: webApiUrl },
                useEntityNames: true,
            };

            const object = await RequestClient.makeRequest(request, config);

            var expectedO = {
                status: 200,
                headers: _data.defaultResponseHeaders,
                data: _data.testEntity,
            };
            expect(object).to.deep.equal(expectedO);

            let request2: InternalRequest = {
                method: "GET",
                collection: "test",
                key: _data.testEntityId,
                functionName: "any",
            };

            const object1 = await RequestClient.makeRequest(request2, config);

            var expectedO1 = {
                status: 200,
                headers: _data.defaultResponseHeaders,
                data: _data.testEntity,
            };
            expect(object1).to.deep.equal(expectedO1);
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("useEntityNames - request with collection name does not fail", function () {
        var scope;
        before(function () {
            var response = responses.response200;
            var response2 = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get("/EntityDefinitions?$select=EntitySetName,LogicalName")
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .get("/tests(" + _data.testEntityId + ")")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            let request: InternalRequest = {
                method: "GET",
                functionName: "any",
                collection: "tests",
                key: _data.testEntityId,
            };
            let config: InternalConfig = {
                dataApi: { url: webApiUrl },
                searchApi: { url: webApiUrl },
                useEntityNames: true,
            };
            const object = await RequestClient.makeRequest(request, config);

            var expectedO = {
                status: 200,
                headers: _data.defaultResponseHeaders,
                data: _data.testEntity,
            };
            expect(object).to.deep.equal(expectedO);
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("useEntityNames - $batch", function () {
        var scope;
        before(function () {
            var response = responses.response200;
            var response2 = responses.responseEntityDefinitions;
            scope = nock(webApiUrl)
                .get("/EntityDefinitions?$select=EntitySetName,LogicalName")
                .once()
                .reply(response2.status, response2.responseText, response2.responseHeaders)
                .post("/$batch(" + _data.testEntityId + ")")
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            //{ webApiUrl: mocks.webApiUrl }
            let request: InternalRequest = {
                method: "POST",
                functionName: "any",
                collection: "$batch",
                key: _data.testEntityId,
            };
            let config: InternalConfig = {
                dataApi: { url: webApiUrl },
                searchApi: { url: webApiUrl },
                useEntityNames: true,
            };
            const object = await RequestClient.makeRequest(request, config);

            var expectedO = {
                status: 200,
                headers: _data.defaultResponseHeaders,
                data: _data.testEntity,
            };
            expect(object).to.deep.equal(expectedO);
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("timeout - socket (request timeout)", function () {
        var scope;
        var url = "test";
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).post("/test", _data.testEntity).delay(1000).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            let request: InternalRequest = {
                method: "POST",
                functionName: "any",
                collection: url,
                timeout: 500,
                data: _data.testEntityAdditionalAttributes,
            };
            let config: InternalConfig = {
                dataApi: { url: webApiUrl },
                searchApi: { url: webApiUrl },
            };

            try {
                const object = await RequestClient.makeRequest(request, config);
                expect(object).to.be.undefined;
            } catch (error: any) {
                expect(error.message).to.be.eq("socket hang up");
                expect(error.code).to.be.eq("ECONNRESET");
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("timeout - socket (config)", async function () {
        var scope;
        var url = "test";
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).post("/test", _data.testEntity).delay(1000).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            let request: InternalRequest = {
                method: "POST",
                functionName: "any",
                collection: url,
                data: _data.testEntityAdditionalAttributes,
            };
            let config: InternalConfig = {
                timeout: 500,
                dataApi: { url: webApiUrl },
                searchApi: { url: webApiUrl },
            };
            try {
                const object = await RequestClient.makeRequest(request, config);
                expect(object).to.be.undefined;
            } catch (error: any) {
                expect(error.message).to.be.eq("socket hang up");
                expect(error.code).to.be.eq("ECONNRESET");
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("timeout - connection delay (request timeout)", function () {
        var scope;
        var url = "test";
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).post("/test", _data.testEntity).delay(1000).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            let request: InternalRequest = {
                method: "POST",
                functionName: "any",
                collection: url,
                timeout: 500,
                data: _data.testEntityAdditionalAttributes,
            };
            let config: InternalConfig = {
                dataApi: { url: webApiUrl },
                searchApi: { url: webApiUrl },
            };

            try {
                const object = await RequestClient.makeRequest(request, config);
                expect(object).to.be.undefined;
            } catch (error: any) {
                expect(error.message).to.be.eq("socket hang up");
                expect(error.code).to.be.eq("ECONNRESET");
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("timeout - connection delay (config)", function () {
        var scope;
        var url = "test";
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).post("/test", _data.testEntity).delay(1000).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            let request: InternalRequest = {
                method: "POST",
                functionName: "any",
                collection: url,
                data: _data.testEntityAdditionalAttributes,
            };
            let config: InternalConfig = {
                timeout: 500,
                dataApi: { url: webApiUrl },
                searchApi: { url: webApiUrl },
            };

            try {
                const object = await RequestClient.makeRequest(request, config);
                expect(object).to.be.undefined;
            } catch (error: any) {
                expect(error.message).to.be.eq("socket hang up");
                expect(error.code).to.be.eq("ECONNRESET");
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("when url is long, request is converted to batch", function () {
        var scope;
        var url = "test";
        while (url.length < 2001) {
            url += "test";
        }
        var rBody = _data.batch.replace("{0}", webApiUrl + url);
        var rBodys = rBody.split("\n");
        var checkBody = "";
        for (var i = 0; i < rBodys.length; i++) {
            checkBody += rBodys[i];
        }

        before(function () {
            var response = responses.batch;
            scope = nock(webApiUrl)
                .filteringRequestBody(function (body) {
                    body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "dwa_batch_XXX");
                    var bodys = body.split("\n");

                    var resultBody = "";
                    for (var i = 0; i < bodys.length; i++) {
                        resultBody += bodys[i];
                    }
                    return resultBody;
                })
                .post("/$batch", checkBody)
                .reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            let request: InternalRequest = {
                method: "GET",
                functionName: "test",
                collection: url,
            };
            const object = await RequestClient.makeRequest(request, { dataApi: { url: webApiUrl }, searchApi: { url: webApiUrl } });

            var multiple = responses.multiple();
            //delete multiple.oDataContext;
            var expectedO = {
                status: 200,
                headers: _data.defaultTextPlainResponseHeaders,
                data: multiple,
            };
            expect(object).to.deep.equal(expectedO);
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("RequestClient.sendRequest", function () {
    before(() => {
        global.DWA_BROWSER = false;
    });
    describe("removes additional properties set by DynamicsWebApi", function () {
        var scope;
        var url = "test";
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).patch("/test", _data.testEntityWithExpand).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            const object = await RequestClient.sendRequest(
                { method: "PATCH", path: url, data: _data.testEntityAdditionalAttributesWithExpand, async: true },
                { dataApi: { url: webApiUrl }, searchApi: { url: webApiUrl } },
            );
            var expectedO = {
                status: responses.basicEmptyResponseSuccess.status,
                headers: {},
                data: undefined,
            };
            expect(object).to.deep.equal(expectedO);
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    // describe("request error", function () {
    //     var scope;
    //     var url = "test";
    //     before(function () {
    //         scope = nock(webApiUrl).post("/test", _data.testEntity).replyWithError({ code: "Error" });
    //     });

    //     after(function () {
    //         cleanAll();
    //         RequestClient._clearTestData();
    //     });

    //     it("returns a correct response", async function () {
    //         try {
    //             const object = await RequestClient.sendRequest(
    //                 { method: "POST", path: url, data: _data.testEntityAdditionalAttributes, async: true },
    //                 { dataApi: { url: webApiUrl }, searchApi: { url: webApiUrl } },
    //             );
    //             expect(object).to.be.undefined;
    //         } catch (object) {
    //             expect(object).to.be.deep.equal({ code: "Error" });
    //         }
    //     });

    //     it("all requests have been made", function () {
    //         expect(scope.isDone()).to.be.true;
    //     });
    // });

    describe("timeout - socket", function () {
        var scope;
        var url = "test";
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).post("/test", _data.testEntity).delay(1000).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            try {
                const object = await RequestClient.sendRequest(
                    { method: "POST", path: url, data: _data.testEntityAdditionalAttributes, async: true, timeout: 500 },
                    { dataApi: { url: webApiUrl }, searchApi: { url: webApiUrl } },
                );
                expect(object).to.be.undefined;
            } catch (error: any) {
                expect(error.message).to.be.eq("socket hang up");
                expect(error.code).to.be.eq("ECONNRESET");
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });

    describe("timeout - connection delay", function () {
        var scope;
        var url = "test";
        before(function () {
            var response = responses.basicEmptyResponseSuccess;
            scope = nock(webApiUrl).post("/test", _data.testEntity).delay(1000).reply(response.status, response.responseText, response.responseHeaders);
        });

        after(function () {
            cleanAll();
            RequestClient._clearTestData();
        });

        it("returns a correct response", async function () {
            try {
                const object = await RequestClient.sendRequest(
                    { method: "POST", path: url, data: _data.testEntityAdditionalAttributes, async: true, timeout: 500 },
                    { dataApi: { url: webApiUrl }, searchApi: { url: webApiUrl } },
                );
                expect(object).to.be.undefined;
            } catch (error: any) {
                expect(error.message).to.be.eq("socket hang up");
                expect(error.code).to.be.eq("ECONNRESET");
            }
        });

        it("all requests have been made", function () {
            expect(scope.isDone()).to.be.true;
        });
    });
});

describe("empty batch payload", function () {
    after(function () {
        RequestClient._clearTestData();
    });

    it("throws an error", async function () {
        try {
            const object = await RequestClient.sendRequest(
                { method: "POST", path: "$batch", async: true },
                { dataApi: { url: webApiUrl }, searchApi: { url: webApiUrl } },
            );
            expect(object).to.be.undefined;
        } catch (object: any) {
            expect(object.length).to.be.eq(1);
            expect(object[0].message).to.equal(
                "Payload of the batch operation is empty. Please make that you have other operations in between startBatch() and executeBatch() to successfuly build a batch payload.",
            );
        }
    });
});

describe("parseResponse", function () {
    it("parses formatted values", function () {
        var response = parseResponse(responses.responseFormatted200.responseText, responses.responseFormatted200.responseHeaders, [{}]);
        expect(response).to.be.deep.equal(responses.responseFormattedEntity());
    });

    it("parses formatted values with expand formatted values", function () {
        var response = parseResponse(responses.responseFormattedWithExpand200.responseText, responses.responseFormattedWithExpand200.responseHeaders, [{}]);
        expect(response).to.be.deep.equal(responses.responseFormattedEntityWithExpand());
    });

    it("parses formatted values - array", function () {
        var response = parseResponse(responses.multipleFormattedResponse.responseText, responses.multipleFormattedResponse.responseHeaders, [{}]);
        expect(response).to.be.deep.equal(responses.multipleFormatted());
    });

    it("parses formatted and aliased values", function () {
        var response = parseResponse(responses.responseFormattedAliased200.responseText, responses.responseFormattedAliased200.responseHeaders, [{}]);
        expect(response).to.be.deep.equal(responses.responseFormattedAliasedEntity());
    });

    it("when alias are not unique throws error", function () {
        expect(function () {
            parseResponse(responses.responseFormattedAliasedNotUnique200.responseText, responses.responseFormattedAliasedNotUnique200.responseHeaders, [{}]);
        }).to.throw("The alias name of the linked entity must be unique!");
    });
});
