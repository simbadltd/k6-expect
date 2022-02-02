import { check, group } from "k6";
import { DEFAULT_TEST_SUITE_CONTEXT, TestSuiteContext } from "./assertion";
import { TestSuite } from "./test-suite";

export function describe(name: string, test: (t: TestSuite) => void, context?: TestSuiteContext) {
  let t = new TestSuite(context ? context : DEFAULT_TEST_SUITE_CONTEXT);

  let success = true;

  group(name, () => {
    try {
      test(t);
      success = true;
    } catch (e) {
      success = false;
      console.error(`Exception during test suite "${name}" run. \n${e}`);
      check(null, {
        [`Exception raised "${e}"`]: () => false
      });
    }
  });

  return success;
}
