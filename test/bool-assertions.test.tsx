import { bool } from "../src";
import { AssertionBuilder, AssertionResult } from "../src/assertion";

function run(builders: AssertionBuilder[]): AssertionResult {
  const builder = builders[0];
  const assertion = builder.build();
  return assertion.check();
}

describe("Bool assertions", () => {
  test.each([
    [true, true],
    [false, false]
  ])("toBeTruthy::%s", (val, valid) => {
    const builder = bool(val, x => x.toBeTruthy());
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [true, false],
    [false, true]
  ])("toBeFalsy::%s", (val, valid) => {
    const builder = bool(val, x => x.toBeFalsy());
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [true, true, true],
    [true, false, false],
    [false, false, true],
    [false, true, false]
  ])("toEqual::%s === %s", (a, b, valid) => {
    const builder = bool(a, x => x.toEqual(b));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [true, true, false],
    [true, false, true],
    [false, false, false],
    [false, true, true]
  ])("not::toEqual::%s !== %s", (a, b, valid) => {
    const builder = bool(a, x => x.not().toEqual(b));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });
});
