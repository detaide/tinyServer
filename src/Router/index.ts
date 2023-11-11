import Application, { ParameterizedContext } from "koa";
import Router from "koa-router"
import { DemoPath } from "./demo";
import { PathLoad } from "@/Utils";
import path from "path";
import Loging from "@/Log/log";



export default class RouterManager
{

    private static router : Router = new Router();

    public constructor()
    {
    }

    public static getRouter()
    {
        if(!this.router)
            this.router = new Router();

        return this.router;
    }

    public static Response(ctx : ParameterizedContext, responseBody : ResponseBody)
    {
        ctx.body = responseBody;            
    }
}


export  class ResponseBody
{
    private data : ResponseBodyType;

    public constructor()
    {
        this.data = {
            status : false,
            reason : "Response Not Set Any Values"
        }
    }

    public setStatus(status : boolean)
    {
        this.data.status = status;
    }

    public getStatus()
    {
        return this.data.status;
    }

    public setData(data : ResponseBodyType)
    {
        this.data = data;
    }

    public setResponseReason(reason : any)
    {
        this.setStatus(false);
        this.data.reason = reason;
        this.data.data = null;
        Loging.Warn(reason);
    }

    public setResponseData(data : any)
    {
        this.setStatus(true);
        this.data.data = data;
        this.data.reason = null;
    }

}

async function useRouter(app :Application) : Promise<Router<any, {}>>
{
    let router = RouterManager.getRouter();

    //使用路由
    await app.use(router.routes())
    .use(router.allowedMethods());

    await PathLoad(path.resolve(__dirname))

    return router;
}

export async function useResponseHandler(app :Application) {
    await app.use( async (ctx, next) =>
    {
        try{
            await next();

            if(ctx.body === undefined)  return;

            ctx.body = {
                code : 200,
                message : "success",
                data : ctx.body
            };
        }catch(err : any)
        {
            ctx.body = {
                code : err?.status || 500,
                reason : err?.message || "Internal Server Error"
            }
        }
    })
}


export interface ResponseBodyType
{
    status : boolean,
    code? : number,
    data? : any,
    reason? : any
}

export {useRouter}