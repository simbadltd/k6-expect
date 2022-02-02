import * as http from "k6/http";
import { response } from "../src";
import { describe } from "../src";
import { num } from "../src";
import { str } from "../src";

export default function () {
  describe("User check", t => {
    const r = http.get("https://jsonplaceholder.typicode.com/users/10");
    
    t.expect(response(r, x => x.ok(), x => x.validJson()));
    t.expect("Id", num(r.json("id"), x => x.toEqual(10)));
    t.expect("Name", str(r.json("name"), x => x.not().toBeEmpty()));
    t.expect("Phone number", str(r.json("phone"), x => x.regex("\\d{3}-\\d{3}-\\d{4}")));
    t.expect("Geolocation", num(r.json("address.geo.lat"), x => x.lessThan(0)));
    t.expect("Company", str(r.json("company.name"), x => x.toContain("LLC")));
  });
} 