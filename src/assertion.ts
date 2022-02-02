export interface TestSuiteContext {
  breakOnFirstAssert: boolean;
  sanitizeUrl: (url: string) => string;
}

export interface AssertionResult {
  valid: boolean;
  message: string;
}

export interface Assertion {
  check(): AssertionResult;
}

export interface AssertionBuilder {
  build(context: TestSuiteContext, parameterName?: string): Assertion;
}

export const DEFAULT_TEST_SUITE_CONTEXT: TestSuiteContext = {
  sanitizeUrl: url => url,
  breakOnFirstAssert: true
};