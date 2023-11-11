import RouterManager from ".";

export function DemoPath()
{
    let router = RouterManager.getRouter();

    router.get("/", (ctx) =>
    {
        ctx.body = "Hello World"
    })

    router.get("/demo", (ctx) =>
    {
        ctx.body = " this is a demo";
    })
}