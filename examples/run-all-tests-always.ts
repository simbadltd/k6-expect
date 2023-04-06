import * as http from "k6/http";
import { response, TestSuiteContext } from "../src";
import { describe } from "../src";
import { str } from "../src";

export class FooContext implements TestSuiteContext {
  breakOnFirstAssert: boolean;

  constructor() {
    /* this config switch will do the job */
    this.breakOnFirstAssert = false;
  }

  sanitizeUrl(url: string): string {
    return url;
  }

  sanitizeCheckName(name: string): string {
    return name;
  }
}

const context = new FooContext();

export default function () {
  describe("User check", t => {
    const r = http.get("https://jsonplaceholder.typicode.com/users/10");

    t.expect(response(r, x => x.ok(), x => x.validJson()));
    t.expect("Id", str(r.json("id"), x => x.not().toBeEmpty()));
  }, context);
} 