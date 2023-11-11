import { PathLoad } from "@/Utils/index"
import {describe, expect, test} from "@jest/globals"
import path from "path"
// describe("sum a + b = c", () =>
// {
//     test("first Test", () =>
//     {
//         expect(sum(1,2)).toBe(3)
//     })
// })

describe("PathLoad", () =>
{
    test("src", () =>
    {
        PathLoad(path.resolve(__dirname))
    })
})
