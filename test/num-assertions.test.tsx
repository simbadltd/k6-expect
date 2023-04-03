import { num } from "../src";
import { AssertionBuilder, AssertionResult } from "../src/assertion";

function run(builders: AssertionBuilder[]): AssertionResult {
  const builder = builders[0];
  const assertion = builder.build();
  return assertion.check();
}

describe("Num assertions", () => {
  test.each([
    [0, true],
    [0.0, true],
    [0.0, true],
    [1, false],
    [0.1, false],
    [0.000001, false],
    ["0", false]
  ])("zero::%s", (val, valid) => {
    const builder = num(val, x => x.zero());
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [0, false],
    [0.0, false],
    [0.0, false],
    [1, true],
    [0.1, true],
    [0.000001, true],
    ["0", true]
  ])("not.zero::%s", (val, valid) => {
    const builder = num(val, x => x.not().zero());
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [0, 0, 10, true],
    [0.0, 0.0, 10.0, true],
    [-1, 0, 10, false],
    [11, 0, 10, false],
    [10.000001, 0.0, 10.0, false]
  ])("between::%s in [%s..%s]", (val, a, b, valid) => {
    const builder = num(val, x => x.between(a, b));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [0, 0, 10, false],
    [0.0, 0.0, 10.0, false],
    [-1, 0, 10, true],
    [11, 0, 10, true],
    [10.000001, 0.0, 10.0, true]
  ])("not.between::%s in [%s..%s]", (val, a, b, valid) => {
    const builder = num(val, x => x.not().between(a, b));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });
});
