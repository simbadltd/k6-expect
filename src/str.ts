﻿import { Assertion, AssertionBuilder, AssertionResult, TestSuiteContext } from "./assertion";
import { BaseAssertionBuilder } from "./generic";
import { negateIf, param, is, does } from "./msg";

export class EmptyStrAssertion implements Assertion {
  private readonly _actual: string;
  private readonly _parameterName?: string;
  private readonly _not: boolean;

  constructor(actual: string, not: boolean, parameterName?: string) {
    this._parameterName = parameterName;
    this._actual = actual;
    this._not = not;
  }

  check(): AssertionResult {
    const valid = this._not
      ? !!this._actual && this._actual?.length > 0
      : this._actual === undefined || this._actual === null || this._actual?.length === 0;

    return {
      valid,
      message: valid
        ? `${param(this._parameterName)} ${is(this._not)} empty`
        : `${param(this._parameterName)} is expected to be ${negateIf("empty", this._not)}`
    };
  }
}

export class RegexAssertion implements Assertion {
  private readonly _actual: string;
  private readonly _pattern: string;
  private readonly _parameterName?: string;
  private readonly _not: boolean;

  constructor(actual: string, pattern: string, not: boolean, parameterName?: string) {
    this._parameterName = parameterName;
    this._actual = actual;
    this._pattern = pattern;
    this._not = not;
  }

  check(): AssertionResult {
    const pattern = this._pattern;
    const regex = new RegExp(pattern);
    const valid = this._not ? !regex.test(this._actual) : regex.test(this._actual);

    return {
      valid,
      message: `${param(this._parameterName)} ${does("matches", "match", this._not && valid)} '${pattern}' pattern`
    };
  }
}

export class ContainsAssertion implements Assertion {
  private readonly _actual: string;
  private readonly _parameterName?: string;
  private readonly _not: boolean;
  private readonly _substr: string;

  constructor(substr: string, actual: string, not: boolean, parameterName?: string) {
    this._parameterName = parameterName;
    this._actual = actual;
    this._not = not;
    this._substr = substr;
  }

  check(): AssertionResult {
    const substr = this._substr;
    const actual = this._actual;
    const isNotNull = !!actual;
    const valid = this._not ? isNotNull && actual.indexOf(substr) < 0 : isNotNull && actual.indexOf(substr) >= 0;
    const condition = this._not ? "does not contain" : "contains";
    const name = this._parameterName;

    return {
      valid,
      message: valid
        ? name
          ? `${name} ${condition} '${substr}'`
          : `${condition} '${substr}'`
        : name
        ? `${name} is expected to ${condition} '${substr}'`
        : `Expected to ${condition} '${substr}'`
    };
  }
}

export type StrAssertionFactory = (x: StrAssertionBuilder) => Assertion;

export class StrAssertionBuilder extends BaseAssertionBuilder<string> implements AssertionBuilder {
  protected readonly _factory: StrAssertionFactory;

  constructor(actual: string, factory: StrAssertionFactory) {
    super(actual);
    this._factory = factory;
  }

  /**
   * Check value for emptiness
   */
  toBeEmpty(): Assertion {
    return new EmptyStrAssertion(this._actual, this._not, this._parameterName);
  }

  /**
   * Check that value matches the pattern
   */
  regex(pattern: string): Assertion {
    return new RegexAssertion(this._actual, pattern, this._not, this._parameterName);
  }

  /**
   * Check value for occurence of a string
   */
  toContain(substr: string): Assertion {
    return new ContainsAssertion(substr, this._actual, this._not, this._parameterName);
  }

  /**
   * Negation
   */
  not(): StrAssertionBuilder {
    this._not = !this._not;
    return this;
  }

  build<TContext extends TestSuiteContext>(context?: TContext, parameterName?: string): Assertion {
    this._parameterName = parameterName;
    return this._factory(this);
  }
}

export function str(actual: any, ...asserts: ((builder: StrAssertionBuilder) => Assertion)[]): AssertionBuilder[] {
  return asserts.map(x => new StrAssertionBuilder(actual, x));
}
