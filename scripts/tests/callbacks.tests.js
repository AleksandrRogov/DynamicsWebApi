/// <reference path="../dynamics-web-api-callbacks.js" />
/// <reference path="jasmine.js" />
/// <reference path="jasmine-ajax.js" />
/// <reference path="stubs.js" />

describe("callbacks -", function () {

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
                dynamicsWebApiTest.create(dataStubs.testEntity, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.createReturnId);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('POST');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBe(dataStubs.testEntityId);
            });
        });

        describe("return representation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.create(dataStubs.testEntity, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, DWA.Prefer.ReturnRepresentation);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.createReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('POST');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
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
                dynamicsWebApiTest.update(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
            });

            it("sends the right If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("*");
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("return representation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.update(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, DWA.Prefer.ReturnRepresentation);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("sends the right If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("*");
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.updatedEntity);
            });
        });

        describe("select in return representation", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest
                    .update(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                        responseObject = object;
                    }, function (object) {
                        responseObject = object;
                    }, DWA.Prefer.ReturnRepresentation, ["fullname"]);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);

                dynamicsWebApiTest
                    .update(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                        responseObject2 = object;
                        done();
                    }, function (object) {
                        responseObject2 = object;
                        done();
                    }, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"]);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("sends the right If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("*");
                expect(request2.requestHeaders['If-Match']).toBe("*");
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.updatedEntity);
                expect(responseObject2).toEqual(dataStubs.updatedEntity);
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
                dynamicsWebApiTest.updateSingleProperty(dataStubs.testEntityId, "tests", dataStubs.updatedEntity, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/fullname");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PUT');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual({
                    value: dataStubs.updatedEntity.fullname
                });
            });

            it("does not have Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("return representation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.updateSingleProperty(dataStubs.testEntityId, "tests", dataStubs.updatedEntity, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, DWA.Prefer.ReturnRepresentation);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/fullname");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PUT');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual({
                    value: dataStubs.updatedEntity.fullname
                });
            });

            it("sends the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.updatedEntity);
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
                dynamicsWebApiTest.upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);

                dynamicsWebApiTest.upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.createReturnId);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
                expect(request2.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
                expect(request2.requestHeaders['Prefer']).toBeUndefined();
            });

            it("does not have If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
                expect(responseObject2).toEqual(dataStubs.testEntityId);
            });
        });

        describe("return representation", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, DWA.Prefer.ReturnRepresentation);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);

                dynamicsWebApiTest.upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, DWA.Prefer.ReturnRepresentation);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.createReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
                expect(request2.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("does not have If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.updatedEntity);
                expect(responseObject2).toEqual(dataStubs.testEntity);
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
                    .upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                        responseObject = object;
                    }, function (object) {
                        responseObject = object;
                    }, DWA.Prefer.ReturnRepresentation, ["fullname"]);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);

                dynamicsWebApiTest
                    .upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                        responseObject2 = object;
                    }, function (object) {
                        responseObject2 = object;
                    }, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"]);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.updateReturnRepresentation);

                dynamicsWebApiTest
                    .upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                        responseObject3 = object;
                    }, function (object) {
                        responseObject3 = object;
                    }, DWA.Prefer.ReturnRepresentation, ["fullname"]);

                request3 = jasmine.Ajax.requests.mostRecent();
                request3.respondWith(responseStubs.createReturnId);

                dynamicsWebApiTest
                    .upsert(dataStubs.testEntityId, "tests", dataStubs.testEntity, function (object) {
                        responseObject4 = object;
                        done();
                    }, function (object) {
                        responseObject4 = object;
                        done();
                    }, DWA.Prefer.ReturnRepresentation, ["fullname", "subject"]);

                request4 = jasmine.Ajax.requests.mostRecent();
                request4.respondWith(responseStubs.createReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
                expect(request3.url).toBe(responseStubs.testEntityUrl + "?$select=fullname");
                expect(request4.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
                expect(request3.method).toBe('PATCH');
                expect(request4.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
                expect(request3.data()).toEqual(dataStubs.testEntity);
                expect(request4.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request3.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request4.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("does not have If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
                expect(request3.requestHeaders['If-Match']).toBeUndefined();
                expect(request4.requestHeaders['If-Match']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.updatedEntity);
                expect(responseObject2).toEqual(dataStubs.updatedEntity);
                expect(responseObject3).toEqual(dataStubs.testEntityId);
                expect(responseObject4).toEqual(dataStubs.testEntity);
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
                dynamicsWebApiTest.deleteRecord(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('DELETE');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("single property", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.deleteRecord(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, "fullname");

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/fullname");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('DELETE');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
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
                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
            });
        });

        describe("select basic", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, ["fullname"]);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, ["fullname", "subject"]);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
                expect(responseObject2).toEqual(dataStubs.testEntity);
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
                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, ["/reference"]);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject2 = object;
                }, function (object) {
                    responseObject2 = object;
                }, ["/reference", "fullname"]);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.response200);

                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject3 = object;
                    done();
                }, function (object) {
                    responseObject3 = object;
                    done();
                }, ["/reference", "fullname", "subject"]);

                request3 = jasmine.Ajax.requests.mostRecent();
                request3.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/reference");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "/reference?$select=fullname");
                expect(request3.url).toBe(responseStubs.testEntityUrl + "/reference?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
                expect(request3.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
                expect(request3.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
                expect(responseObject2).toEqual(dataStubs.testEntity);
                expect(responseObject3).toEqual(dataStubs.testEntity);
            });
        });

        describe("reference", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, ["reference/$ref"]);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.retrieveReferenceResponse);

            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/reference/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.referenceResponseConverted);
            });
        });

        describe("expand basic", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, null, "reference(something)");

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "?$expand=reference(something)");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
            });
        });

        describe("select & expand basic", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, ["fullname"], "reference(something)");

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, ["fullname", "subject"], "reference(something)");

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname&$expand=reference(something)");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject&$expand=reference(something)");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
                expect(responseObject2).toEqual(dataStubs.testEntity);
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
                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, ["/reference"], "reference(something)");

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject2 = object;
                }, function (object) {
                    responseObject2 = object;
                }, ["/reference", "fullname"], "reference(something)");

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.response200);

                dynamicsWebApiTest.retrieve(dataStubs.testEntityId, "tests", function (object) {
                    responseObject3 = object;
                    done();
                }, function (object) {
                    responseObject3 = object;
                    done();
                }, ["/reference", "fullname", "subject"], "reference(something)");

                request3 = jasmine.Ajax.requests.mostRecent();
                request3.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/reference?$expand=reference(something)");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "/reference?$select=fullname&$expand=reference(something)");
                expect(request3.url).toBe(responseStubs.testEntityUrl + "/reference?$select=fullname,subject&$expand=reference(something)");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
                expect(request3.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
                expect(request3.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
                expect(responseObject2).toEqual(dataStubs.testEntity);
                expect(responseObject3).toEqual(dataStubs.testEntity);
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
                dynamicsWebApiTest.count("tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.countBasic);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "/$count");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(parseInt(responseStubs.countBasic.responseText));
            });
        });
        describe("filter", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.count("tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, "name eq 'name'");

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.multipleWithCountResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?$filter=name%20eq%20'name'&$count=true");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.multipleWithCount["@odata.count"]);
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

                dynamicsWebApiTest.executeFetchXml("tests", dataStubs.fetchXmls.fetchXml, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.fetchXmlResponsePage1Cookie);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?fetchXml=" + escape(escape(dataStubs.fetchXmls.fetchXml1)));
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("does not send the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.fetchXmls.fetchXmlResultPage1Cookie);
            });
        });

        describe("paging", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                var pagingInfo = dataStubs.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
                dynamicsWebApiTest.executeFetchXml("tests", dataStubs.fetchXmls.fetchXml, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, null, pagingInfo.nextPage, pagingInfo.cookie);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.fetchXmlResponsePage2Cookie);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?fetchXml=" + escape(escape(dataStubs.fetchXmls.fetchXml2cookie)));
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("does not send the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.fetchXmls.fetchXmlResultPage2Cookie);
            });
        });

        describe("paging - no cookie", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {

                dynamicsWebApiTest.executeFetchXml("tests", dataStubs.fetchXmls.fetchXml, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.fetchXmlResponsePage1);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?fetchXml=" + escape(escape(dataStubs.fetchXmls.fetchXml1)));
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("does not send the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.fetchXmls.fetchXmlResultPage1);
            });
        });

        describe("with prefer", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                var pagingInfo = dataStubs.fetchXmls.fetchXmlResultPage1Cookie.PagingInfo;
                dynamicsWebApiTest.executeFetchXml("tests", dataStubs.fetchXmls.fetchXml, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, DWA.Prefer.Annotations.FormattedValue, pagingInfo.nextPage, pagingInfo.cookie);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.fetchXmlResponsePage2Cookie);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?fetchXml=" + escape(escape(dataStubs.fetchXmls.fetchXml2cookie)));
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("sends the correct Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"')
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.fetchXmls.fetchXmlResultPage2Cookie);
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
                dynamicsWebApiTest.associate("tests", dataStubs.testEntityId, "tests_records", "records", dataStubs.testEntityId2, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('POST');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual({
                    "@odata.id": webApiUrl + "records(" + dataStubs.testEntityId2 + ")"
                });
            });

            it("does not have MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("impersonation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.associate("tests", dataStubs.testEntityId, "tests_records", "records", dataStubs.testEntityId2, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, dataStubs.testEntityId3);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('POST');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual({
                    "@odata.id": webApiUrl + "records(" + dataStubs.testEntityId2 + ")"
                });
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId3);
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
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
                dynamicsWebApiTest.disassociate("tests", dataStubs.testEntityId, "tests_records", dataStubs.testEntityId2, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records(" + dataStubs.testEntityId2 + ")/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('DELETE');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual({});
            });

            it("does not have MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("impersonation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.disassociate("tests", dataStubs.testEntityId, "tests_records", dataStubs.testEntityId2, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, dataStubs.testEntityId3);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records(" + dataStubs.testEntityId2 + ")/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('DELETE');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual({});
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId3);
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });
    });

    describe("dynamicsWebApi.associateSingleValued -", function () {

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
                dynamicsWebApiTest.associateSingleValued("tests", dataStubs.testEntityId, "tests_records", "records", dataStubs.testEntityId2, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PUT');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual({
                    "@odata.id": webApiUrl + "records(" + dataStubs.testEntityId2 + ")"
                });
            });

            it("does not have MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("impersonation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.associateSingleValued("tests", dataStubs.testEntityId, "tests_records", "records", dataStubs.testEntityId2, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, dataStubs.testEntityId3);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PUT');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual({
                    "@odata.id": webApiUrl + "records(" + dataStubs.testEntityId2 + ")"
                });
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId3);
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });
    });

    describe("dynamicsWebApi.disassociateSingleValued -", function () {

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
                dynamicsWebApiTest.disassociateSingleValued("tests", dataStubs.testEntityId, "tests_records", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('DELETE');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual({});
            });

            it("does not have MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("impersonation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.disassociateSingleValued("tests", dataStubs.testEntityId, "tests_records", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, dataStubs.testEntityId3);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/tests_records/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('DELETE');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual({});
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId3);
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });
    });

    describe("dynamicsWebApi._buildFunctionParameters - ", function () {
        it("no parameters", function () {
            var result = dynamicsWebApiTest.__forTestsOnly__.buildFunctionParameters();
            expect(result).toBe("()");
        });
        it("1 parameter", function () {
            var result = dynamicsWebApiTest.__forTestsOnly__.buildFunctionParameters({ param1: "value1" });
            expect(result).toBe("(param1=@p1)?@p1='value1'");
        });
        it("2 parameters", function () {
            var result = dynamicsWebApiTest.__forTestsOnly__.buildFunctionParameters({ param1: "value1", param2: 2 });
            expect(result).toBe("(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
        });
        it("3 parameters", function () {
            var result = dynamicsWebApiTest.__forTestsOnly__.buildFunctionParameters({ param1: "value1", param2: 2, param3: "value2" });
            expect(result).toBe("(param1=@p1,param2=@p2,param3=@p3)?@p1='value1'&@p2=2&@p3='value2'");
        });
    });

    describe("dynamicsWebApi.executeFunction -", function () {

        beforeAll(function () {
            jasmine.Ajax.install();
        });

        afterAll(function () {
            jasmine.Ajax.uninstall();
        });

        describe("unbound", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.executeUnboundFunction("FUN", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

                dynamicsWebApiTest.executeUnboundFunction("FUN", function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, { param1: "value1", param2: 2 });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(webApiUrl + "FUN()");
                expect(request2.url).toBe(webApiUrl + "FUN(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("does not have MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
                expect(request2.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
                expect(responseObject2).toEqual(dataStubs.testEntity);
            });
        });

        describe("unbound impersonation", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.executeUnboundFunction("FUN", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, null, dataStubs.testEntityId);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

                dynamicsWebApiTest.executeUnboundFunction("FUN", function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, { param1: "value1", param2: 2 }, dataStubs.testEntityId);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(webApiUrl + "FUN()");
                expect(request2.url).toBe(webApiUrl + "FUN(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId);
                expect(request2.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId);
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
                expect(responseObject2).toEqual(dataStubs.testEntity);
            });
        });

        describe("bound", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.executeBoundFunction(dataStubs.testEntityId, "tests", "FUN", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

                dynamicsWebApiTest.executeBoundFunction(dataStubs.testEntityId, "tests", "FUN", function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, { param1: "value1", param2: 2 });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/FUN()");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "/FUN(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("does not have MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
                expect(request2.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
                expect(responseObject2).toBeUndefined();
            });
        });

        describe("bound impersonation", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.executeBoundFunction(dataStubs.testEntityId, "tests", "FUN", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, null, dataStubs.testEntityId);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);

                dynamicsWebApiTest.executeBoundFunction(dataStubs.testEntityId, "tests", "FUN", function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, { param1: "value1", param2: 2 }, dataStubs.testEntityId);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/FUN()");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "/FUN(param1=@p1,param2=@p2)?@p1='value1'&@p2=2");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId);
                expect(request2.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId);
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
                expect(responseObject2).toEqual(dataStubs.testEntity);
            });
        });
    });

    describe("dynamicsWebApi.executeAction -", function () {

        beforeAll(function () {
            jasmine.Ajax.install();
        });

        afterAll(function () {
            jasmine.Ajax.uninstall();
        });

        describe("unbound", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.executeUnboundAction("FUN", responseStubs.actionRequest, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(webApiUrl + "FUN");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('POST');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual(responseStubs.actionRequestModified);
            });

            it("does not have MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("unbound impersonation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.executeUnboundAction("FUN", responseStubs.actionRequest, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, dataStubs.testEntityId2);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(webApiUrl + "FUN");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('POST');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual(responseStubs.actionRequestModified);
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
            });
        });

        describe("bound", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.executeBoundAction(dataStubs.testEntityId, "tests", "FUN", responseStubs.actionRequest, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/FUN");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('POST');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual(responseStubs.actionRequestModified);
            });

            it("does not have MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
            });
        });

        describe("bound impersonation", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                dynamicsWebApiTest.executeBoundAction(dataStubs.testEntityId, "tests", "FUN", responseStubs.actionRequest, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                }, dataStubs.testEntityId2);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/FUN");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('POST');
            });

            it("does not send the data", function () {
                expect(request.data()).toEqual(responseStubs.actionRequestModified);
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
            });
        });
    });

    describe("dynamicsWebApi._convertOptions -", function () {
        var stubUrl = webApiUrl + "tests";
        //{ url: url, query: query, headers: headers }
        it("request is empty", function () {
            var dwaRequest;

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl, "&");
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(null, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions({}, "", stubUrl, "&");
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

        });

        it("count=true", function () {
            var dwaRequest = {
                count: true
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$count=true", headers: {} });
        });

        it("count=false", function () {
            var dwaRequest = {
                count: false
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("expand is empty", function () {
            var dwaRequest = {
                expand: undefined
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                expand: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                expand: []
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("expand - filter without expand.property", function () {
            var dwaRequest = {
                expand: [{
                    filter: "name eq 'name'"
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                expand: [{
                    filter: "name eq 'name'",
                    property: null
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("expand - property", function () {
            var dwaRequest = {
                expand: [{
                    property: "property"
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });
        });

        it("expand - property,filter empty", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    filter: ""
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });

            dwaRequest = {
                expand: [{
                    property: "property",
                    filter: null
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });
        });

        it("expand - property,filter", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    filter: "name eq 'name'"
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property($filter=" + encodeURI("name eq 'name'") + ")", headers: {} });
        });

        it("expand - property,orderBy empty", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    orderBy: []
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });

            dwaRequest = {
                expand: [{
                    property: "property",
                    orderBy: null
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });
        });

        it("expand - property,orderBy", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    orderBy: ["name"]
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property($orderBy=name)", headers: {} });

            dwaRequest = {
                expand: [{
                    property: "property",
                    orderBy: ["name", "subject"]
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property($orderBy=name,subject)", headers: {} });
        });

        it("expand - property,select empty", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    select: []
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });

            dwaRequest = {
                expand: [{
                    property: "property",
                    select: null
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });
        });

        it("expand - property,select", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    select: ["name"]
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property($select=name)", headers: {} });

            dwaRequest = {
                expand: [{
                    property: "property",
                    select: ["name", "subject"]
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property($select=name,subject)", headers: {} });
        });

        it("expand - property,top empty or <=0", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    top: 0
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });

            dwaRequest = {
                expand: [{
                    property: "property",
                    top: -1
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });

            dwaRequest = {
                expand: [{
                    property: "property",
                    top: null
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property", headers: {} });
        });

        it("expand - property,top", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    top: 3
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property($top=3)", headers: {} });
        });

        it("expand - different properties", function () {
            var dwaRequest = {
                expand: [{
                    property: "property",
                    select: ["name", "subject"],
                    top: 3
                }]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property($select=name,subject;$top=3)", headers: {} });

            dwaRequest = {
                expand: [{
                    property: "property",
                    select: ["name", "subject"],
                    orderBy: ["order"],
                    top: 3
                }]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$expand=property($select=name,subject;$top=3;$orderBy=order)", headers: {} });
        });

        it("filter empty", function () {
            var dwaRequest = {
                filter: ""
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                filter: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("filter", function () {
            var dwaRequest = {
                filter: "name eq 'name'"
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$filter=name eq 'name'", headers: {} });
        });

        it("ifmatch empty", function () {
            var dwaRequest = {
                ifmatch: ""
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                ifmatch: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("ifmatch", function () {
            var dwaRequest = {
                ifmatch: "*"
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: { "If-Match": "*" } });
        });

        it("ifnonematch empty", function () {
            var dwaRequest = {
                ifnonematch: ""
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                ifnonematch: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("ifnonematch", function () {
            var dwaRequest = {
                ifnonematch: "*"
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: { "If-None-Match": "*" } });
        });

        it("impersonate empty", function () {
            var dwaRequest = {
                impersonate: ""
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                impersonate: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("impersonate", function () {
            var dwaRequest = {
                impersonate: dataStubs.testEntityId
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: { "MSCRMCallerID": dataStubs.testEntityId } });
        });

        it("includeAnnotations empty", function () {
            var dwaRequest = {
                includeAnnotations: ""
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                includeAnnotations: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("includeAnnotations", function () {
            var dwaRequest = {
                includeAnnotations: DWA.Prefer.Annotations.AssociatedNavigationProperty
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: { Prefer: 'odata.include-annotations="' + DWA.Prefer.Annotations.AssociatedNavigationProperty + '"' } });
        });

        it("maxPageSize empty or <=0", function () {
            var dwaRequest = {
                maxPageSize: 0
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                maxPageSize: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                maxPageSize: -2
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("maxPageSize", function () {
            var dwaRequest = {
                maxPageSize: 10
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: { Prefer: 'odata.maxpagesize=10' } });
        });

        it("navigationProperty empty", function () {
            var dwaRequest = {
                navigationProperty: ""
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                navigationProperty: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("navigationProperty", function () {
            var dwaRequest = {
                navigationProperty: "nav"
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl + "/nav", query: "", headers: {} });
        });

        it("orderBy empty", function () {
            var dwaRequest = {
                orderBy: []
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                orderBy: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("orderBy", function () {
            var dwaRequest = {
                orderBy: ["name"]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$orderBy=name", headers: {} });

            dwaRequest = {
                orderBy: ["name", "subject"]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({
                url: stubUrl, query: "$orderBy=name,subject", headers: {}
            });
        });

        it("returnRepresentation empty", function () {
            var dwaRequest = {
                returnRepresentation: false
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                returnRepresentation: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("returnRepresentation", function () {
            var dwaRequest = {
                returnRepresentation: true
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });
        });

        it("select empty", function () {
            var dwaRequest = {
                select: []
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                select: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("select", function () {
            var dwaRequest = {
                select: ["name"]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$select=name", headers: {} });

            dwaRequest = {
                select: ["name", "subject"]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$select=name,subject", headers: {} });
        });

        it("select navigation property", function () {
            var dwaRequest = {
                select: ["/nav"]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
            expect(result).toEqual({ url: stubUrl + "/nav", query: "", headers: {} });

            dwaRequest = {
                select: ["/nav", "subject"]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
            expect(result).toEqual({ url: stubUrl + "/nav", query: "$select=subject", headers: {} });

            dwaRequest = {
                select: ["/nav", "subject", "fullname"]
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
            expect(result).toEqual({ url: stubUrl + "/nav", query: "$select=subject,fullname", headers: {} });
        });

        it("select reference", function () {
            var dwaRequest = {
                select: ["nav/$ref"]
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
            expect(result).toEqual({ url: stubUrl + "/nav/$ref", query: "", headers: {} });
        });

        it("top empty or <=0", function () {
            var dwaRequest = {
                top: 0
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                top: -1
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                top: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("top", function () {
            var dwaRequest = {
                top: 3
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$top=3", headers: {} });
        });

        it("savedQuery empty", function () {
            var dwaRequest = {
                savedQuery: ""
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                savedQuery: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("savedQuery", function () {
            var dwaRequest = {
                savedQuery: dataStubs.testEntityId
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "savedQuery=" + dataStubs.testEntityId, headers: {} });
        });

        it("userQuery empty", function () {
            var dwaRequest = {
                userQuery: ""
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });

            dwaRequest = {
                userQuery: null
            };

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "", headers: {} });
        });

        it("userQuery", function () {
            var dwaRequest = {
                userQuery: dataStubs.testEntityId
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "userQuery=" + dataStubs.testEntityId, headers: {} });
        });

        it("multiple options", function () {
            var dwaRequest = {
                select: ["name", "subject"],
                orderBy: ["order"],
                top: 5
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$select=name,subject&$top=5&$orderBy=order", headers: {} });

            dwaRequest.expand = [{
                property: "property",
                select: ["name"],
                orderBy: ["order"]
            }, {
                property: "property2",
                select: ["name3"]
            }];

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$select=name,subject&$top=5&$orderBy=order&$expand=property($select=name;$orderBy=order),property2($select=name3)", headers: {} });

            dwaRequest.expand = null;
            dwaRequest.returnRepresentation = true;

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$select=name,subject&$top=5&$orderBy=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

            dwaRequest.top = 0;
            dwaRequest.count = true;
            dwaRequest.impersonate = dataStubs.testEntityId;

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl, query: "$select=name,subject&$count=true&$orderBy=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation, MSCRMCallerID: dataStubs.testEntityId } });

            dwaRequest.impersonate = null;
            dwaRequest.navigationProperty = "nav";

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "", stubUrl);
            expect(result).toEqual({ url: stubUrl + "/nav", query: "$select=name,subject&$count=true&$orderBy=order", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

            dwaRequest.navigationProperty = null;
            dwaRequest.returnRepresentation = false;
            dwaRequest.includeAnnotations = DWA.Prefer.Annotations.All;
            dwaRequest.select[0] = "/nav";

            result = dynamicsWebApiTest.__forTestsOnly__.convertOptions(dwaRequest, "retrieve", stubUrl);
            expect(result).toEqual({ url: stubUrl + "/nav", query: "$select=subject&$count=true&$orderBy=order", headers: { Prefer: 'odata.include-annotations="*"' } });
        });
    });

    describe("dynamicsWebApi._convertRequestToLink -", function () {
        //{ url: result.url, headers: result.headers }
        it("collection", function () {
            var dwaRequest = {
                collection: "cols"
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
            expect(result).toEqual({ url: "cols", headers: {} });
        });

        it("collection empty - throw error", function () {
            var dwaRequest = {
                collection: ""
            };

            var test = function () {
                dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
            }

            expect(test).toThrowError(/request\.collection/);

            dwaRequest.collection = 0;
            expect(test).toThrowError(/request\.collection/);

            dwaRequest.collection = null;
            expect(test).toThrowError(/request\.collection/);
        });

        it("collection, id empty", function () {
            var dwaRequest = {
                collection: "cols",
                id: null
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
            expect(result).toEqual({ url: "cols", headers: {} });

            dwaRequest.id = "";

            result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
            expect(result).toEqual({ url: "cols", headers: {} });
        });

        it("collection, id - wrong format throw error", function () {
            var dwaRequest = {
                collection: "cols",
                id: "sa"
            };

            var test = function () {
                dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
            }

            expect(test).toThrowError(/request\.id/);
        });

        it("collection, id", function () {
            var dwaRequest = {
                collection: "cols",
                id: dataStubs.testEntityId
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
            expect(result).toEqual({ url: "cols(" + dataStubs.testEntityId + ")", headers: {} });
        });

        it("full", function () {
            var dwaRequest = {
                collection: "cols",
                id: dataStubs.testEntityId,
                select: ["name"],
                returnRepresentation: true
            };

            var result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
            expect(result).toEqual({ url: "cols(" + dataStubs.testEntityId + ")?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });

            dwaRequest.navigationProperty = "nav";

            result = dynamicsWebApiTest.__forTestsOnly__.convertRequestToLink(dwaRequest);
            expect(result).toEqual({ url: "cols(" + dataStubs.testEntityId + ")/nav?$select=name", headers: { Prefer: DWA.Prefer.ReturnRepresentation } });
        });
    });

    describe("dynamicsWebApi.updateRequest -", function () {
        var dwaRequest = {
            id: dataStubs.testEntityId,
            collection: "tests",
            entity: dataStubs.testEntity
        }

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
                dynamicsWebApiTest.updateRequest(dwaRequest, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
            });

            it("does not have Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
            });

            it("sends the right If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("*");
            });

            it("returns the correct response", function () {
                expect(responseObject).toBe(true);
            });
        });

        describe("return representation", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dwaRequest.returnRepresentation = true;

                dynamicsWebApiTest.updateRequest(dwaRequest, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.updateReturnRepresentation);

                dwaRequest.select = ["fullname", "subject"];

                dynamicsWebApiTest.updateRequest(dwaRequest, function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
                expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("sends the right If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("*");
                expect(request2.requestHeaders['If-Match']).toBe("*");
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.updatedEntity);
                expect(responseObject2).toEqual(dataStubs.updatedEntity);
            });
        });

        describe("change if-match header", function () {
            var responseObject;
            var responseObject2;
            var responseObject3;
            var request;
            var request2;
            var request3;
            beforeAll(function (done) {
                dwaRequest.ifmatch = "match";
                dwaRequest.returnRepresentation = false;
                dynamicsWebApiTest
                    .updateRequest(dwaRequest, function (object) {
                        responseObject = object;
                    }, function (object) {
                        responseObject = object;
                    });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);

                dwaRequest.returnRepresentation = true;

                dynamicsWebApiTest
                    .updateRequest(dwaRequest, function (object) {
                        responseObject2 = object;
                    }, function (object) {
                        responseObject2 = object;
                    });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.upsertPreventUpdateResponse);

                dynamicsWebApiTest
                    .updateRequest(dwaRequest, function (object) {
                        responseObject3 = object;
                        done();
                    }, function (object) {
                        responseObject3 = object;
                        done();
                    });

                request3 = jasmine.Ajax.requests.mostRecent();
                request3.respondWith(responseStubs.upsertPreventCreateResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
                expect(request2.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
                expect(request3.url).toBe(responseStubs.testEntityUrl + "?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
                expect(request3.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
                expect(request3.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
                expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request3.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("sends the right If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("match");
                expect(request2.requestHeaders['If-Match']).toBe("match");
                expect(request3.requestHeaders['If-Match']).toBe("match");
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(true);
                expect(responseObject2).toEqual(false);
                expect(responseObject3.status).toEqual(404);
            });
        });
    });

    describe("dynamicsWebApi.upsertRequest -", function () {
        var dwaRequest = {
            id: dataStubs.testEntityId,
            collection: "tests",
            entity: dataStubs.testEntity
        }

        beforeAll(function () {
            jasmine.Ajax.install();
        });

        afterAll(function () {
            jasmine.Ajax.uninstall();
        });

        describe("basic & return representation", function () {
            var responseObject;
            var responseObject2;
            var responseObject3;
            var responseObject4;
            var request;
            var request2;
            var request3;
            var request4;
            beforeAll(function (done) {
                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject2 = object;
                }, function (object) {
                    responseObject2 = object;
                });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.createReturnId);

                dwaRequest.returnRepresentation = true;

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject3 = object;
                }, function (object) {
                    responseObject3 = object;
                });

                request3 = jasmine.Ajax.requests.mostRecent();
                request3.respondWith(responseStubs.updateReturnRepresentation);

                dwaRequest.select = ["name"];

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject4 = object;
                    done();
                }, function (object) {
                    responseObject4 = object;
                    done();
                });

                request4 = jasmine.Ajax.requests.mostRecent();
                request4.respondWith(responseStubs.updateReturnRepresentation);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
                expect(request2.url).toBe(responseStubs.testEntityUrl);
                expect(request3.url).toBe(responseStubs.testEntityUrl);
                expect(request4.url).toBe(responseStubs.testEntityUrl + "?$select=name");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
                expect(request3.method).toBe('PATCH');
                expect(request4.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
                expect(request3.data()).toEqual(dataStubs.testEntity);
                expect(request4.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the right Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
                expect(request2.requestHeaders['Prefer']).toBeUndefined();
                expect(request3.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request4.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("does not have If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
                expect(request3.requestHeaders['If-Match']).toBeUndefined();
                expect(request4.requestHeaders['If-Match']).toBeUndefined();
            });

            it("does not have If-None-Match header", function () {
                expect(request.requestHeaders['If-None-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-None-Match']).toBeUndefined();
                expect(request3.requestHeaders['If-None-Match']).toBeUndefined();
                expect(request4.requestHeaders['If-None-Match']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
                expect(responseObject2).toEqual(dataStubs.testEntityId);
                expect(responseObject3).toEqual(dataStubs.updatedEntity);
                expect(responseObject4).toEqual(dataStubs.updatedEntity);
            });
        });

        describe("If-Match", function () {
            var responseObject;
            var responseObject2;
            var responseObject3;
            var request;
            var request2;
            var request3;
            beforeAll(function (done) {
                dwaRequest.select = null;
                dwaRequest.returnRepresentation = false;
                dwaRequest.ifmatch = "*";

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.upsertPreventCreateResponse);

                dwaRequest.returnRepresentation = true;

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject2 = object;
                }, function (object) {
                    responseObject2 = object;
                });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.createReturnRepresentation);

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject3 = object;
                    done();
                }, function (object) {
                    responseObject3 = object;
                    done();
                });

                request3 = jasmine.Ajax.requests.mostRecent();
                request3.respondWith(responseStubs.upsertPreventUpdateResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
                expect(request2.url).toBe(responseStubs.testEntityUrl);
                expect(request3.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
                expect(request3.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
                expect(request3.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the right Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
                expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request3.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("sends the correct If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("*");
                expect(request2.requestHeaders['If-Match']).toBe("*");
                expect(request3.requestHeaders['If-Match']).toBe("*");
            });

            it("does not have If-None-Match header", function () {
                expect(request.requestHeaders['If-None-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-None-Match']).toBeUndefined();
                expect(request3.requestHeaders['If-None-Match']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
                expect(responseObject2).toEqual(dataStubs.testEntity);
                expect(responseObject3.status).toBe(responseStubs.upsertPreventUpdateResponse.status);
            });
        });

        describe("If-None-Match", function () {
            var responseObject;
            var responseObject2;
            var responseObject3;
            var request;
            var request2;
            var request3;
            beforeAll(function (done) {
                dwaRequest.select = null;
                dwaRequest.returnRepresentation = false;
                dwaRequest.ifmatch = null;
                dwaRequest.ifnonematch = "*";

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.upsertPreventUpdateResponse);

                dwaRequest.returnRepresentation = true;

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject2 = object;
                }, function (object) {
                    responseObject2 = object;
                });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.createReturnRepresentation);

                dynamicsWebApiTest.upsertRequest(dwaRequest, function (object) {
                    responseObject3 = object;
                    done();
                }, function (object) {
                    responseObject3 = object;
                    done();
                });

                request3 = jasmine.Ajax.requests.mostRecent();
                request3.respondWith(responseStubs.upsertPreventCreateResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
                expect(request2.url).toBe(responseStubs.testEntityUrl);
                expect(request3.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('PATCH');
                expect(request2.method).toBe('PATCH');
                expect(request3.method).toBe('PATCH');
            });

            it("sends the right data", function () {
                expect(request.data()).toEqual(dataStubs.testEntity);
                expect(request2.data()).toEqual(dataStubs.testEntity);
                expect(request3.data()).toEqual(dataStubs.testEntity);
            });

            it("sends the right Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBeUndefined();
                expect(request2.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
                expect(request3.requestHeaders['Prefer']).toBe(DWA.Prefer.ReturnRepresentation);
            });

            it("does not have If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
                expect(request3.requestHeaders['If-Match']).toBeUndefined();;
            });

            it("sends the correct If-None-Match header", function () {
                expect(request.requestHeaders['If-None-Match']).toBe("*");
                expect(request2.requestHeaders['If-None-Match']).toBe("*");
                expect(request3.requestHeaders['If-None-Match']).toBe("*");
            });

            it("returns the correct response", function () {
                expect(responseObject).toBeUndefined();
                expect(responseObject2).toEqual(dataStubs.testEntity);
                expect(responseObject3.status).toBe(responseStubs.upsertPreventCreateResponse.status);
            });
        });
    });

    describe("dynamicsWebApi.retrieveRequest -", function () {

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
                var dwaRequest = {
                    id: dataStubs.testEntityId,
                    collection: "tests",
                    expand: [{ property: "prop" }],
                    impersonate: dataStubs.testEntityId2,
                    ifmatch: "match"
                };

                dynamicsWebApiTest.retrieveRequest(dwaRequest, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.response200);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "?$expand=prop");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("sends the correct If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("match");
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.testEntity);
            });
        });

        describe("retrieve reference", function () {
            var responseObject;
            var request;
            beforeAll(function (done) {
                var dwaRequest = {
                    id: dataStubs.testEntityId,
                    collection: "tests",
                    select: ["ownerid/$ref"],
                    impersonate: dataStubs.testEntityId2,
                    ifmatch: "match"
                };

                dynamicsWebApiTest.retrieveRequest(dwaRequest, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.retrieveReferenceResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl + "/ownerid/$ref");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("sends the correct If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("match");
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(dataStubs.referenceResponseConverted);
            });
        });
    });

    describe("dynamicsWebApi.retrieveMultiple -", function () {

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
                dynamicsWebApiTest.retrieveMultiple("tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.multipleResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("does not send If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
            });

            it("does not send MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(responseStubs.multiple());
            });
        });

        describe("select", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, ["fullname"]);

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.multipleResponse);

                dynamicsWebApiTest.retrieveMultiple("tests", function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, ["fullname", "subject"]);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.multipleResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?$select=fullname");
                expect(request2.url).toBe(responseStubs.collectionUrl + "?$select=fullname,subject");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("does not send If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
            });

            it("does not send MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
                expect(request2.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(responseStubs.multiple());
                expect(responseObject2).toEqual(responseStubs.multiple());
            });
        });

        describe("filter", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                }, null, "name eq 'name'");

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.multipleResponse);

                dynamicsWebApiTest.retrieveMultiple("tests", function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, ["fullname"], "name eq 'name'");

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.multipleResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?$filter=name%20eq%20'name'");
                expect(request2.url).toBe(responseStubs.collectionUrl + "?$select=fullname&$filter=name%20eq%20'name'");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("does not send If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
            });

            it("does not send MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
                expect(request2.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(responseStubs.multiple());
                expect(responseObject2).toEqual(responseStubs.multiple());
            });
        });

        describe("next page link", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dynamicsWebApiTest.retrieveMultiple("tests", function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.multipleWithLinkResponse);

                dynamicsWebApiTest.retrieveMultiple(null, function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, null, null, responseStubs.multipleWithLink().oDataNextLink);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.multipleResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl);
                expect(request2.url).toBe(responseStubs.multipleWithLink().oDataNextLink);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("does not send If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
            });

            it("does not send MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
                expect(request2.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(responseStubs.multipleWithLink());
                expect(responseObject2).toEqual(responseStubs.multiple());
            });
        });
    });

    describe("dynamicsWebApi.retrieveMultipleRequest -", function () {
        var dwaRequest = {
            collection: "tests",
            select: ["name"],
            includeAnnotations: DWA.Prefer.Annotations.FormattedValue
        };

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
                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.multipleResponse);

                dwaRequest.count = true;

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest, function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.multipleWithCountResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?$select=name");
                expect(request2.url).toBe(responseStubs.collectionUrl + "?$select=name&$count=true");
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("does not send If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
                expect(request2.requestHeaders['If-Match']).toBeUndefined();
            });

            it("sends the correct Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"');
                expect(request2.requestHeaders['Prefer']).toBe('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"');
            });

            it("does not send MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
                expect(request2.requestHeaders['MSCRMCallerID']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(responseStubs.multiple());
                expect(responseObject2).toEqual(responseStubs.multipleWithCount());
            });
        });

        describe("next page link", function () {
            var responseObject;
            var responseObject2;
            var request;
            var request2;
            beforeAll(function (done) {
                dwaRequest.count = false;
                dwaRequest.impersonate = dataStubs.testEntityId2;

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.multipleWithLinkResponse);

                dynamicsWebApiTest.retrieveMultipleRequest(dwaRequest, function (object) {
                    responseObject2 = object;
                    done();
                }, function (object) {
                    responseObject2 = object;
                    done();
                }, responseStubs.multipleWithLink().oDataNextLink);

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.multipleResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.collectionUrl + "?$select=name");
                expect(request2.url).toBe(responseStubs.multipleWithLink().oDataNextLink);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('GET');
                expect(request2.method).toBe('GET');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
            });

            it("sends the correct Prefer header", function () {
                expect(request.requestHeaders['Prefer']).toBe('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"');
                expect(request2.requestHeaders['Prefer']).toBe('odata.include-annotations="' + DWA.Prefer.Annotations.FormattedValue + '"');
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
                expect(request2.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
            });

            it("returns the correct response", function () {
                expect(responseObject).toEqual(responseStubs.multipleWithLink());
                expect(responseObject2).toEqual(responseStubs.multiple());
            });
        });
    });

    describe("dynamicsWebApi.deleteRequest -", function () {

        var dwaRequest = {
            collection: "tests",
            id: dataStubs.testEntityId,
            impersonate: dataStubs.testEntityId2
        };

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
                dynamicsWebApiTest.deleteRequest(dwaRequest, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('DELETE');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
            });

            it("does not send If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBeUndefined();
            });

            it("returns the correct response", function () {
                expect(responseObject).toBe(true);
            });
        });

        describe("If-Match", function () {
            var responseObject;
            var responseObject2;
            var responseObject3;
            var request;
            var request2;
            var request3;
            beforeAll(function (done) {
                dwaRequest.ifmatch = "match";
                dynamicsWebApiTest.deleteRequest(dwaRequest, function (object) {
                    responseObject = object;
                }, function (object) {
                    responseObject = object;
                });

                request = jasmine.Ajax.requests.mostRecent();
                request.respondWith(responseStubs.basicEmptyResponseSuccess);

                dynamicsWebApiTest.deleteRequest(dwaRequest, function (object) {
                    responseObject2 = object;
                }, function (object) {
                    responseObject2 = object;
                });

                request2 = jasmine.Ajax.requests.mostRecent();
                request2.respondWith(responseStubs.upsertPreventUpdateResponse);

                dynamicsWebApiTest.deleteRequest(dwaRequest, function (object) {
                    responseObject3 = object;
                    done();
                }, function (object) {
                    responseObject3 = object;
                    done();
                });

                request3 = jasmine.Ajax.requests.mostRecent();
                request3.respondWith(responseStubs.upsertPreventCreateResponse);
            });

            it("sends the request to the right end point", function () {
                expect(request.url).toBe(responseStubs.testEntityUrl);
                expect(request2.url).toBe(responseStubs.testEntityUrl);
                expect(request3.url).toBe(responseStubs.testEntityUrl);
            });

            it("uses the correct method", function () {
                expect(request.method).toBe('DELETE');
                expect(request2.method).toBe('DELETE');
                expect(request3.method).toBe('DELETE');
            });

            it("does not send data", function () {
                expect(request.data()).toEqual({});
                expect(request2.data()).toEqual({});
                expect(request3.data()).toEqual({});
            });

            it("sends the correct MSCRMCallerID header", function () {
                expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
                expect(request2.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
                expect(request3.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
            });

            it("sends the correct If-Match header", function () {
                expect(request.requestHeaders['If-Match']).toBe("match");
                expect(request2.requestHeaders['If-Match']).toBe("match");
                expect(request3.requestHeaders['If-Match']).toBe("match");
            });

            it("returns the correct response", function () {
                expect(responseObject).toBe(true);
                expect(responseObject2).toBe(false);
                expect(responseObject3.status).toBe(404);
            });
        });
    });
});

describe("dynamicsWebApi.constructor -", function () {
    var dynamicsWebApi80 = new DynamicsWebApi();

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("webApiVersion and impersonate", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApi80.create(dataStubs.testEntity, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.createReturnId);
        });

        it("sends the request to the right end point", function () {
            expect(request.url).toBe(webApiUrl80 + "tests");
        });

        it("does not send MSCRMCallerID header", function () {
            expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
        });
    });
});

describe("dynamicsWebApi.setConfig -", function () {
    var dynamicsWebApi81 = new DynamicsWebApi();
    dynamicsWebApi81.setConfig({ webApiVersion: "8.1", impersonate: dataStubs.testEntityId2 });

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("webApiVersion and impersonate", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApi81.create(dataStubs.testEntity, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.createReturnId);
        });

        it("sends the request to the right end point", function () {
            expect(request.url).toBe(webApiUrl81 + "tests");
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
        });
    });

    describe("impersonate overriden with a request.impersonate", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApi81.retrieveMultipleRequest({ collection: "tests", impersonate: dataStubs.testEntityId3 }, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.multipleResponse);
        });

        it("sends the request to the right end point", function () {
            expect(request.url).toBe(webApiUrl81 + "tests");
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId3);
        });
    });

    describe("webApiVersion is overriden by webApiUrl", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApi81.setConfig({ webApiUrl: webApiUrl });
            dynamicsWebApi81.retrieveMultipleRequest({ collection: "tests" }, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.multipleResponse);
        });

        it("sends the request to the right end point", function () {
            expect(request.url).toBe(responseStubs.collectionUrl);
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
        });
    });
});

describe("dynamicsWebApi.initializeInstance -", function () {
    var dynamicsWebApi81 = new DynamicsWebApi();
    dynamicsWebApi81.setConfig({ webApiVersion: "8.1", impersonate: dataStubs.testEntityId2 });
    dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance();

    beforeAll(function () {
        jasmine.Ajax.install();
    });

    afterAll(function () {
        jasmine.Ajax.uninstall();
    });

    describe("current instance copied with its config", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiCopy.create(dataStubs.testEntity, "tests", function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.createReturnId);
        });

        it("sends the request to the right end point", function () {
            expect(request.url).toBe(webApiUrl81 + "tests");
        });

        it("sends the correct MSCRMCallerID header", function () {
            expect(request.requestHeaders['MSCRMCallerID']).toBe(dataStubs.testEntityId2);
        });
    });

    describe("config changed", function () {
        var responseObject;
        var request;
        beforeAll(function (done) {
            dynamicsWebApiCopy = dynamicsWebApi81.initializeInstance({ webApiVersion: "8.2" });
            dynamicsWebApiCopy.retrieveMultipleRequest({ collection: "tests" }, function (object) {
                    responseObject = object;
                    done();
                }, function (object) {
                    responseObject = object;
                    done();
                });

            request = jasmine.Ajax.requests.mostRecent();
            request.respondWith(responseStubs.multipleResponse);
        });

        it("sends the request to the right end point", function () {
            expect(request.url).toBe(responseStubs.collectionUrl);
        });

        it("does not send MSCRMCallerID header", function () {
            expect(request.requestHeaders['MSCRMCallerID']).toBeUndefined();
        });
    });
});