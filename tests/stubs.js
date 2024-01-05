﻿//<cookie pagenumber="2" pagingcookie="<cookie page="1"><accountid last="{EF72AE29-B3DE-E611-8102-5065F38A7BF1}" first="{475B158C-541C-E511-80D3-3863BB347BA8}" /></cookie>" istracking="False" />
//<cookie pagenumber="2" pagingcookie="<cookie page="2"><accountid last="{F972AE29-B3DE-E611-8102-5065F38A7BF1}" first="{F172AE29-B3DE-E611-8102-5065F38A7BF1}" /></cookie>" istracking="False" />
const serverUrl = "http://testorg.crm.dynamics.com";
const portalUrl = "https://portal.com";

global.Xrm = {
    Page: {
        context: {
            getClientUrl: function () {
                return serverUrl;
            },
        },
    },
};

const webApiUrl = `${serverUrl}/api/data/v8.2/`;
const webApiUrl81 = `${serverUrl}/api/data/v8.1/`;
const webApiUrl80 = `${serverUrl}/api/data/v8.0/`;
const webApiUrl90 = `${serverUrl}/api/data/v9.0/`;
const webApiUrl91 = `${serverUrl}/api/data/v9.1/`;
const webApiUrl92 = `${serverUrl}/api/data/v9.2/`;
const searchApiUrl = `${serverUrl}/api/search/v1.0/`;
const powerPagesApiUrl = `${portalUrl}/_api/`;

const dataStubs = {
    testEntityId: "00000000-0000-0000-0000-000000000001",
    testEntityId2: "00000000-0000-0000-0000-000000000002",
    testEntityId3: "00000000-0000-0000-0000-000000000003",
    testEntity: {
        name: "record",
        subject: "test",
    },
    testEntityWithExpand: {
        name: "record",
        subject: "test",
        dwa_NavProperty: {
            key: "key",
        },
    },
    testEntityDefinition: {
        name: "record",
        subject: "test",
        MetadataId: "00000000-0000-0000-0000-000000000001",
    },
    testAttributeDefinition: {
        name: "record",
        subject: "test",
        MetadataId: "00000000-0000-0000-0000-000000000002",
    },
    testEntityAdditionalAttributes: {
        name: "record",
        subject: "test",
        oDataTest: "test",
        key_Formatted: "test",
        key_NavigationProperty: "test",
        key_LogicalName: "test",
    },
    testEntityAdditionalAttributesWithExpand: {
        name: "record",
        subject: "test",
        oDataTest: "test",
        dwa_NavProperty: {
            key: "key",
            key_Formatted: "key",
        },
        key_Formatted: "test",
        key_NavigationProperty: "test",
        key_LogicalName: "test",
    },
    testEntityFormatted: {
        name: "record",
        subject: "test",
        option: "value",
        "@odata.context": "context",
        "option@OData.Community.Display.V1.FormattedValue": "formatted",
        "option@Microsoft.Dynamics.CRM.associatednavigationproperty": "formatted",
        "option@Microsoft.Dynamics.CRM.lookuplogicalname": "formatted",
    },
    testEntityFormattedWithExpand: {
        name: "record",
        subject: "test",
        option: "value",
        dwa_NavigationProperty: {
            optionProp: "value",
            "optionProp@OData.Community.Display.V1.FormattedValue": "formatted",
        },
        "@odata.context": "context",
        "option@OData.Community.Display.V1.FormattedValue": "formatted",
        "option@Microsoft.Dynamics.CRM.associatednavigationproperty": "formatted",
        "option@Microsoft.Dynamics.CRM.lookuplogicalname": "formatted",
    },
    testEntityFormattedAliased: {
        name: "record",
        subject: "test",
        option: "value",
        "@odata.context": "context",
        "option@OData.Community.Display.V1.FormattedValue": "formatted",
        "alias_x002e_value1@OData.Community.Display.V1.FormattedValue": "formatted",
        alias_x002e_value1: "value",
    },
    testEntityFormattedAliasedNotUnique: {
        name: "record",
        subject: "test",
        option: "value",
        "@odata.context": "context",
        "option@OData.Community.Display.V1.FormattedValue": "formatted",
        "alias_x002e_value1@OData.Community.Display.V1.FormattedValue": "formatted",
        option_x002e_value1: "value",
    },
    entityDefinitionList: {
        "@odata.context": "context",
        oDataContext: "context",
        value: [
            {
                EntitySetName: "tests",
                LogicalName: "test",
                MetadataId: "9dceed2b-9513-4a14-b09e-c176a6f1d9c3",
            },
            {
                EntitySetName: "records",
                LogicalName: "record",
                MetadataId: "18eb9672-3070-478c-be5b-e0324acb1188",
            },
        ],
    },
    updatedEntity: {
        fullname: "test record",
    },
    updateSinglePropertyRequestEntity: {
        value: "test record",
    },
    referenceResponse: {
        "@odata.context": "context",
        "@odata.id": webApiUrl + "refs(00000000-0000-0000-0000-000000000002)",
    },
    referenceResponseConverted: {
        oDataContext: "context",
        id: "00000000-0000-0000-0000-000000000002",
        collection: "refs",
    },
    multiple: {
        "@odata.context": "context",
        value: [
            { name: "name1", subject: "subject1" },
            { name: "name2", subject: "subject2" },
        ],
    },
    multiple2: {
        "@odata.context": "context",
        value: [
            { name: "name3", subject: "subject3" },
            { name: "name4", subject: "subject4" },
        ],
    },
    multipleFormatted: {
        "@odata.context": "context",
        value: [
            { name: "name1", subject: "subject1", option: "value", "option@OData.Community.Display.V1.FormattedValue": "formatted" },
            { name: "name2", subject: "subject2" },
        ],
    },
    multipleWithCount: {
        "@odata.context": "context",
        "@odata.count": 2,
        value: [
            { name: "name1", subject: "subject1" },
            { name: "name2", subject: "subject2" },
        ],
    },
    multipleWithLink: {
        "@odata.context": "context",
        "@odata.nextLink":
            webApiUrl +
            "tests?$select=name&$skiptoken=%3Ccookie%20pagenumber=%222%22%20pagingcookie=%22%253ccookie%2520page%253d%25221%2522%253e%253caccountid%2520last%253d%2522%257b8151925C-CDE2-E411-80DB-00155D2A68CB%257d%2522%2520first%253d%2522%257b7D51925C-CDE2-E411-80DB-00155D2A68CB%257d%2522%2520%252f%253e%253c%252fcookie%253e%22%20/%3E",
        value: [
            { name: "name1", subject: "subject1" },
            { name: "name2", subject: "subject2" },
        ],
    },
    multipleWithLinkAndCount: {
        "@odata.context": "context",
        "@odata.count": 10,
        "@odata.nextLink":
            webApiUrl +
            "tests?$select=name&$count=true&$skiptoken=%3Ccookie%20pagenumber=%222%22%20pagingcookie=%22%253ccookie%2520page%253d%25221%2522%253e%253caccountid%2520last%253d%2522%257b8151925C-CDE2-E411-80DB-00155D2A68CB%257d%2522%2520first%253d%2522%257b7D51925C-CDE2-E411-80DB-00155D2A68CB%257d%2522%2520%252f%253e%253c%252fcookie%253e%22%20/%3E",
        value: [
            { name: "name1", subject: "subject1" },
            { name: "name2", subject: "subject2" },
        ],
    },
    multipleWithDeltaLink: {
        "@odata.context": "context",
        "@odata.deltaLink": webApiUrl + "tests?$select=name&$deltatoken=919042%2108%2f22%2f2017%2008%3a10%3a44",
        value: [
            { name: "name1", subject: "subject1" },
            { name: "name2", subject: "subject2" },
        ],
    },
    downloadFileChunk1: {
        "@odata.context": "context",
        value: Buffer.from("Welcome to Dyna", "utf-8").toString("base64"),
    },
    downloadFileChunk2: {
        "@odata.context": "context",
        value: Buffer.from("micsWebApi!", "utf-8").toString("base64"),
    },
    suggestMultiple: {
        querycontext: null,
        value: [
            {
                text: "{crmhit}test{/crmhit}",
                document: {
                    "@search.entityname": "lead",
                    name: "test",
                },
            },
            {
                text: "{crmhit}test{/crmhit}2",
                document: {
                    "@search.entityname": "lead",
                    name: "test2",
                },
            },
        ],
    },
    searchMultiple: {
        querycontext: null,
        value: [
            {
                "@search.score": 25,
                "@search.highlights": {
                    name: ["{crmhit}test{/crmhit}"],
                },
                name: "name1",
                statecode: ["Active"],
            },
            {
                "@search.score": 22,
                "@search.highlights": {
                    name: ["{crmhit}test{/crmhit}"],
                },
                name: "name2",
                statecode: ["Active"],
            },
        ],
        facets: {},
        totalrecordcount: -1,
    },
    autocompleteResult: {
        querycontext: null,
        value: "{crmhit}test{/crmhit}",
    },
    error: {
        error: {
            code: "error_code",
            message: "ERROR!"
        }
    },
    batch:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n\n" +
        "GET {0} HTTP/1.1\n" +
        "Accept: application/json\n" +
        "--dwa_batch_XXX--",
    batchRetrieveMultipleCreateRetrieveMultiple:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "records HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "morerecords HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchRetrieveMultipleUpdateRetrieveMultiple:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "PATCH " +
        webApiUrl +
        "records(00000000-0000-0000-0000-000000000002) HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "If-Match: *\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "morerecords HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchUpsertUpsertUpsertWithAlternateKeys:
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "PATCH " +
        webApiUrl +
        "records(key='key1') HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100002\n" +
        "\n" +
        "PATCH " +
        webApiUrl +
        "records(key='key2') HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100003\n" +
        "\n" +
        "PATCH " +
        webApiUrl +
        "records(key='key3') HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchUpdateDelete:
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "PATCH " +
        webApiUrl +
        "records(00000000-0000-0000-0000-000000000002) HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "If-Match: *\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100002\n" +
        "\n" +
        "DELETE " +
        webApiUrl +
        "records(00000000-0000-0000-0000-000000000002)/firstname HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchCreateContentID:
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 1\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "records HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "POST $1/test_property HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test1","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchCreateContentIDNoCollection:
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 1\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "records HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "POST $1 HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test1","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchCreateContentIDURLReplace:
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 1\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "records HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "POST $1 HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test1","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchCreateContentIDPayload:
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 1\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "records HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test1","lastname":"Batch!","prop@odata.bind":"$1"}\n' +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchCreateContentIDPayloadNonAtomic:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "records HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test1","lastname":"Batch!","prop@odata.bind":"$1"}\n' +
        "\n" +
        "--dwa_batch_XXX--",
    batchCreateContentIDPayloadNonAtomicMixed:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "records HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        '{"firstname":"Test1","lastname":"Batch!","prop@odata.bind":"$1"}\n' +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchCreateContentIDPayloadNonAtomicCustomHeaders:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "records HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "my-header: success!\n" +
        "custom: header\n" +
        "\n" +
        '{"firstname":"Test","lastname":"Batch!"}\n' +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "POST " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "my-header: success!\n" +
        "\n" +
        '{"firstname":"Test1","lastname":"Batch!","prop@odata.bind":"$1"}\n' +
        "\n" +
        "--dwa_batch_XXX--",
    batchRetrieveMultipleDeleteRetrieveMultiple:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "DELETE " +
        webApiUrl +
        "records(00000000-0000-0000-0000-000000000002) HTTP/1.1\n" +
        "Content-Type: application/json\n" +
        "\n" +
        "--changeset_XXX--\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "morerecords HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchRetrieveMultipleCountRetrieveMultiple:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "records/$count HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "morerecords HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchRetrieveMultipleCountFilteredRetrieveMultiple:
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "tests HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "records?$filter=statecode%20eq%200&$count=true HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "\n" +
        "GET " +
        webApiUrl +
        "morerecords HTTP/1.1\n" +
        "Accept: application/json\n" +
        "\n" +
        "--dwa_batch_XXX--",
    batchErrorChangeSet:
        "--dwa_batch_XXX\n" +
        "Content-Type: multipart/mixed;boundary=changeset_XXX\n" +
        "\n" +
        "--changeset_XXX\n" +
        "Content-Type: application/http\n" +
        "Content-Transfer-Encoding: binary\n" +
        "Content-ID: 100001\n" +
        "\n" +
        "HTTP/1.1 400 Bad Request\n" +
        "REQ_ID: 5fe339e5-c75e-4dad-9597-b257ebce666b\n" +
        "Content-Type: application/json\n" +
        "OData-Version: 4.0\n" +
        "\n" +
        '{"error":{"code":"0x0","message":"error"}}\n' +
        "\n" +
        "--changeset_XXX\n" +
        "--dwa_batch_XXX--",
    fetchXmls: {
        cookiePage1:
            "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25221%2522%253E%253Caccountid%2520last%253D%2522%257BEF72AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257B475B158C-541C-E511-80D3-3863BB347BA8%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
        cookiePage2:
            "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25222%2522%253E%253Caccountid%2520last%253D%2522%257BF972AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257BF172AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
        fetchXml:
            '<fetch mapping="logical" count="5">' +
            '<entity name="account">' +
            '<attribute name="accountid"/>' +
            '<attribute name="name"/>' +
            "</entity>" +
            "</fetch>",
        fetchXmlTop:
            '<fetch mapping="logical" top="5">' +
            '<entity name="account">' +
            '<attribute name="accountid"/>' +
            '<attribute name="name"/>' +
            "</entity>" +
            "</fetch>",
        fetchXml1:
            '<fetch page="1" mapping="logical" count="5">' +
            '<entity name="account">' +
            '<attribute name="accountid"/>' +
            '<attribute name="name"/>' +
            "</entity>" +
            "</fetch>",
        fetchXml2cookie:
            '<fetch page="2" paging-cookie="&lt;cookie page=&quot;1&quot;&gt;&lt;accountid last=&quot;{EF72AE29-B3DE-E611-8102-5065F38A7BF1}&quot; first=&quot;{475B158C-541C-E511-80D3-3863BB347BA8}&quot; /&gt;&lt;/cookie&gt;" mapping="logical" count="5">' +
            '<entity name="account">' +
            '<attribute name="accountid"/>' +
            '<attribute name="name"/>' +
            "</entity>" +
            "</fetch>",
        fetchXml2:
            '<fetch page="2" mapping="logical" count="5">' +
            '<entity name="account">' +
            '<attribute name="accountid"/>' +
            '<attribute name="name"/>' +
            "</entity>" +
            "</fetch>",
        fetchXmlResponsePage1Cookie: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie":
                "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25221%2522%253E%253Caccountid%2520last%253D%2522%257BEF72AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257B475B158C-541C-E511-80D3-3863BB347BA8%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" },
            ],
        },
        fetchXmlResponsePage2Cookie: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie":
                "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25222%2522%253E%253Caccountid%2520last%253D%2522%257BF972AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257BF172AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" },
            ],
        },
        fetchXmlResponsePage2NoCookie: {
            "@odata.context": "context",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" },
            ],
        },
        fetchXmlResponsePage1: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie":
                "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%2522%2520istracking%253D%2522False%2522%2520/%253E",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" },
            ],
        },
        fetchXmlResultPage1Cookie: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie":
                "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25221%2522%253E%253Caccountid%2520last%253D%2522%257BEF72AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257B475B158C-541C-E511-80D3-3863BB347BA8%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
            oDataContext: "context",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" },
            ],
            PagingInfo: {
                cookie: "&lt;cookie page=&quot;1&quot;&gt;&lt;accountid last=&quot;{EF72AE29-B3DE-E611-8102-5065F38A7BF1}&quot; first=&quot;{475B158C-541C-E511-80D3-3863BB347BA8}&quot; /&gt;&lt;/cookie&gt;",
                page: 1,
                nextPage: 2,
            },
        },
        fetchXmlResultPage2Cookie: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie":
                "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%253Ccookie%2520page%253D%25222%2522%253E%253Caccountid%2520last%253D%2522%257BF972AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520first%253D%2522%257BF172AE29-B3DE-E611-8102-5065F38A7BF1%257D%2522%2520/%253E%253C/cookie%253E%2522%2520istracking%253D%2522False%2522%2520/%253E",
            oDataContext: "context",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" },
            ],
            PagingInfo: {
                cookie: "&lt;cookie page=&quot;2&quot;&gt;&lt;accountid last=&quot;{F972AE29-B3DE-E611-8102-5065F38A7BF1}&quot; first=&quot;{F172AE29-B3DE-E611-8102-5065F38A7BF1}&quot; /&gt;&lt;/cookie&gt;",
                page: 2,
                nextPage: 3,
            },
        },
        fetchXmlResultPage1: {
            "@odata.context": "context",
            "@Microsoft.Dynamics.CRM.fetchxmlpagingcookie":
                "%253Ccookie%2520pagenumber%253D%25222%2522%2520pagingcookie%253D%2522%2522%2520istracking%253D%2522False%2522%2520/%253E",
            oDataContext: "context",
            value: [
                { name: "name1", subject: "subject1" },
                { name: "name2", subject: "subject2" },
            ],
            PagingInfo: {
                cookie: "",
                page: 1,
                nextPage: 2,
            },
        },
    },
    defaultResponseHeaders: { "content-type": "application/json; odata.metadata=minimal" },
    defaultTextPlainResponseHeaders: { "content-type": "text/plain" },
};

var responseStubs = {
    webApiUrl: webApiUrl,
    collectionUrl: "/tests",
    collection: "tests",
    searchUrl: "/query",
    suggestUrl: "/suggest",
    autocompleteUrl: "/autocomplete",
    createReturnId: {
        status: 204,
        responseHeaders: {
            "OData-EntityId": webApiUrl + "tests(" + dataStubs.testEntityId + ")",
        },
    },
    createAttributeReturnId: {
        status: 204,
        responseHeaders: {
            "OData-EntityId": webApiUrl + "EntityDefinitions(" + dataStubs.testEntityId + ")/Attributes(" + dataStubs.testEntityId2 + ")",
        },
    },
    createReturnRepresentation: {
        status: 201,
        responseText: JSON.stringify(dataStubs.testEntity),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    testEntityUrl: "/tests(" + dataStubs.testEntityId + ")",
    entityDefinitionsUrl: "/EntityDefinitions",
    entityDefinitionsIdUrl: "/EntityDefinitions(" + dataStubs.testEntityId + ")",
    relationshipDefinitionsUrl: "/RelationshipDefinitions",
    relationshipDefinitionsIdUrl: "/RelationshipDefinitions(" + dataStubs.testEntityId + ")",
    globalOptionSetDefinitionsUrl: "/GlobalOptionSetDefinitions",
    globalOptionSetDefinitionsIdUrl: "/GlobalOptionSetDefinitions(" + dataStubs.testEntityId + ")",
    basicEmptyResponseSuccess: {
        status: 204,
    },
    response200: {
        status: 200,
        responseText: JSON.stringify(dataStubs.testEntity),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    responseFormatted200: {
        status: 200,
        responseText: JSON.stringify(dataStubs.testEntityFormatted),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    responseFormattedWithExpand200: {
        status: 200,
        responseText: JSON.stringify(dataStubs.testEntityFormattedWithExpand),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    responseFormattedAliased200: {
        status: 200,
        responseText: JSON.stringify(dataStubs.testEntityFormattedAliased),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    responseFormattedAliasedNotUnique200: {
        status: 200,
        responseText: JSON.stringify(dataStubs.testEntityFormattedAliasedNotUnique),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    responseEntityDefinitions: {
        status: 200,
        responseText: JSON.stringify(dataStubs.entityDefinitionList),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    retrieveReferenceResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.referenceResponse),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    updateReturnRepresentation: {
        status: 200,
        responseText: JSON.stringify(dataStubs.updatedEntity),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    countBasic: {
        status: 200,
        responseText: "20",
        responseHeaders: dataStubs.defaultTextPlainResponseHeaders,
    },
    multipleResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multiple),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    multipleFormattedResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multipleFormatted),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    multipleWithCountResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multipleWithCount),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    multipleWithLinkResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multipleWithLink),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    multipleWithLinkAndCountResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multipleWithLinkAndCount),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    multipleWithDeltaLinkResponse: {
        status: 200,
        responseText: JSON.stringify(dataStubs.multipleWithDeltaLink),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    uploadFileBeginResponse: {
        status: 200,
        responseHeaders: {
            "x-ms-chunk-size": 15,
            "Accept-Ranges": "bytes",
            Location: webApiUrl + "tests(904020fa-6213-43d4-a26a-5347b70095e8)/dwa_file?Token",
        },
    },
    uploadFile1stResponse: {
        status: 206,
    },
    downloadFileResponseChunk1: {
        status: 206,
        responseHeaders: {
            "Content-Disposition": 'attachment; filename="sample.txt"',
            "x-ms-file-name": "sample.txt",
            "x-ms-file-size": 26,
        },
        responseText: JSON.stringify(dataStubs.downloadFileChunk1),
    },
    downloadFileResponseChunk2: {
        status: 206,
        responseHeaders: {
            "Content-Disposition": 'attachment; filename="sample.txt"',
            "x-ms-file-name": "sample.txt",
            "x-ms-file-size": 26,
        },
        responseText: JSON.stringify(dataStubs.downloadFileChunk2),
    },
    batch: {
        status: 200,
        responseText:
            "--batchresponse_904020fa-6213-43d4-a26a-5347b70095e8\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n\r\n" +
            "HTTP/ 1.1 200 OK\r\n" +
            "Access-Control-Expose-Headers: Preference-Applied, OData-EntityId, Location, ETag, OData-Version, Content-Encoding, Transfer-Encoding, Content-Length, Retry-After\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n\r\n" +
            JSON.stringify(dataStubs.multiple) +
            "\r\n" +
            "--batchresponse_904020fa-6213-43d4-a26a-5347b70095e8--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeaders,
    },
    batchRetrieveMultipleCreateRetrieveMultiple: {
        status: 200,
        responseText:
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: multipart/mixed; boundary=changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100001" +
            "HTTP/1.1 204 No Content\r\n" +
            "OData-Version: 4.0\r\n" +
            "Location: https://url.com/api/data/v8.2/tests(" +
            dataStubs.testEntityId +
            ")\r\n" +
            "OData-EntityId: https://url.com/api/data/v8.2/tests(" +
            dataStubs.testEntityId +
            ")\r\n" +
            "\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd--\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple2) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeaders,
    },
    batchError: {
        status: 400,
        responseText:
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: multipart/mixed; boundary=changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100001" +
            "HTTP/1.1 400 Bad Request\r\n" +
            "OData-Version: 4.0\r\n" +
            "REQ_ID: 5fe339e5-c75e-4dad-9597-b257ebce666b\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "\r\n" +
            '{"error":{"code":"0x0","message":"error","innererror":{"message":"error","type":"Microsoft.Crm.CrmHttpException","stacktrace":"stack"}}}\r\n' +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeaders,
    },
    batchRetrieveMultipleUpdateRetrieveMultiple: {
        status: 200,
        responseText:
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: multipart/mixed; boundary=changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100001" +
            "HTTP/1.1 204 No Content\r\n" +
            "OData-Version: 4.0\r\n" +
            "Location: https://url.com/api/data/v8.2/tests(" +
            dataStubs.testEntityId +
            ")\r\n" +
            "OData-EntityId: https://url.com/api/data/v8.2/tests(" +
            dataStubs.testEntityId +
            ")\r\n" +
            "\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd--\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple2) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeaders,
    },
    batchUpsertUpsertUpsertWithAlternateKeys: {
        status: 200,
        responseText:
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: multipart/mixed; boundary=changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100001" +
            "HTTP/1.1 204 No Content\r\n" +
            "OData-Version: 4.0\r\n" +
            "Location: https://url.com/api/data/v8.2/tests(key='key1')\r\n" +
            "OData-EntityId: https://url.com/api/data/v8.2/tests(key='key1')\r\n" +
            "\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100002" +
            "HTTP/1.1 204 No Content\r\n" +
            "OData-Version: 4.0\r\n" +
            "Location: https://url.com/api/data/v8.2/tests(key='key2')\r\n" +
            "OData-EntityId: https://url.com/api/data/v8.2/tests(key='key2')\r\n" +
            "\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100003" +
            "HTTP/1.1 204 No Content\r\n" +
            "OData-Version: 4.0\r\n" +
            "Location: https://url.com/api/data/v8.2/tests(key='key3')\r\n" +
            "OData-EntityId: https://url.com/api/data/v8.2/tests(key='key3')\r\n" +
            "\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd--\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeaders,
    },
    batchUpdateDelete: {
        status: 200,
        responseText:
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: multipart/mixed; boundary=changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100001" +
            "HTTP/1.1 204 No Content\r\n" +
            "OData-Version: 4.0\r\n" +
            "Location: https://url.com/api/data/v8.2/tests(" +
            dataStubs.testEntityId +
            ")\r\n" +
            "OData-EntityId: https://url.com/api/data/v8.2/tests(" +
            dataStubs.testEntityId +
            ")\r\n" +
            "\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100002" +
            "HTTP/1.1 204 No Content\r\n" +
            "OData-Version: 4.0\r\n" +
            "\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd--\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeaders,
    },
    //batchCreateContentID: {
    //    status: 200,
    //    responseText:
    //        '--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n' +
    //        'Content-Type: multipart/mixed; boundary=changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n' +
    //        '\r\n' +
    //        '--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n' +
    //        'Content-Type: application/http\r\n' +
    //        'Content-Transfer-Encoding: binary\r\n' +
    //        'Content-ID: 100001' +

    //        'HTTP/1.1 204 No Content\r\n' +
    //        'OData-Version: 4.0\r\n' +
    //        'Location: https://url.com/api/data/v8.2/tests(' + dataStubs.testEntityId + ')\r\n' +
    //        'OData-EntityId: https://url.com/api/data/v8.2/tests(' + dataStubs.testEntityId + ')\r\n' +
    //        '\r\n' +
    //        '\r\n' +
    //        '--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n' +
    //        'Content-Type: application/http\r\n' +
    //        'Content-Transfer-Encoding: binary\r\n' +
    //        'Content-ID: 100002' +

    //        'HTTP/1.1 204 No Content\r\n' +
    //        'OData-Version: 4.0\r\n' +
    //        '\r\n' +
    //        '\r\n' +
    //        '--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd--\r\n' +
    //        '--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--'
    //},
    batchRetrieveMultipleDeleteRetrieveMultiple: {
        status: 200,
        responseText:
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: multipart/mixed; boundary=changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "Content-ID: 100001" +
            "HTTP/1.1 204 No Content\r\n" +
            "OData-Version: 4.0\r\n" +
            "\r\n" +
            "\r\n" +
            "--changesetresponse_08f5ebfd-5cee-4b64-bc51-ee16c02d47bd--\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple2) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeadersseHeaders,
    },
    batchRetrieveMultipleCountRetrieveMultiple: {
        status: 200,
        responseText:
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: text/plain\r\n" +
            "OData-Version: 4.0\r\n" +
            "\r\n" +
            "5\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple2) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeadersseHeaders,
    },
    batchRetrieveMultipleCountFilteredRetrieveMultiple: {
        status: 200,
        responseText:
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            "\r\n" +
            JSON.stringify(dataStubs.multipleWithCount) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae\r\n" +
            "Content-Type: application/http\r\n" +
            "Content-Transfer-Encoding: binary\r\n" +
            "HTTP/1.1 200 OK\r\n" +
            "Content-Type: application/json; odata.metadata=minimal\r\n" +
            "OData-Version: 4.0\r\n" +
            JSON.stringify(dataStubs.multiple2) +
            "\r\n" +
            "--batchresponse_8b19b76e-c553-4c4c-af9d-b5521bfda1ae--",
        responseHeaders: dataStubs.defaultTextPlainResponseHeadersseHeaders,
    },
    fetchXmlResponsePage1Cookie: {
        status: 200,
        responseText: JSON.stringify(dataStubs.fetchXmls.fetchXmlResponsePage1Cookie),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    fetchXmlResponsePage2Cookie: {
        status: 200,
        responseText: JSON.stringify(dataStubs.fetchXmls.fetchXmlResponsePage2Cookie),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    fetchXmlResponsePage2NoCookie: {
        status: 200,
        responseText: JSON.stringify(dataStubs.fetchXmls.fetchXmlResponsePage2NoCookie),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    fetchXmlResponsePage1: {
        status: 200,
        responseText: JSON.stringify(dataStubs.fetchXmls.fetchXmlResponsePage1),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    actionRequest: {
        Status: 3,
        OpportunityClose: {
            subject: "Won Opportunity",
            "testid@odata.bind": "tests(" + dataStubs.testEntityId + ")",
        },
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    actionRequestModified: {
        Status: 3,
        OpportunityClose: {
            subject: "Won Opportunity",
            "testid@odata.bind": "/tests(" + dataStubs.testEntityId + ")",
        },
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    upsertPreventCreateResponse: {
        status: 404,
        responseHeaders: { dummy: "header" },
        responseText: JSON.stringify({
            error: { message: "message" },
        }),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    upsertPreventUpdateResponse: {
        status: 412,
        responseText: JSON.stringify({
            error: { message: "message" },
        }),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    responseFormattedEntity: function () {
        var stub = dataStubs.testEntityFormatted;
        stub.oDataContext = stub["@odata.context"];
        stub.option_Formatted = stub["option@OData.Community.Display.V1.FormattedValue"];
        stub.option_NavigationProperty = stub["option@Microsoft.Dynamics.CRM.associatednavigationproperty"];
        stub.option_LogicalName = stub["option@Microsoft.Dynamics.CRM.lookuplogicalname"];
        return stub;
    },
    responseFormattedEntityWithExpand: function () {
        var stub = dataStubs.testEntityFormattedWithExpand;
        stub.oDataContext = stub["@odata.context"];
        stub.dwa_NavigationProperty.optionProp_Formatted = stub.dwa_NavigationProperty["optionProp@OData.Community.Display.V1.FormattedValue"];
        stub.option_Formatted = stub["option@OData.Community.Display.V1.FormattedValue"];
        stub.option_NavigationProperty = stub["option@Microsoft.Dynamics.CRM.associatednavigationproperty"];
        stub.option_LogicalName = stub["option@Microsoft.Dynamics.CRM.lookuplogicalname"];
        return stub;
    },
    responseFormattedAliasedEntity: function () {
        var stub = dataStubs.testEntityFormattedAliased;
        stub.oDataContext = stub["@odata.context"];
        stub.option_Formatted = stub["option@OData.Community.Display.V1.FormattedValue"];
        stub.alias_x002e_value1_Formatted = stub["alias_x002e_value1@OData.Community.Display.V1.FormattedValue"];
        stub.alias = {
            _dwaType: "alias",
            value1: stub["alias_x002e_value1"],
            value1_Formatted: stub["alias_x002e_value1@OData.Community.Display.V1.FormattedValue"],
            "value1@OData.Community.Display.V1.FormattedValue": stub["alias_x002e_value1@OData.Community.Display.V1.FormattedValue"],
        };
        return stub;
    },
    multipleWithLink: function () {
        var stub = dataStubs.multipleWithLink;
        stub.oDataContext = stub["@odata.context"];
        stub.oDataNextLink = stub["@odata.nextLink"];
        return stub;
    },
    multipleWithLinkAndCount: function () {
        var stub = dataStubs.multipleWithLinkAndCount;
        stub.oDataContext = stub["@odata.context"];
        stub.oDataNextLink = stub["@odata.nextLink"];
        stub.oDataCount = stub["@odata.count"];
        return stub;
    },
    multipleWithDeltaLink: function () {
        var stub = dataStubs.multipleWithDeltaLink;
        stub.oDataContext = stub["@odata.context"];
        stub.oDataDeltaLink = stub["@odata.deltaLink"];
        return stub;
    },
    multiple: function () {
        var stub = dataStubs.multiple;
        stub.oDataContext = stub["@odata.context"];
        return stub;
    },
    multiple2: function () {
        var stub = dataStubs.multiple2;
        stub.oDataContext = stub["@odata.context"];
        return stub;
    },
    multipleFormatted: function () {
        var stub = dataStubs.multipleFormatted;
        stub.oDataContext = stub["@odata.context"];
        stub.value[0].option_Formatted = stub.value[0]["option@OData.Community.Display.V1.FormattedValue"];
        return stub;
    },
    multipleWithCount: function () {
        var stub = dataStubs.multipleWithCount;
        stub.oDataContext = stub["@odata.context"];
        stub.oDataCount = stub["@odata.count"];
        return stub;
    },
    xmlResponse: {
        status: 200,
        responseText: `<?xml version="1.0" encoding="utf-8"?><edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx"></edmx:Edmx>`,
        responseHeaders: {
            "Content-Type": "application/xml",
        },
    },
    searchMultiple: {
        status: 200,
        responseText: JSON.stringify(dataStubs.searchMultiple),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    suggestMultiple: {
        status: 200,
        responseText: JSON.stringify(dataStubs.suggestMultiple),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    autocompleteResult: {
        status: 200,
        responseText: JSON.stringify(dataStubs.autocompleteResult),
        responseHeaders: dataStubs.defaultResponseHeaders,
    },
    errorResponse: {
        status: 400,
        responseText: JSON.stringify(dataStubs.error),
        responseHeaders: dataStubs.defaultResponseHeaders
    }
};

var utils = {
    toTypedArray: function (b) {
        return new Uint8Array(b.buffer, b.byteOffset, b.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    },
};

module.exports = {
    Xrm: Xrm,
    data: dataStubs,
    responses: responseStubs,
    webApiUrl: webApiUrl,
    webApiUrl81: webApiUrl81,
    webApiUrl80: webApiUrl80,
    webApiUrl90: webApiUrl90,
    webApiUrl91: webApiUrl91,
    webApiUrl92: webApiUrl92,
    utils: utils,
    searchApiUrl: searchApiUrl,
    serverUrl: serverUrl,
    powerPagesApiUrl: powerPagesApiUrl,
    portalUrl: portalUrl,
};
