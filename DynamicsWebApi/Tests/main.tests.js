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

describe("dynamicsWebApi.create -", function () {
    var webApiUrl = "https://testorg.crm.dynamics.com/api/data/v8.2/";
    var dynamicsWebApiTest = new DynamicsWebApi({ webApiUrl: webApiUrl })

    var entityRecord = {
        name: "record",
        subject: "test"
    };

    var entityRecordId = "00000000-0000-0000-0000-000000000001";
    var responses = {
        createEntityUrl: webApiUrl + "tests",
        createReturnId: {
            status: 204,
            responseHeaders: { "OData-EntityId": webApiUrl + "tests(" + entityRecordId + ")" }
        },
        createReturnRepresentation: {
            status: 201,
            responseText: JSON.stringify(entityRecord)
        }
    };
    
    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("return only id", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.create(entityRecord, "tests").then(function (id) {
                responseObject = id;
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responses.createReturnId);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responses.createEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('POST');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(entityRecord);
            done();
        });

        it("does not have Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBeUndefined();
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toBe(entityRecordId);
            done();
        });
    });

    describe("return representation", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiTest.create(entityRecord, "tests", DWA.Prefer.ReturnRepresentation).then(function (object) {
                responseObject = object;
                done();
            });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responses.createReturnRepresentation);
        });

        it("sends the request to the right end point", function (done) {
            expect(request.url).toBe(responses.createEntityUrl);
            done();
        });

        it("uses the correct method", function (done) {
            expect(request.method).toBe('POST');
            done();
        });

        it("sends the right data", function (done) {
            expect(request.data()).toEqual(entityRecord);
            done();
        });

        it("sends the Prefer header", function (done) {
            expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            done();
        });

        it("returns the correct response", function (done) {
            expect(responseObject).toEqual(entityRecord);
            done();
        });
    });
});