var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

describe('Test Suite 1', function () {
    

    it('Test 1', function () {
        expect(true).to.equal(true);
    })

    it('Test 2', function () {
        expect(1 === 1).to.be.true;
        expect(false).to.be.true;
    })
})
