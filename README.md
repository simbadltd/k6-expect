# k6-expect
[![NPM](https://img.shields.io/npm/v/k6-expect.svg)](https://www.npmjs.org/package/k6-expect)
[![CI](https://github.com/simbadltd/k6-expect/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/simbadltd/k6-expect/actions/workflows/main.yml)

k6 library that simplifies writing tests in a functional way by providing a simple and [jest](https://jestjs.io/)-like syntax for expectations.

## Usage

### Get started
``` typescript
export default function () {
    describe("Check", t => {
        const r = http.get("https://jsonplaceholder.typicode.com/users/10");
        
        // specialized and type-safe assertions 
        // ... for k6 http response 
        t.expect(response(r, x => x.ok(), x => x.validJson()));
        
        // ... for primitives
        t.expect("Id", num(r.json("id"), x => x.toEqual(10)));
        t.expect("Name", str(r.json("name"), x => x.not().toBeEmpty()));
        t.expect("Phone number", str(r.json("phone"), x => x.regex("\\d{3}-\\d{3}-\\d{4}")));
        t.expect("Geolocation", num(r.json("address.geo.lat"), x => x.lessThan(0)));
        t.expect("Company", str(r.json("company.name"), x => x.toContain("LLC")));
    });
}
```

Output:
```console
     █ User check
       ✓ https://jsonplaceholder.typicode.com/users/10 is 200
       ✓ https://jsonplaceholder.typicode.com/users/10 responded with valid json
       ✓ Id is 10
       ✓ Name is not empty
       ✓ Phone number matches '\d{3}-\d{3}-\d{4}' pattern
       ✓ Geolocation is less than 0
       ✓ Company contains 'LLC'
```

For more information, check this [examples](examples).

### Pass custom context
``` typescript
export class FooContext implements TestSuiteContext {
  breakOnFirstAssert: boolean;
  
  constructor() {
    this.breakOnFirstAssert = true;
  }

  sanitizeUrl(url: string): string {
    return "";
  }

  customFunction() { /* custom logic */ }
}

let fooContext = new FooContext();

export default function () {
    describe("Check", t => {
        // Test logic
        // ...
        // Access to custom logic
        t.context!.customFunction();
    }, fooContext);
}
```

### Typescript integration
Based on [k6-template-typescript](https://github.com/grafana/k6-template-typescript).

`package.json`:
```json
{
  "devDependencies": {
    "k6-expect": "X.X.X"
  }
}

```

`webpack.config.js`:
```javascript
...
module.exports = {
  ...
    externals: [
        function ({context, request}, c) {
            if (request.startsWith('k6') || request.startsWith('https://')) {
                return request === 'k6-expect' ? c() : c(null, 'commonjs ' + request);
            }
            return c();
        },
    ],
  ...
}
```

## Assertions table
| Access Function | Assertion        | Supports negation | Description                                         |
|-----------------|------------------|-------------------|-----------------------------------------------------|
| that()          | isNil            | ✓                 | Check value for `null` or `undefined`               |
|                 | eql              | ✓                 | Check value for equality                            |
| bool()          | toBeTruthy       | ✗                 | Check value for truth                               |
|                 | toBeFalsy        | ✗                 | Check value for falsity                             |
| collection()    | toBeEmpty        | ✓                 | Check array for emptiness                           |
|                 | length           | ✓                 | Check array for length                              |
|                 | toContain        | ✓                 | Check array for occurence of an item                |
| num()           | zero             | ✓                 | Check value for zero                                |
|                 | between          | ✓                 | Check value for a hit in the interval (inclusive)   |
|                 | greaterThan      | ✓                 | Check that value is greater                         |
|                 | greaterThanOrEql | ✓                 | Check that value is greater or equal                |
|                 | lessThan         | ✓                 | Check that value is less                            |
|                 | lessThanOrEql    | ✓                 | Check that value is less or equal                   |
| str()           | toBeEmpty        | ✓                 | Check value for emptiness                           |
|                 | regex            | ✓                 | Check that value matches the pattern                |
|                 | toContain        | ✓                 | Check value for occurence of a string               |
| response()      | validJson        | ✓                 | Check that response contains valid json             |
|                 | success          | ✓                 | Check that response has successful status (200-299) |
|                 | status           | ✓                 | Check that response has status specified            |
|                 | ok               | ✓                 | Check response for `200 OK`                         |
|                 | accepted         | ✓                 | Check response for `202 ACCEPTED`                   |
|                 | noContent        | ✓                 | Check response for `204 NO CONTENT`                 |
|                 | badRequest       | ✓                 | Check response for `400 BAD REQUEST`                |
|                 | unauthorized     | ✓                 | Check response for `401 UNAUTHORIZED`               |
|                 | forbidden        | ✓                 | Check response for `403 FORBIDDEN`                  |
|                 | notFound         | ✓                 | Check response for `404 NOT FOUND`                  |
|                 | length           | ✓                 | Check response body length                          |

## LICENSE [MIT](LICENSE)
