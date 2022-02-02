import { RefinedResponse, ResponseType } from "k6/http";
import { Assertion, AssertionBuilder, AssertionResult, TestSuiteContext } from "./assertion";
import { BetweenAssertion } from "./num";
import { BaseAssertionBuilder, EqualAssertion } from "./generic";

class ValidJsonAssertion implements Assertion {
  private readonly _actual: RefinedResponse<ResponseType | undefined>;
  private readonly _parameterName: string;
  private readonly _not: boolean;

  constructor(actual: RefinedResponse<ResponseType | undefined>, not: boolean, parameterName: string) {
    this._actual = actual;
    this._parameterName = parameterName;
    this._not = not;
  }

  check(): AssertionResult {
    let valid = !this._not;
    try {
      this._actual.json();
    } catch (e) {
      valid = !valid;
    }

    return {
      valid,
      message: `${this._parameterName} responded with ${valid ? "valid" : "invalid"} json`
    };
  }
}

export type ResponseAssertionFactory = (x: ResponseAssertionBuilder) => Assertion;

export class ResponseAssertionBuilder extends BaseAssertionBuilder<RefinedResponse<ResponseType | undefined>>
  implements AssertionBuilder {
  private readonly _factory: ResponseAssertionFactory;
  private _url: string;

  constructor(actual: RefinedResponse<ResponseType | undefined>, factory: ResponseAssertionFactory) {
    super(actual);
    this._factory = factory;
    this._url = "<unknown_url>";
    this._not = false;
  }

  /**
   * Check that response contains valid json
   */
  validJson(): Assertion {
    return new ValidJsonAssertion(this._actual, this._not, this._url);
  }

  /**
   * Check that response has successful status (200-299)
   */
  success(): Assertion {
    return new BetweenAssertion(200, 299, this._actual.status, this._not, this._url);
  }

  /**
   * Check that response has status specified
   */
  status(code: number): Assertion {
    return this._ensureHttpStatusCode(code);
  }

  /**
   * Check response for `200 OK`
   */
  ok(): Assertion {
    return this._ensureHttpStatusCode(200);
  }

  /**
   * Check response for `202 ACCEPTED`
   */
  accepted(): Assertion {
    return this._ensureHttpStatusCode(202);
  }

  /**
   * Check response for `204 NO CONTENT`
   */
  noContent(): Assertion {
    return this._ensureHttpStatusCode(204);
  }

  /**
   * Check response for `400 BAD REQUEST`
   */
  badRequest(): Assertion {
    return this._ensureHttpStatusCode(400);
  }

  /**
   * Check response for `401 UNAUTHORIZED`
   */
  unauthorized(): Assertion {
    return this._ensureHttpStatusCode(401);
  }

  /**
   * Check response for `403 FORBIDDEN`
   */
  forbidden(): Assertion {
    return this._ensureHttpStatusCode(403);
  }

  /**
   * Check response for `404 NOT FOUND`
   */
  notFound(): Assertion {
    return this._ensureHttpStatusCode(404);
  }

  /**
   * Check response body length
   */
  length(count: number): Assertion {
    return new EqualAssertion(count, this._actual.body?.length, this._not, this._parameterName);
  }

  /**
   * Negation
   */
  not(): ResponseAssertionBuilder {
    this._not = !this._not;
    return this;
  }

  build<TContext extends TestSuiteContext>(context?: TContext, parameterName?: string): Assertion {
    this._parameterName = parameterName;
    this._url = context ? context.sanitizeUrl(this._actual.request.url) : this._actual.request.url;
    return this._factory(this);
  }

  private _ensureHttpStatusCode(httpStatusCode: number): Assertion {
    return new EqualAssertion(httpStatusCode, this._actual.status, this._not, this._url);
  }
}

export function response(
  actual: RefinedResponse<ResponseType | undefined>,
  ...asserts: ((builder: ResponseAssertionBuilder) => Assertion)[]
): AssertionBuilder[] {
  return asserts.map(x => new ResponseAssertionBuilder(actual, x));
}
