import { expect } from 'chai';

// Define interfaces and types (TypeScript-specific features)
interface TestInterface {
  prop: string;
  method(): boolean;
}

type TestType = {
  value: number;
};

// Class with TypeScript features
class TestClass implements TestInterface {
  prop: string;
  private value: TestType;

  constructor() {
    this.prop = 'test';
    this.value = { value: 42 };
  }

  method(): boolean {
    return true;
  }
}

// Create an instance
const testInstance = new TestClass();

// These are valid chai expect statements that should not cause any linter errors
expect(testInstance.method()).to.be.true;

// These should cause unused expression errors
testInstance.prop;
(testInstance.prop === 'test');
