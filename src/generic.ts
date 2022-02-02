import { Assertion, AssertionBuilder, AssertionResult, TestSuiteContext } from "./assertion";
import { Msg } from "./msg";
import negateIf = Msg.negateIf;
import param = Msg.param;
import is = Msg.is;

export class NilAssertion<T> implements Assertion {
  private readonly _actual: T;
  private readonly _parameterName?: string;
  private readonly _not: boolean;

  constructor(actual: T, not: boolean, parameterName?: string) {
    this._parameterName = parameterName;
    this._actual = actual;
    this._not = not;
  }

  check(): AssertionResult {
    const valid = this._not ? !!this._actual : this._actual === undefined || this._actual === null;

    return {
      valid,
      message: valid
        ? `${param(this._parameterName)} is ${negateIf("nil", this._not)}`
        : `${param(this._parameterName)} is ${this._actual}. Expected: ${negateIf("nil", this._not)}`
    };
  }
}

export class EqualAssertion<T> implements Assertion {
  private readonly _actual: T;
  private readonly _expected: T;
  private readonly _parameterName?: string;
  private readonly _not: boolean;

  constructor(expected: T, actual: T, not: boolean, parameterName?: string) {
    this._parameterName = parameterName;
    this._expected = expected;
    this._actual = actual;
    this._not = not;
  }

  check(): AssertionResult {
    const valid = this._not ? this._actual !== this._expected : this._actual === this._expected;
    return {
      valid,
      message: valid
        ? `${param(this._parameterName)} ${is(this._not)} ${this._expected}`
        : `${param(this._parameterName)} is '${this._actual}'. Expected: ${negateIf(this._expected, this._not)}`
    };
  }
}

export class BaseAssertionBuilder<T> {
  protected readonly _actual: T;
  protected _parameterName?: string;
  protected _not: boolean;

  constructor(actual: T) {
    this._actual = actual;
    this._not = false;
  }

  /**
   * Check value for `null` or `undefined`
   */
  isNil(): Assertion {
    return new NilAssertion(this._actual, this._not, this._parameterName);
  }

  /**
   * Check value for equality
   */
  toEqual(expected: T): Assertion {
    return new EqualAssertion(expected, this._actual, this._not, this._parameterName);
  }
}

export type GenericAssertionFactory<T> = (x: GenericAssertionBuilder<T>) => Assertion;

export class GenericAssertionBuilder<T> extends BaseAssertionBuilder<T> implements AssertionBuilder {
  private readonly _factory: GenericAssertionFactory<T>;

  constructor(actual: T, factory: GenericAssertionFactory<T>) {
    super(actual);
    this._factory = factory;
  }

  /**
   * Negation
   */
  not(): GenericAssertionBuilder<T> {
    this._not = !this._not;
    return this;
  }

  build<TContext extends TestSuiteContext>(context?: TContext, parameterName?: string): Assertion {
    this._parameterName = parameterName;
    return this._factory(this);
  }
}

export function that<T>(
  actual: any,
  ...asserts: ((builder: GenericAssertionBuilder<T>) => Assertion)[]
): AssertionBuilder[] {
  return asserts.map(x => new GenericAssertionBuilder<T>(actual, x));
}
