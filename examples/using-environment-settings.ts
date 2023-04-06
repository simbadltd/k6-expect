import http, { RefinedResponse, ResponseType } from "k6/http";
import { response, TestSuiteContext } from "../src";
import { describe } from "../src";

export interface EnvironmentSettings {
  baseUrl: string;
  sessionId: string;
}

function _getFilePath(): string {
  /* If you want to choose different settings file based on argument passed to k6 run */
  return __ENV.ENV_FILE || ".env.develop";
}

export const DEFAULT_SETTINGS: EnvironmentSettings = {
  baseUrl: "https://jsonplaceholder.typicode.com/",
  sessionId: "test-session-id",
  /* If you want to load settings from file */
  ...JSON.parse(open(_getFilePath()))
};

export class Context implements TestSuiteContext {
  breakOnFirstAssert: boolean;
  settings: EnvironmentSettings;

  constructor(overrides?: Partial<EnvironmentSettings>) {
    /* If you want to manually override settings */
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(overrides ? overrides : {})
    };
  }

  sanitizeUrl(url: string): string {
    return url;
  }

  sanitizeCheckName(name: string): string {
    return name;
  }

  get<RT extends ResponseType | undefined>(url: string, baseUrl?: string): RefinedResponse<RT> {
    const absoluteUrl = Context._combine(baseUrl || this.settings.baseUrl, url);
    return http.get(absoluteUrl, this.defaultHeaders());
  }

  defaultHeaders(): any {
    return {
      headers: {
        "Content-Type": "application/json",
        "SessionId": this.settings.sessionId
      }
    }
  }

  private static _combine(baseUrl: string, relativeUrl: string): string {
    return relativeUrl
      ? baseUrl.replace(/\/+$/, "") + "/" + relativeUrl.replace(/^\/+/, "")
      : baseUrl;
  }
}

const context = new Context();

export default function () {
  describe("User check", t => {
    const c = t.context!;
    const r = c.get("users/10");

    t.expect(response(r, x => x.ok(), x => x.validJson()));
  }, context);
} 