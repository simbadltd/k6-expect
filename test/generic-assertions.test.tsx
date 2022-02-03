import { AssertionBuilder, AssertionResult } from "../src/assertion";
import { that } from "../src";

function run(builders: AssertionBuilder[]): AssertionResult {
  const builder = builders[0];
  const assertion = builder.build();
  return assertion.check();
}

describe('Generic assertions', () => {

  test.each([
    [true, true, true],
    [false, false, true],
    [true, false, false],
    [false, true, false],
    ["A", "A", true],
    ["B", "B", true],
    ["A", "B", false],
    ["B", "A", false],
    [1, 1, true],
    [0, 0, true],
    [1, 0, false],
    [0, 1, false]
  ])("toEqual::%s == %s", (a, b, valid) => {
    const builder = that(a, x => x.toEqual(b));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [true, true, false],
    [false, false, false],
    [true, false, true],
    [false, true, true],
    ["A", "A", false],
    ["B", "B", false],
    ["A", "B", true],
    ["B", "A", true],
    [1, 1, false],
    [0, 0, false],
    [1, 0, true],
    [0, 1, true]
  ])("not.toEqual::%s == %s", (a, b, valid) => {
    const builder = that(a, x => x.not().toEqual(b));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

});