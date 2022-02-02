# k6-expect
[![NPM](https://img.shields.io/npm/v/k6-expect.svg)](https://www.npmjs.org/package/k6-expect)
[![CI](https://github.com/simbadltd/k6-expect/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/simbadltd/k6-expect/actions/workflows/main.yml)

k6 library that simplifies writing tests in a functional way by providing a simple and [jest](https://jestjs.io/)-like syntax for expectations.

## Usage
``` typescript
export default function () {
    describe("Check", t => {
        const r = http.post("http://127.0.0.1:8080/foo", "{}");
        
        // specialized and type-safe assertions 
        // ... for k6 http response 
        t.ensure(response(r, x => x.ok(), x => x.validJson()));
        
        // ... for primitives
        t.expect(
            "Application version",
            bool(r.json("isAllowed"), x => x.toBeTruthy("allowed", "disallowed"))
        );
        
        t.expect("Token", str(r, x => x.not().toBeEmpty()));
    });
}
```

For more information, check this [example](examples/example.ts).

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
|                 |                  |                   |                                                     |
| bool()          | toBeTruthy       | ✗                 | Check value for truth                               |
|                 | toBeFalsy        | ✗                 | Check value for falsity                             |
|                 |                  |                   |                                                     |
| collection()    | toBeEmpty        | ✓                 | Check array for emptiness                           |
|                 | length           | ✓                 | Check array for length                              |
|                 | toContain        | ✓                 | Check array for occurence of an item                |
|                 |                  |                   |                                                     |
| num()           | zero             | ✓                 | Check value for zero                                |
|                 | between          | ✓                 | Check value for a hit in the interval (inclusive)   |
|                 | greaterThan      | ✓                 | Check that value is greater                         |
|                 | greaterThanOrEql | ✓                 | Check that value is greater or equal                |
|                 | lessThan         | ✓                 | Check that value is less                            |
|                 | lessThanOrEql    | ✓                 | Check that value is less or equal                   |
|                 |                  |                   |                                                     |
| str()           | toBeEmpty        | ✓                 | Check value for emptiness                           |
|                 | regex            | ✓                 | Check that value matches the pattern                |
|                 | toContain        | ✓                 | Check value for occurence of a string               |
|                 |                  |                   |                                                     |
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
