import { check } from "k6";
import { Assertion, AssertionBuilder, TestSuiteContext } from "./assertion";

export class BrokenTestSuiteError extends Error {
  brokenChain: boolean;
  constructor() {
    super();
    this.name = this.constructor.name;
    this.brokenChain = true;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error().stack
    }
  }
}

export class TestSuite<TContext extends TestSuiteContext> {
  readonly context?: TContext;

  constructor(context?: TContext) {
    this.context = context;
  }

  expect(assertionBuilders: AssertionBuilder[]): TestSuite<TContext>;
  expect(parameterName: string, assertionBuilders: AssertionBuilder[]): TestSuite<TContext>;
  expect(...args: any[]): TestSuite<TContext> {
    this._checkAssertions(args);
    return this;
  }

  and(assertionBuilders: AssertionBuilder[]): TestSuite<TContext>;
  and(parameterName: string, assertionBuilders: AssertionBuilder[]): TestSuite<TContext>;
  and(...args: any[]): TestSuite<TContext> {
    this._checkAssertions(args);
    return this;
  }

  private _checkAssertions(args: any[]) {
    const hasParameterName = typeof (args[0]) == "string";
    const assertionBuilders: AssertionBuilder[] = hasParameterName ? args[1] : args[0];
    const parameterName = hasParameterName ? args[0] : null;
    for (const builder of assertionBuilders) {
      const assertion = builder.build(this.context, parameterName);
      this._checkAssertion(assertion);
    }

    return this;
  }

  private _checkAssertion(assertion: Assertion) {
    const result = assertion.check();
    check(null, {
      [result.message]: () => result.valid
    });

    if (!result.valid && (!this.context || this.context?.breakOnFirstAssert)) {
      throw new BrokenTestSuiteError();
    }
  }
}
