import { Assertion, AssertionBuilder, AssertionResult, TestSuiteContext } from "./assertion";

export class TraceAssertion implements Assertion {
  private readonly _actual: string;
  private readonly _parameterName?: string;

  constructor(actual: string, parameterName?: string) {
    this._parameterName = parameterName;
    this._actual = actual;
  }

  check(): AssertionResult {
    return {
      valid: true,
      message: this._parameterName ? `${this._parameterName}: ${this._actual}` : `${this._actual}`
    };
  }
}

export class TraceAssertionBuilder implements AssertionBuilder {
  private readonly _actual: any;

  constructor(actual: any) {
    this._actual = actual;
  }

  build<TContext extends TestSuiteContext>(context?: TContext, parameterName?: string): Assertion {
    return new TraceAssertion(this._actual, parameterName);
  }
}

export function trace(actual: any): AssertionBuilder[] {
  return [new TraceAssertionBuilder(actual)];
}
