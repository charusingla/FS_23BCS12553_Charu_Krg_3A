import {add, getUserName} from "./math";

test("add function", () => {
    expect(add(2,3)).toBe(5);
    expect(add(4,3)).toBe(9);
    expect(add(2,9)).toBe(11);
})

test("returns username", () => {
    expect(getUserName({name: "Charu"})).toBe("Charu");
    expect(getUserName(null)).toBe("Guest");
})