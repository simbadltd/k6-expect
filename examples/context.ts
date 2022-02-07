import * as http from "k6/http";
import { response, TestSuiteContext } from "../src";
import { describe } from "../src";
import { str } from "../src";

export class FooContext implements TestSuiteContext {
  breakOnFirstAssert: boolean;

  constructor() {
    this.breakOnFirstAssert = true;
  }

  sanitizeUrl(url: string): string {
    return url.replace("127.0.0.1", "local");
  }

  phoneNumberPattern(): string {
    return "\\d{3}-\\d{3}-\\d{4}";
  }

  sanitizeCheckName(name: string): string {
    return `UC000: ${name}`;
  }
}

const context = new FooContext();

export default function () {
  describe("User check", t => {
    const c = t.context!;
    const r = http.get("https://jsonplaceholder.typicode.com/users/10");

    t.expect(response(r, x => x.ok(), x => x.validJson()));

    t.expect("Phone number", str(r.json("phone"), x => x.regex(c.phoneNumberPattern())));

  }, context);
} 