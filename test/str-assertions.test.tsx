import { str } from "../src";
import { AssertionBuilder, AssertionResult } from "../src/assertion";

function run(builders: AssertionBuilder[]): AssertionResult {
  const builder = builders[0];
  const assertion = builder.build();
  return assertion.check();
}

describe("Str assertions", () => {
  test.each([
    [null, true],
    [undefined, true],
    ["", true],
    [1, false],
    [" ", false],
    ["   ", false],
    ["123", false]
  ])("toBeEmpty::%s", (val, valid) => {
    const builder = str(val, x => x.toBeEmpty());
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [null, false],
    [undefined, false],
    ["", false],
    ["123d", false],
    [" ", false],
    [1, false],
    ["test@test.test", true]
  ])("regex::%s (email pattern)", (val, valid) => {
    const builder = str(val, x => x.regex("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });

  test.each([
    [null, "", false],
    [undefined, "", false],
    ["Dolar", "A", false],
    ["", "", false],
    ["Lorem ipsum", "em ip", true]
  ])("toContain::%s (%s)", (val, substr, valid) => {
    const builder = str(val, x => x.toContain(substr));
    const result = run(builder);
    expect(result.valid).toEqual(valid);
  });
});
