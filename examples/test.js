const { expect } = require('chai');

// this is a valid chai expect statement that should not cause any linter errors
expect(true).to.be.true;

// this should cause unused expression error
const foo = {bar: 'baz'};
foo.bar;
