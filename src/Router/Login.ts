import { Login } from "@prisma/client";
import RouterManager, { ResponseBody } from ".";
import { ConvertData } from "@/Utils";
import LoginManager from "@/Server/Login";
import Loging from "@/Log/log";

export async function LoginPath()
{
    let router = RouterManager.getRouter();

    await router.get("/login", async (ctx) =>
    {
        let responseBody = new ResponseBody();
        // console.log(ctx.query)
        let loginMsg = ConvertData<Login>(ctx.query)
        if(!loginMsg.username || !loginMsg.password)
        {
            responseBody.setResponseReason("username or password is empty");
            return RouterManager.Response(ctx, responseBody);
        }

        await LoginManager.checkLogin(loginMsg, responseBody);

        return RouterManager.Response(ctx, responseBody);

    })

    await router.get("/register", async (ctx) =>
    {
        let responseBody = new ResponseBody();
        let loginMsg = ConvertData<Login>(ctx.query)
        if(!loginMsg.username || !loginMsg.password)
        {
            // return RouterManager.Response(ctx, {code : 1101, reason : "username or password unexists"});
            responseBody.setResponseReason("username or password unexists");
            return RouterManager.Response(ctx, responseBody);
        }

        await LoginManager.register(loginMsg, responseBody);
        return RouterManager.Response(ctx, responseBody)

    })
}