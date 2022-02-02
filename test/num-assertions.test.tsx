import { num } from "../src/num";
import { AssertionBuilder, AssertionResult, DEFAULT_TEST_SUITE_CONTEXT } from "../src/assertion";

function run(builders: AssertionBuilder[]): AssertionResult {
  const builder = builders[0];
  const assertion = builder.build(DEFAULT_TEST_SUITE_CONTEXT);
  return assertion.check();
}

describe('Num assertions', () => {

  test.each([
    [0, true],
    [0.0, true],
    [0.000000, true],
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
    [0.000000, false],
    [1, true],
    [0.1, true],
    [0.000001, true],
    ["0", true]
  ])("not.zero::%s", (val, valid) => {
    const builder = num(val, x => x.not().zero());
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

});