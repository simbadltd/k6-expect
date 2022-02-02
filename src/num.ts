import { Assertion, AssertionBuilder, AssertionResult, TestSuiteContext } from "./assertion";
import { BaseAssertionBuilder, EqualAssertion } from "./generic";
import { Msg } from "./msg";
import negateIf = Msg.negateIf;
import param = Msg.param;
import is = Msg.is;

export class BetweenAssertion implements Assertion {
  private readonly _actual: number;
  private readonly _from: number;
  private readonly _to: number;
  private readonly _parameterName?: string;
  private readonly _not: boolean;

  constructor(from: number, to: number, actual: number, not: boolean, parameterName?: string) {
    this._parameterName = parameterName;
    this._from = from;
    this._to = to;
    this._actual = actual;
    this._not = not;
  }

  check(): AssertionResult {
    const valid = this._not ?
      this._actual < this._from || this._actual > this._to :
      this._actual >= this._from && this._actual <= this._to;

    const fromTo = `${this._from}..${this._to}`;
    return {
      valid,
      message: valid ?
        `${param(this._parameterName)} ${Msg.is(this._not)} between ${fromTo}` :
        `${param(this._parameterName)} is ${this._actual}. Expected: ${negateIf("between", this._not)} ${fromTo}`
    };
  }
}

abstract class BoundaryAssertion implements Assertion {
  protected readonly _actual: number;
  protected readonly _boundary: number;
  protected readonly _parameterName?: string;
  protected readonly _not: boolean;

  constructor(boundary: number, actual: number, not: boolean, parameterName?: string) {
    this._boundary = boundary;
    this._actual = actual;
    this._parameterName = parameterName;
    this._not = not;
  }

  protected abstract _check(): boolean;

  protected abstract _condition(): string;

  check(): AssertionResult {
    const valid = this._check();
    const condition = this._condition();
    return {
      valid,
      message: valid ?
        `${param(this._parameterName)} ${is(this._not)} ${condition}} ${this._boundary}` :
        `${param(this._parameterName)} is ${this._actual}. Expected: ${negateIf(condition, this._not)}} ${this._boundary}`
    };
  }
}

export class GreaterThanAssertion extends BoundaryAssertion {
  protected _check(): boolean {
    return this._not ? this._actual <= this._boundary : this._actual > this._boundary;
  }

  protected _condition(): string {
    return "greater than";
  }
}

export class GreaterThanOrEqlAssertion extends BoundaryAssertion {
  protected _check(): boolean {
    return this._not ? this._actual < this._boundary : this._actual >= this._boundary;
  }

  protected _condition(): string {
    return "greater than or equal";
  }
}

export class LessThanAssertion extends BoundaryAssertion {
  protected _check(): boolean {
    return this._not ? this._actual >= this._boundary : this._actual < this._boundary;
  }

  protected _condition(): string {
    return "less than";
  }
}

export class LessThanOrEqualAssertion extends BoundaryAssertion {
  protected _check(): boolean {
    return this._not ? this._actual > this._boundary : this._actual <= this._boundary;
  }

  protected _condition(): string {
    return "less than or equal";
  }
}

export type NumAssertionFactory = (x: NumAssertionBuilder) => Assertion;

export class NumAssertionBuilder extends BaseAssertionBuilder<number> implements AssertionBuilder {
  private readonly _factory: NumAssertionFactory;

  constructor(actual: number, factory: NumAssertionFactory) {
    super(actual);
    this._factory = factory;
  }

  zero(): Assertion {
    return new EqualAssertion(0, this._actual, this._not, this._parameterName);
  }

  between(from: number, to: number): Assertion {
    return new BetweenAssertion(from, to, this._actual, this._not, this._parameterName);
  }

  greaterThan(boundary: number): Assertion {
    return new GreaterThanAssertion(boundary, this._actual, this._not, this._parameterName);
  }

  greaterThanOrEql(boundary: number): Assertion {
    return new GreaterThanOrEqlAssertion(boundary, this._actual, this._not, this._parameterName);
  }

  lessThan(boundary: number): Assertion {
    return new LessThanAssertion(boundary, this._actual, this._not, this._parameterName);
  }

  lessThanOrEql(boundary: number): Assertion {
    return new LessThanOrEqualAssertion(boundary, this._actual, this._not, this._parameterName);
  }

  not(): NumAssertionBuilder {
    this._not = !this._not;
    return this;
  }

  build(context: TestSuiteContext, parameterName?: string): Assertion {
    this._parameterName = parameterName;
    return this._factory(this);
  }
}

export function num(actual: any, ...asserts: ((builder: NumAssertionBuilder) => Assertion)[]): AssertionBuilder[] {
  return asserts.map(x => new NumAssertionBuilder(actual, x));
}
