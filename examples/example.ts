import * as http from "k6/http";
import { response } from "../src/response";
import { describe } from "../src";
import { num } from "../src/num";
import { str } from "../src/str";

export default function () {
  const r = http.get("https://jsonplaceholder.typicode.com/users/10");

  describe("User check", t => {
    t.ensure(response(r, x => x.ok(), x => x.validJson()));
    t.expect("Id", num(r.json("id"), x => x.toEqual(10)));
    t.expect("Name", str(r.json("name"), x => x.not().toBeEmpty()));
    t.expect("Phone number", str(r.json("phone"), x => x.regex("\\d{3}-\\d{3}-\\d{4}")));
    t.expect("Geolocation", num(r.json("address.geo.lat"), x => x.lessThan(0)));
    t.expect("Company", str(r.json("company.name"), x => x.toContain("LLC")));
  });
}