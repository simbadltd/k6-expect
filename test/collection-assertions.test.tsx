import { AssertionBuilder, AssertionResult } from "../src/assertion";
import { collection } from "../src";

function run(builders: AssertionBuilder[]): AssertionResult {
  const builder = builders[0];
  const assertion = builder.build();
  return assertion.check();
}

describe('Collection assertions', () => {

  test.each([
    [null, 0, false],
    [undefined, 0, false],
    [[], 0, true],
    [["0"], 0, false],
    [["0"], 1, true],
    [["0", "1"], 2, true],
    [["0", "1", "2"], 3, true],
  ])("length::%s == %s", (a, len, valid) => {
    const builder = collection(a, x => x.length(len));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [null, 0, true],
    [undefined, 0, true],
    [[], 0, false],
    [["0"], 0, true],
    [["0"], 1, false],
    [["0", "1"], 2, false],
    [["0", "1", "2"], 3, false],
  ])("not.length::%s == %s", (a, len, valid) => {
    const builder = collection(a, x => x.not().length(len));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [null, "0", false],
    [undefined, "0", false],
    [[], "0", false],
    [["0"], "0", true],
    [["0"], 0, false],
    [["0", "1"], "1", true],
    [["0", "1"], 1, false],
  ])("toContain::%s (%s)", (a, b, valid) => {
    const builder = collection(a, x => x.toContain(b));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

});