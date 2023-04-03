import { Assertion, AssertionBuilder, AssertionResult, TestSuiteContext } from "./assertion";
import { BaseAssertionBuilder, EqualAssertion } from "./generic";

class CollectionEmptyAssertion<T> implements Assertion {
  private readonly _actual: T[];
  private readonly _parameterName?: string;
  private readonly _not: boolean;

  constructor(actual: T[], not: boolean, parameterName?: string) {
    this._actual = actual;
    this._parameterName = parameterName;
    this._not = not;
  }

  check(): AssertionResult {
    const valid = this._not
      ? Array.isArray(this._actual) && this._actual?.length > 0
      : !Array.isArray(this._actual) || this._actual?.length === 0;

    const expected = this._not ? "not empty" : "empty";

    return {
      valid,
      message: valid
        ? this._parameterName
          ? `${this._parameterName} is ${expected}`
          : `${expected}`
        : this._parameterName
        ? `${this._parameterName} is expected to be ${expected}`
        : `Expected to be ${expected}`
    };
  }
}

class CollectionContainsAssertion<T> implements Assertion {
  private readonly _actual: T[];
  private readonly _parameterName?: string;
  private readonly _not: boolean;
  private readonly _arg: T;

  constructor(arg: T, actual: T[], not: boolean, parameterName?: string) {
    this._actual = actual;
    this._parameterName = parameterName;
    this._not = not;
    this._arg = arg;
  }

  check(): AssertionResult {
    const valid = this._not
      ? !Array.isArray(this._actual) || !this._actual.some(x => x === this._arg)
      : Array.isArray(this._actual) && this._actual.some(x => x === this._arg);

    const condition = this._not ? "does not contain" : "contains";

    return {
      valid,
      message: valid
        ? this._parameterName
          ? `${this._parameterName} ${condition} ${this._arg}`
          : `${condition} ${this._arg}`
        : this._parameterName
        ? `${this._parameterName} is expected to ${condition} ${this._arg}`
        : `Expected to ${condition} ${this._arg}`
    };
  }
}

export type CollectionAssertionFactory<T> = (x: CollectionAssertionBuilder<T>) => Assertion;

export class CollectionAssertionBuilder<T> extends BaseAssertionBuilder<Array<T>> implements AssertionBuilder {
  private readonly _factory: CollectionAssertionFactory<T>;

  constructor(actual: T[], factory: CollectionAssertionFactory<T>) {
    super(actual);
    this._factory = factory;
  }

  /**
   * Check array for emptiness
   */
  toBeEmpty(): Assertion {
    return new CollectionEmptyAssertion(this._actual, this._not, this._parameterName);
  }

  /**
   * Check array for length
   */
  length(count: number): EqualAssertion<number> {
    return new EqualAssertion(count, this._actual?.length, this._not, this._parameterName);
  }

  /**
   * Check array for occurence of an item
   */
  toContain(arg: T): CollectionContainsAssertion<T> {
    return new CollectionContainsAssertion(arg, this._actual, this._not, this._parameterName);
  }

  /**
   * Negation
   */
  not(): CollectionAssertionBuilder<T> {
    this._not = !this._not;
    return this;
  }

  build<TContext extends TestSuiteContext>(context?: TContext, parameterName?: string): Assertion {
    this._parameterName = parameterName;
    return this._factory(this);
  }
}

export function collection<T>(
  actual: any,
  ...asserts: ((builder: CollectionAssertionBuilder<T>) => Assertion)[]
): AssertionBuilder[] {
  return asserts.map(x => new CollectionAssertionBuilder<T>(actual, x));
}
