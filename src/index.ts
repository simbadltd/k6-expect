﻿import { check, group } from "k6";
import { TestSuiteContext } from "./assertion";
import { bool } from "./bool";
import { collection } from "./collection";
import { that } from "./generic";
import { num } from "./num";
import { response } from "./response";
import { str } from "./str";
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

export {
  TestSuite,
  TestSuiteContext,
  num,
  that,
  bool,
  collection,
  response,
  str
}
