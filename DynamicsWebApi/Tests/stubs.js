//<cookie pagenumber="2" pagingcookie="<cookie page="1"><accountid last="{EF72AE29-B3DE-E611-8102-5065F38A7BF1}" first="{475B158C-541C-E511-80D3-3863BB347BA8}" /></cookie>" istracking="False" />
//<cookie pagenumber="2" pagingcookie="<cookie page="2"><accountid last="{F972AE29-B3DE-E611-8102-5065F38A7BF1}" first="{F172AE29-B3DE-E611-8102-5065F38A7BF1}" /></cookie>" istracking="False" />

var Xrm = {
    Page: {
        context: {
            getClientUrl: function () {
                return "https://testorg.crm.dynamics.com";
            }
        }
    }
}

var webApiUrl = "https://testorg.crm.dynamics.com/api/data/v8.2/";
var webApiUrl81 = "https://testorg.crm.dynamics.com/api/data/v8.1/";
var webApiUrl80 = "https://testorg.crm.dynamics.com/api/data/v8.0/";
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
    multiple: {
        "@odata.context": "context",
        value: [
            { name: "name1", subject: "subject1" },
            { name: "name2", subject: "subject2" }
        ]
    },
    multipleWithCount: {
        "@odata.context": "context",
        "@odata.count": 2,
        value: [
            { name: "name1", subject: "subject1" },
            { name: "name2", subject: "subject2" }
        ]
    },
    multipleWithLink: {
        "@odata.context": "context",
        "@odata.nextLink": webApiUrl + "tests?$select=name&$skiptoken=%3Ccookie%20pagenumber=%222%22%20pagingcookie=%22%253ccookie%2520page%253d%25221%2522%253e%253caccountid%2520last%253d%2522%257b8151925C-CDE2-E411-80DB-00155D2A68CB%257d%2522%2520first%253d%2522%257b7D51925C-CDE2-E411-80DB-00155D2A68CB%257d%2522%2520%252f%253e%253c%252fcookie%253e%22%20/%3E",
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
    collectionUrl: webApiUrl + "tests",
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
    multipleResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multiple)
    },
    multipleWithCountResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multipleWithCount)
    },
    multipleWithLinkResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multipleWithLink)
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
    },
    actionRequest: {
        Status: 3,
        OpportunityClose: {
            subject: "Won Opportunity",
            "testid@odata.bind": "tests(" + dataStubs.testEntityId + ")"
        }
    },
    actionRequestModified: {
        Status: 3,
        OpportunityClose: {
            subject: "Won Opportunity",
            "testid@odata.bind": webApiUrl + "tests(" + dataStubs.testEntityId + ")"
        }
    },
    upsertPreventCreateResponse: {
        status: 404
    },
    upsertPreventUpdateResponse: {
        status: 412
    },
    multipleWithLink: function () {
        var stub = dataStubs.multipleWithLink;
        stub.oDataContext = stub["@odata.context"];
        stub.oDataNextLink = stub["@odata.nextLink"];
        return stub;
    },
    multiple: function () {
        var stub = dataStubs.multiple;
        stub.oDataContext = stub["@odata.context"];
        return stub;

    },
    multipleWithCount: function () {
        var stub = dataStubs.multipleWithCount;
        stub.oDataContext = stub["@odata.context"];
        stub.oDataCount = stub["@odata.count"];
        return stub;
    }
};