/// <reference path="../Scripts/DynamicsWebApi.js" />
/// <reference path="jasmine.js" />
/// <reference path="jasmine-ajax.js" />
/// <reference path="..\Scripts/Polyfills/yaku.browser.global.min.js" />

var Xrm = {
    Page: {
        context: {
            getClientUrl: function () {
                return "";
            }
        }
    }
}

var webApiUrl = "https://testorg.crm.dynamics.com/api/data/v8.2/";
var dynamicsWebApiTest = new DynamicsWebApi({ webApiUrl: webApiUrl });

var dataStubs = {
    testEntityId: "00000000-0000-0000-0000-000000000001",
    testEntityId2: "00000000-0000-0000-0000-000000000002",
    testEntityId3: "00000000-0000-0000-0000-000000000003",
    testEntity: {
        name: "record",
        subject: "test"
    },
    updatedEntity: {
        fullname: "test record"
    },
    updateSinglePropertyRequestEntity: {
        value: "test record"
    },
    referenceResponse: {
        "@odata.context": "context",
        "@odata.id": webApiUrl + "refs(00000000-0000-0000-0000-000000000002)"
    },
    referenceResponseConverted: {
        oDataContext: "context",
        id: "00000000-0000-0000-0000-000000000002",
        collection: "refs"
    },
    multipleWithCount: {
        "@odata.context": "context",
        "@odata.count": 2,
        value: [
            { name: "name1", subject: "subject1" },
            { name: "name2", subject: "subject2" }
        ]
    },
    fetchXmls: {
        cookiePage1: "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25221%2522%253E%253Caccountid%2520last%253D%2522%257BEF72AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257B475B158C-541C-E511-80D3-3863BB347BA8%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
        cookiePage2: "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25222%2522%253E%253Caccountid%2520last%253D%2522%257BF972AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257BF172AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
        fetchXml:
            "<fetch mapping='logical' count='5'>" +
                "<entity name='account'>" +
                    "<attribute name='accountid'/>" +
                    "<attribute name='name'/>" +
                "</entity>" +
            "</fetch>",
        fetchXml1:
            "<fetch mapping='logical' count='5' page='1'>" +
                "<entity name='account'>" +
                    "<attribute name='accountid'/>" +
                    "<attribute name='name'/>" +
                "</entity>" +
            "</fetch>",
        fetchXml2cookie:
            "<fetch mapping='logical' count='5' page='2' paging-cookie='&lt;cookie page=&quot;1&quot;&gt;&lt;accountid last=&quot;{EF72AE29-B3DE-E611-8102-5065F38A7BF1}&quot; first=&quot;{475B158C-541C-E511-80D3-3863BB347BA8}&quot; /&gt;&lt;/cookie&gt;'>" +
                "<entity name='account'>" +
                    "<attribute name='accountid'/>" +
                    "<attribute name='name'/>" +
                "</entity>" +
            "</fetch>",
        fetchXml2:
            "<fetch mapping='logical' count='5' page='2'>" +
                "<entity name='account'>" +
                    "<attribute name='accountid'/>" +
                    "<attribute name='name'/>" +
                "</entity>" +
            "</fetch>",
        fetchXmlResponsePage1Cookie: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie": "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25221%2522%253E%253Caccountid%2520last%253D%2522%257BEF72AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257B475B158C-541C-E511-80D3-3863BB347BA8%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" }
            ],
        },
        fetchXmlResponsePage2Cookie: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie": "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25222%2522%253E%253Caccountid%2520last%253D%2522%257BF972AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257BF172AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" }
            ],
        },
        fetchXmlResponsePage1: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie": "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%2522%2520istracking%253D%2522False%2522%2520/%253E",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" }
            ],
        },
        fetchXmlResultPage1Cookie: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie": "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25221%2522%253E%253Caccountid%2520last%253D%2522%257BEF72AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257B475B158C-541C-E511-80D3-3863BB347BA8%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
            oDataContext: "context",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" }
            ],
            PagingInfo: {
                cookie: "&lt;cookie page=&quot;1&quot;&gt;&lt;accountid last=&quot;{EF72AE29-B3DE-E611-8102-5065F38A7BF1}&quot; first=&quot;{475B158C-541C-E511-80D3-3863BB347BA8}&quot; /&gt;&lt;/cookie&gt;",
                page: 1,
                nextPage: 2
            }
        },
        fetchXmlResultPage2Cookie: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie": "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25222%2522%253E%253Caccountid%2520last%253D%2522%257BF972AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257BF172AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
            oDataContext: "context",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" }
            ],
            PagingInfo: {
                cookie: "&lt;cookie page=&quot;2&quot;&gt;&lt;accountid last=&quot;{F972AE29-B3DE-E611-8102-5065F38A7BF1}&quot; first=&quot;{F172AE29-B3DE-E611-8102-5065F38A7BF1}&quot; /&gt;&lt;/cookie&gt;",
                page: 2,
                nextPage: 3
            }
        },
        fetchXmlResultPage1: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie": "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%2522%2520istracking%253D%2522False%2522%2520/%253E",
            oDataContext: "context",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" }
            ],
            PagingInfo: {
                cookie: "",
                page: 1,
                nextPage: 2
            }
        }
    }
};

var responseStubs = {
    createEntityUrl: webApiUrl + "tests",
    createReturnId: {
        status: 204,
        responseHeaders: {
            "OData-EntityId": webApiUrl + "tests(" + dataStubs.testEntityId + ")"
        }
    },
    createReturnRepresentation: {
        status: 201,
        responseText: JSON.stringify(dataStubs.testEntity)
    },
    testEntityUrl: webApiUrl + "tests(" + dataStubs.testEntityId + ")",
    basicEmptyResponseSuccess: {
        status: 204
    },
    response200: {
        status: 200,
        responseText: JSON.stringify(dataStubs.testEntity)
    },
    retrieveReferenceResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.referenceResponse)
    },
    updateReturnRepresentation: {
        status: 200,
        responseText: JSON.stringify(dataStubs.updatedEntity)
    },
    countBasic: {
        status: 200,
        responseText: "20"
    },
    multipleWithCountResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multipleWithCount)
    },
    fetchXmlResponsePage1Cookie: {
        status: 200,
        responseText: JSON.stringify(dataStubs.fetchXmls.fetchXmlResponsePage1Cookie)
    },
    fetchXmlResponsePage2Cookie: {
        status: 200,
        responseText: JSON.stringify(dataStubs.fetchXmls.fetchXmlResponsePage2Cookie)
    },
    fetchXmlResponsePage1: {
        status: 200,
        responseText: JSON.stringify(dataStubs.fetchXmls.fetchXmlResponsePage1)
    }
};

describe("dynamicsWebApi.create -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.create(dataStubs.testEntity, "tests").then(function (id) {
                responseObject = id;
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.createReturnId);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.createEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('POST');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(dataStubs.testEntity);
            done();
        });

        it("does not have Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBe(dataStubs.testEntityId);
            done();
        });
    });

    describe("return representation", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.create(dataStubs.testEntity, "tests", DWA.Prefer.ReturnRepresentation).then(function (object) {
                responseObject = object;
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.createReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.createEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('POST');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(dataStubs.testEntity);
            done();
        });

        it("sends the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.testEntity);
            done();
        });
    });
});

describe("dynamicsWebApi.update -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.update(dataStubs.testEntityId, "tests", dataStubs.testEntity)
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.basicEmptyResponseSuccess);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('PATCH');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(dataStubs.testEntity);
            done();
        });

        it("does not have Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBeUndefined();
            done();
        });

        it("sends the right If-Match header", function (done) {
            expect(request.requestHeaders['If-Match']).toBe("*");
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            done();
        });
    });

    describe("return representation", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.update(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.updateReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('PATCH');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(dataStubs.testEntity);
            done();
        });

        it("sends the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            done();
        });

        it("sends the right If-Match header", function (done) {
            expect(request.requestHeaders['If-Match']).toBe("*");
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.updatedEntity);
            done();
        });
    });

    describe("select in return representation", function () {
        var responseObject;
        var responseObject2;
        var request;
        var request2;
        beforeAll(function (done) {
            dynamicsWebApiTest
                .update(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                .then(function (object) {
                    responseObject = object;
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.updateReturnRepresentation);

            dynamicsWebApiTest
                .update(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                .then(function (object) {
                    responseObject2 = object;
                    done();
                });

            request2 = jasmine.Ajax.requests.mostRecent();
            request2.respondWith(responseStubs.updateReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname");
            expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('PATCH');
            expect(request2.method).toBe('PATCH');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(dataStubs.testEntity);
            expect(request2.data()).toEqual(dataStubs.testEntity);
            done();
        });

        it("sends the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            done();
        });

        it("sends the right If-Match header", function (done) {
            expect(request.requestHeaders['If-Match']).toBe("*");
            expect(request2.requestHeaders['If-Match']).toBe("*");
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.updatedEntity);
            expect(responseObject2).toEqual(dataStubs.updatedEntity);
            done();
        });
    });
});

describe("dynamicsWebApi.updateSingleProperty -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.updateSingleProperty(dataStubs.testEntityId, "tests", dataStubs.updatedEntity)
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.basicEmptyResponseSuccess);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/fullname");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('PUT');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual({
                value: dataStubs.updatedEntity.fullname
            });
            done();
        });

        it("does not have Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            done();
        });
    });

    describe("return representation", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.updateSingleProperty(dataStubs.testEntityId, "tests", dataStubs.updatedEntity, DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.updateReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/fullname");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('PUT');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual({
                value: dataStubs.updatedEntity.fullname
            });
            done();
        });

        it("sends the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.updatedEntity);
            done();
        });
    });
});

describe("dynamicsWebApi.upsert -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var responseObject2;
        var request;
        var request2;
        beforeAll(function (done) {
            dynamicsWebApiTest.upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity)
                .then(function (response) {
                    responseObject = response;
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.basicEmptyResponseSuccess);

            dynamicsWebApiTest.upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity)
                .then(function (response) {
                    responseObject2 = response;
                    done();
                });

            request2 = jasmine.Ajax.requests.mostRecent();
            request2.respondWith(responseStubs.createReturnId);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl);
            expect(request2.url).toBe(responseStubs.testEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('PATCH');
            expect(request2.method).toBe('PATCH');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(dataStubs.testEntity);
            expect(request2.data()).toEqual(dataStubs.testEntity);
            done();
        });

        it("does not have Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBeUndefined();
            expect(request2.requestHeaders['Prefer']).toBeUndefined();
            done();
        });

        it("does not have If-Match header", function (done) {
            expect(request.requestHeaders['If-Match']).toBeUndefined();
            expect(request2.requestHeaders['If-Match']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            expect(responseObject2).toEqual(dataStubs.testEntityId);
            done();
        });
    });

    describe("return representation", function () {
        var responseObject;
        var responseObject2;
        var request;
        var request2;
        beforeAll(function (done) {
            dynamicsWebApiTest.upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject = object;
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.updateReturnRepresentation);

            dynamicsWebApiTest.upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation)
                .then(function (object) {
                    responseObject2 = object;
                    done();
                });

            request2 = jasmine.Ajax.requests.mostRecent();
            request2.respondWith(responseStubs.createReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl);
            expect(request2.url).toBe(responseStubs.testEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('PATCH');
            expect(request2.method).toBe('PATCH');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(dataStubs.testEntity);
            expect(request2.data()).toEqual(dataStubs.testEntity);
            done();
        });

        it("sends the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            done();
        });

        it("does not have If-Match header", function (done) {
            expect(request.requestHeaders['If-Match']).toBeUndefined();
            expect(request2.requestHeaders['If-Match']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.updatedEntity);
            expect(responseObject2).toEqual(dataStubs.testEntity);
            done();
        });
    });

    describe("select & return representation", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        var responseObject4;
        var request;
        var request2;
        var request3;
        var request4;
        beforeAll(function (done) {
            dynamicsWebApiTest
                .upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                .then(function (object) {
                    responseObject = object;
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.updateReturnRepresentation);

            dynamicsWebApiTest
                .upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                .then(function (object) {
                    responseObject2 = object;
                });

            request2 = jasmine.Ajax.requests.mostRecent();
            request2.respondWith(responseStubs.updateReturnRepresentation);

            dynamicsWebApiTest
                .upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname"])
                .then(function (object) {
                    responseObject3 = object;
                });

            request3 = jasmine.Ajax.requests.mostRecent();
            request3.respondWith(responseStubs.createReturnId);

            dynamicsWebApiTest
                .upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"])
                .then(function (object) {
                    responseObject4 = object;
                    done();
                });

            request4 = jasmine.Ajax.requests.mostRecent();
            request4.respondWith(responseStubs.createReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname");
            expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            expect(request3.url).toBe(responseStubs.testEntityUrl + "?$select=fullname");
            expect(request4.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('PATCH');
            expect(request2.method).toBe('PATCH');
            expect(request3.method).toBe('PATCH');
            expect(request4.method).toBe('PATCH');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(dataStubs.testEntity);
            expect(request2.data()).toEqual(dataStubs.testEntity);
            expect(request3.data()).toEqual(dataStubs.testEntity);
            expect(request4.data()).toEqual(dataStubs.testEntity);
            done();
        });

        it("sends the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            expect(request3.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            expect(request4.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            done();
        });

        it("does not have If-Match header", function (done) {
            expect(request.requestHeaders['If-Match']).toBeUndefined();
            expect(request2.requestHeaders['If-Match']).toBeUndefined();
            expect(request3.requestHeaders['If-Match']).toBeUndefined();
            expect(request4.requestHeaders['If-Match']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.updatedEntity);
            expect(responseObject2).toEqual(dataStubs.updatedEntity);
            expect(responseObject3).toEqual(dataStubs.testEntityId);
            expect(responseObject4).toEqual(dataStubs.testEntity);
            done();
        });
    });
});

describe("dynamicsWebApi.deleteRecord -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.deleteRecord(dataStubs.testEntityId, "tests")
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.basicEmptyResponseSuccess);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('DELETE');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            done();
        });
    });

    describe("single property", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.deleteRecord(dataStubs.testEntityId, "tests", "fullname")
                .then(function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.basicEmptyResponseSuccess);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/fullname");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('DELETE');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            done();
        });
    });
});

describe("dynamicsWebApi.retrieve -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests")
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.response200);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.testEntity);
            done();
        });
    });

    describe("select basic", function () {
        var responseObject;
        var responseObject2;
        var request;
        var request2;
        beforeAll(function (done) {
            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["fullname"])
                .then(function (response) {
                    responseObject = response;
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.response200);

            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["fullname", "subject"])
                .then(function (response) {
                    responseObject2 = response;
                    done();
                });

            request2 = jasmine.Ajax.requests.mostRecent();
            request2.respondWith(responseStubs.response200);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname");
            expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            expect(request2.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            expect(request2.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.testEntity);
            expect(responseObject2).toEqual(dataStubs.testEntity);
            done();
        });
    });

    describe("single value or navigation property", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        var request;
        var request2;
        var request3;
        beforeAll(function (done) {
            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["/reference"])
                .then(function (response) {
                    responseObject = response;
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.response200);

            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["/reference", "fullname"])
                .then(function (response) {
                    responseObject2 = response;
                });

            request2 = jasmine.Ajax.requests.mostRecent();
            request2.respondWith(responseStubs.response200);

            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["/reference", "fullname", "subject"])
                .then(function (response) {
                    responseObject3 = response;
                    done();
                });

            request3 = jasmine.Ajax.requests.mostRecent();
            request3.respondWith(responseStubs.response200);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/reference");
            expect(request2.url).toBe(responseStubs.testEntityUrl + "/reference?$select=fullname");
            expect(request3.url).toBe(responseStubs.testEntityUrl + "/reference?$select=fullname,subject");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            expect(request2.method).toBe('GET');
            expect(request3.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            expect(request2.data()).toEqual({});
            expect(request3.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.testEntity);
            expect(responseObject2).toEqual(dataStubs.testEntity);
            expect(responseObject3).toEqual(dataStubs.testEntity);
            done();
        });
    });

    describe("reference", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["reference/$ref"])
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.retrieveReferenceResponse);

        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/reference/$ref");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.referenceResponseConverted);
            done();
        });
    });

    describe("expand basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", null, "reference(something)")
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.response200);

        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "?$expand=reference(something)");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.testEntity);
            done();
        });
    });

    describe("select & expand basic", function () {
        var responseObject;
        var responseObject2;
        var request;
        var request2;
        beforeAll(function (done) {
            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["fullname"], "reference(something)")
                .then(function (response) {
                    responseObject = response;
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.response200);

            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["fullname", "subject"], "reference(something)")
                .then(function (response) {
                    responseObject2 = response;
                    done();
                });

            request2 = jasmine.Ajax.requests.mostRecent();
            request2.respondWith(responseStubs.response200);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname&$expand=reference(something)");
            expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject&$expand=reference(something)");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            expect(request2.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            expect(request2.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.testEntity);
            expect(responseObject2).toEqual(dataStubs.testEntity);
            done();
        });
    });

    describe("select & expand navigation property", function () {
        var responseObject;
        var responseObject2;
        var responseObject3;
        var request;
        var request2;
        var request3;
        beforeAll(function (done) {
            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["/reference"], "reference(something)")
                .then(function (response) {
                    responseObject = response;
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.response200);

            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["/reference", "fullname"], "reference(something)")
                .then(function (response) {
                    responseObject2 = response;
                });

            request2 = jasmine.Ajax.requests.mostRecent();
            request2.respondWith(responseStubs.response200);

            dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", ["/reference", "fullname", "subject"], "reference(something)")
                .then(function (response) {
                    responseObject3 = response;
                    done();
                });

            request3 = jasmine.Ajax.requests.mostRecent();
            request3.respondWith(responseStubs.response200);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/reference?$expand=reference(something)");
            expect(request2.url).toBe(responseStubs.testEntityUrl + "/reference?$select=fullname&$expand=reference(something)");
            expect(request3.url).toBe(responseStubs.testEntityUrl + "/reference?$select=fullname,subject&$expand=reference(something)");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            expect(request2.method).toBe('GET');
            expect(request3.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            expect(request2.data()).toEqual({});
            expect(request3.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.testEntity);
            expect(responseObject2).toEqual(dataStubs.testEntity);
            expect(responseObject3).toEqual(dataStubs.testEntity);
            done();
        });
    });
});

describe("dynamicsWebApi.count -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.count("tests")
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.countBasic);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.createEntityUrl + "/$count");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(parseInt(responseStubs.countBasic.responseText));
            done();
        });
    });
    describe("filter", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.count("tests", "name eq 'name'")
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.multipleWithCountResponse);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.createEntityUrl + "?$filter=name%20eq%20'name'&$count=true");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.multipleWithCount["@odata.count"]);
            done();
        });
    });
});

describe("dynamicsWebApi._getPagingCookie -", function () {
    it("paginCookie is empty", function () {
        var result = dynamicsWebApiTest.__forTestsOnly__.getPagingCookie("", 2);
        expect(result).toEqual({
            cookie: "",
            page: 2,
            nextPage: 3
        });
    });

    it("pagingCookie is normal", function () {
        var result = dynamicsWebApiTest.__forTestsOnly__.getPagingCookie(dataStubs.fetchXmls.cookiePage2, 2);
        expect(result).toEqual(dataStubs.fetchXmls.fetchXmlResultPage2Cookie.PagingInfo);

        result = dynamicsWebApiTest.__forTestsOnly__.getPagingCookie(dataStubs.fetchXmls.cookiePage1, 2);
        expect(result).toEqual(dataStubs.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo);

        result = dynamicsWebApiTest.__forTestsOnly__.getPagingCookie(dataStubs.fetchXmls.cookiePage2);
        expect(result).toEqual(dataStubs.fetchXmls.fetchXmlResultPage2Cookie.PagingInfo);

    });
});

describe("dynamicsWebApi.executeFetchXml -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {

            dynamicsWebApiTest.executeFetchXml("tests", dataStubs.fetchXmls.fetchXml)
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.fetchXmlResponsePage1Cookie);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.createEntityUrl + "?fetchXml=" + escape(escape(dataStubs.fetchXmls.fetchXml1)));
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("does not send the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.fetchXmls.fetchXmlResultPage1Cookie);
            done();
        });
    });

    describe("paging", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            var pagingInfo = dataStubs.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
            dynamicsWebApiTest.executeFetchXml("tests", dataStubs.fetchXmls.fetchXml, null, pagingInfo.nextPage, pagingInfo.cookie)
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.fetchXmlResponsePage2Cookie);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.createEntityUrl + "?fetchXml=" + escape(escape(dataStubs.fetchXmls.fetchXml2cookie)));
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("does not send the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.fetchXmls.fetchXmlResultPage2Cookie);
            done();
        });
    });

    describe("paging - no cookie", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {

            dynamicsWebApiTest.executeFetchXml("tests", dataStubs.fetchXmls.fetchXml)
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.fetchXmlResponsePage1);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.createEntityUrl + "?fetchXml=" + escape(escape(dataStubs.fetchXmls.fetchXml1)));
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("does not send the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.fetchXmls.fetchXmlResultPage1);
            done();
        });
    });

    describe("with prefer", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            var pagingInfo = dataStubs.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
            dynamicsWebApiTest.executeFetchXml("tests", dataStubs.fetchXmls.fetchXml, DWA.Prefer.Annotations.FormattedValue, pagingInfo.nextPage, pagingInfo.cookie)
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.fetchXmlResponsePage2Cookie);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.createEntityUrl + "?fetchXml=" + escape(escape(dataStubs.fetchXmls.fetchXml2cookie)));
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('GET');
            done();
        });

        it("does not send data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("sends the correct Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBe('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"')
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(dataStubs.fetchXmls.fetchXmlResultPage2Cookie);
            done();
        });
    });
});

describe("dynamicsWebApi.associate -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.associate("tests", dataStubs.testEntityId, "tests_records", "records", dataStubs.testEntityId2)
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.basicEmptyResponseSuccess);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records/$ref");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('POST');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual({
                "@odata.id": webApiUrl + "records("+ dataStubs.testEntityId2 + ")"
            });
            done();
        });

        it("does not have MSCRMCallerID header", function (done) {
            expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            done();
        });
    });

    describe("impersonation", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.associate("tests", dataStubs.testEntityId, "tests_records", "records", dataStubs.testEntityId2, dataStubs.testEntityId3)
                .then(function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.updateReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records/$ref");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('POST');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual({
                "@odata.id": webApiUrl + "records(" + dataStubs.testEntityId2 + ")"
            });
            done();
        });

        it("sends the correct MSCRMCallerID header", function (done) {
            expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId3);
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            done();
        });
    });
});

describe("dynamicsWebApi.disassociate -", function () {

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("basic", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.disassociate("tests", dataStubs.testEntityId, "tests_records", dataStubs.testEntityId2)
                .then(function (response) {
                    responseObject = response;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.basicEmptyResponseSuccess);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records(" + dataStubs.testEntityId2 + ")/$ref");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('DELETE');
            done();
        });

        it("does not send the data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("does not have MSCRMCallerID header", function (done) {
            expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            done();
        });
    });

    describe("impersonation", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.disassociate("tests", dataStubs.testEntityId, "tests_records", dataStubs.testEntityId2, dataStubs.testEntityId3)
                .then(function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.updateReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records(" +dataStubs.testEntityId2 + ")/$ref");
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('DELETE');
            done();
        });

        it("does not send the data", function (done) {
            expect(request.data()).toEqual({});
            done();
        });

        it("sends the correct MSCRMCallerID header", function (done) {
            expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId3);
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBeUndefined();
            done();
        });
    });
});