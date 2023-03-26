import { expect } from "chai";
import nock from "nock";
import * as mocks from "./stubs";

import { DynamicsWebApi, SearchRequestQuery } from "../src/dynamics-web-api";

const dynamicsWebApiTest = new DynamicsWebApi({
	dataApi: {
		version: "8.2",
	},
});

describe("dynamicsWebApi.search -", () => {
	describe("basic", () => {
		let scope;
		const searchQuery: SearchRequestQuery = {
			search: "test",
		};

		before(() => {
			const response = mocks.responses.searchMultiple;
			scope = nock(mocks.searchApiUrl)
				.post(mocks.responses.searchUrl, <any>searchQuery)
				.reply(response.status, response.responseText, response.responseHeaders);
		});

		after(() => {
			nock.cleanAll();
		});

		it("returns a correct response", async () => {
			try {
				const object = await dynamicsWebApiTest.search({
					query: searchQuery,
				});
				expect(object).to.deep.equal(mocks.data.searchMultiple);
			} catch (object) {
				console.error(object);
			}
		});

		it("all requests have been made", function () {
			expect(scope.isDone()).to.be.true;
		});
	});
});
