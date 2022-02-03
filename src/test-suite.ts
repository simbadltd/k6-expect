import { check } from "k6";
import { Assertion, AssertionBuilder, TestSuiteContext } from "./assertion";

export class TestSuite<TContext extends TestSuiteContext> {
  readonly context?: TContext;
  _assertions: Assertion[];

  constructor(context?: TContext) {
    this.context = context;
    this._assertions = [];
  }

  expect(assertionBuilders: AssertionBuilder[]): TestSuite<TContext>;
  expect(parameterName: string, assertionBuilders: AssertionBuilder[]): TestSuite<TContext>;
  expect(...args: any[]): TestSuite<TContext> {
    this._addAssertions(args);
    return this;
  }

  and(assertionBuilders: AssertionBuilder[]): TestSuite<TContext>;
  and(parameterName: string, assertionBuilders: AssertionBuilder[]): TestSuite<TContext>;
  and(...args: any[]): TestSuite<TContext>{
    this._addAssertions(args);
    return this;
  }

  run() {
    for (const assertion of this._assertions) {
      const result = assertion.check();
      check(null, {
        [result.message]: () => result.valid
      });

      if (!result.valid && (!this.context || this.context?.breakOnFirstAssert)) {
        break;
      }
    }
  }
  
  private _addAssertions(args: any[]){
    const hasParameterName = typeof(args[0]) == "string";
    const assertionBuilders = hasParameterName? args[1]: args[0];
    const parameterName = hasParameterName? args[0] : null;
    for (const builder of assertionBuilders) {
      this._addAssertion(builder, parameterName);
    }

    return this;
  }

  private _addAssertion(builder: AssertionBuilder, parameterName?: string): void {
    const assertion = builder.build(this.context, parameterName);
    this._assertions.push(assertion);
  }
}
