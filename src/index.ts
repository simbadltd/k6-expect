import { check, group } from "k6";
import { TestSuiteContext } from "./assertion";
import { TestSuite } from "./test-suite";

export function describe<TContext extends TestSuiteContext = TestSuiteContext>(
  name: string,
  test: (t: TestSuite<TContext>) => void,
  context?: TContext
) {
  let t = new TestSuite<TContext>(context);

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
