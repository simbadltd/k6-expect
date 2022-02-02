import { Assertion, AssertionBuilder, AssertionResult, TestSuiteContext } from "./assertion";
import { BaseAssertionBuilder } from "./generic";

export class BoolAssertion implements Assertion {
  private readonly _actual: boolean;
  private readonly _parameterName?: string;
  private readonly _not: boolean;
  private readonly _validArm: string;
  private readonly _invalidArm: string;

  constructor(actual: boolean, not: boolean, validArm: string, invalidArm: string, parameterName?: string) {
    this._parameterName = parameterName;
    this._actual = actual;
    this._not = not;
    this._validArm = validArm;
    this._invalidArm = invalidArm;
  }

  check(): AssertionResult {
    const valid = this._not ? !this._actual : this._actual;
    return {
      valid,
      message: valid
        ? this._parameterName
          ? `${this._parameterName} is ${this._validArm}`
          : `${this._validArm}`
        : this._parameterName
        ? `${this._parameterName} is ${this._invalidArm}. Expected: ${this._validArm}`
        : `${this._invalidArm}. Expected: ${this._validArm}`
    };
  }
}

export type BoolAssertionFactory = (x: BoolAssertionBuilder) => Assertion;

export class BoolAssertionBuilder extends BaseAssertionBuilder<boolean> implements AssertionBuilder {
  private readonly _factory: BoolAssertionFactory;

  constructor(actual: boolean, factory: BoolAssertionFactory) {
    super(actual);

    this._factory = factory;
  }

  /**
   * Check value for truth
   */
  toBeTruthy(valid: string = "true", invalid: string = "false"): Assertion {
    return new BoolAssertion(this._actual, false, valid, invalid, this._parameterName);
  }

  /**
   * Check value for falsity
   */
  toBeFalsy(valid: string = "false", invalid: string = "true"): Assertion {
    return new BoolAssertion(this._actual, true, valid, invalid, this._parameterName);
  }

  /**
   * Negation
   */
  not(): BaseAssertionBuilder<boolean> {
    this._not = !this._not;
    return this;
  }

  build<TContext extends TestSuiteContext>(context?: TContext, parameterName?: string): Assertion {
    this._parameterName = parameterName;
    return this._factory(this);
  }
}

export function bool(actual: any, ...asserts: BoolAssertionFactory[]): AssertionBuilder[] {
  return asserts.map(x => new BoolAssertionBuilder(actual, x));
}
