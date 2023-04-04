import { trace } from "../src";
import { AssertionBuilder, AssertionResult } from "../src/assertion";

function run(builders: AssertionBuilder[]): AssertionResult {
  const builder = builders[0];
  const assertion = builder.build();
  return assertion.check();
}

describe("Trace assertions", () => {
  test.each([
    [null, "null"],
    [undefined, "undefined"],
    ["Lorem ipsum", "Lorem ipsum"],
    [1, "1"],
    [true, "true"]
  ])("trace::%s", (val, expected) => {
    const builder = trace(val);
    const result = run(builder);
    expect(result.valid).toBeTruthy();
    expect(result.message).toEqual(expected);
  });
});
