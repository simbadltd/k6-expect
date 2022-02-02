export module Msg {
  export function is(negative: boolean): string {
    return negative ? "is not" : "is";
  }

  export function does(pForm: string, nForm: string, negative: boolean) {
    return negative ? `doesn't ${nForm}` : pForm;
  }

  export function negateIf(str: any, negative: boolean): string {
    return negative ? `not ${str}` : str;
  }

  export function param(str?: string) {
    return str || "It";
  }
}