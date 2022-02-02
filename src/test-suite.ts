import { check } from "k6";
import { AssertionBuilder, TestSuiteContext } from "./assertion";

export class TestSuite<TContext extends TestSuiteContext> {
  readonly context?: TContext;

  constructor(context?: TContext) {
    this.context = context;
  }

  expect(parameterName: string, assertionBuilders: AssertionBuilder[]): void {
    for (const builder of assertionBuilders) {
      const valid = this._assert(builder, parameterName);
      if (!valid && (!this.context || this.context?.breakOnFirstAssert)) {
        break;
      }
    }
  }

  ensure(assertionBuilders: AssertionBuilder[]): void {
    for (const builder of assertionBuilders) {
      const valid = this._assert(builder);
      if (!valid && (!this.context || this.context?.breakOnFirstAssert)) {
        break;
      }
    }
  }

  private _assert(builder: AssertionBuilder, parameterName?: string): boolean {
    const assertion = builder.build(this.context, parameterName);
    const result = assertion.check();

    check(null, {
      [result.message]: () => result.valid
    });

    return result.valid;
  }
}
