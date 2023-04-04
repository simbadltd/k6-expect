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

  test.each([
    [null, 0.000001, false],
    [undefined, 0.000001, false],
    [0, 0.000001, false],
    [0.000001, -1, true],
    [10.000001, 10.0, true]
  ])("greaterThan::%s > %s", (val, boundary, valid) => {
    const builder = num(val, x => x.greaterThan(boundary));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [null, 0.000001, false],
    [undefined, 0.000001, false],
    [0, 0.000001, false],
    [0.000001, -1, true],
    [-1, -1, true],
    [10.000001, 10.0, true],
    [10, 10.0, true]
  ])("greaterThanOrEqual::%s >= %s", (val, boundary, valid) => {
    const builder = num(val, x => x.greaterThanOrEqual(boundary));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [null, 0.000001, true],
    [undefined, 0.000001, false],
    [0.000001, 0, false],
    [-0.000001, 0, true],
    [10.0, 10.000001, true]
  ])("lessThan::%s < %s", (val, boundary, valid) => {
    const builder = num(val, x => x.lessThan(boundary));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [null, 0.000001, true],
    [undefined, 0.000001, false],
    [0.000001, 0, false],
    [-1, 0.000001, true],
    [-1, -1, true],
    [10.0, 10.000001, true],
    [10, 10.0, true]
  ])("lessThanOrEqual::%s <= %s", (val, boundary, valid) => {
    const builder = num(val, x => x.lessThanOrEqual(boundary));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });
});
