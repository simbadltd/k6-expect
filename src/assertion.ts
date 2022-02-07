export interface TestSuiteContext {
  /**
   * Test suite run behavior. If true - test suite will break after first failed assertion.
   */
  breakOnFirstAssert: boolean;

  /**
   * Url postprocess logic
   */
  sanitizeUrl: (url: string) => string;

  /**
   * Check name postprocess logic
   */
  sanitizeCheckName: (name: string) => string;
}

export interface AssertionResult {
  valid: boolean;
  message: string;
}

export interface Assertion {
  check(): AssertionResult;
}

export interface AssertionBuilder {
  build<TContext extends TestSuiteContext>(context?: TContext, parameterName?: string): Assertion;
}
