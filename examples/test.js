const { expect } = require('chai');

// these are valid chai expect statement that should not cause any linter errors
expect(true).to.be.true;
foo.should.be.true;

// this should cause unused expression error
const foo = {bar: 'baz'};
foo.bar;
