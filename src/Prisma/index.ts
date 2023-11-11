import Application from "koa";
import {PrismaClient} from "@prisma/client";
import { tbDemo } from "@prisma/client";
import * as runtime from '@prisma/client/runtime/library';
import { ResponseBody } from "@/Router";

export type PrismaType = Omit<PrismaClient, runtime.ITXClientDenyList>
let prisma = new PrismaClient();

export default class PrismaManager
{


    public static getPrisma()
    {
        if(!prisma)
            prisma = new PrismaClient();

        return prisma;
    }

    public static async close()
    {
        await PrismaManager.getPrisma().$disconnect();
    }

    /**
     * 错误信息会被收集，如果提供了responseBody，就会被写回到ResponseBody中
     * @param callback 事务函数
     * @param responseBody 返回体的编辑，可选
     * @returns status : Boolean 如果是false，则事务出错，responseBody被置为丢出的信息
     */
    public static async transaction(
        callback : (prisma : PrismaType, responseBody? : ResponseBody) => Promise<any>,
        responseBody? : ResponseBody
    )
    {
        return await callback.bind(null, PrismaManager.getPrisma(), responseBody)()
        .then(() =>
        {
            return true;
        })
        .catch((err) =>
        {
            responseBody?.setResponseReason(err.message);
            return false;
        })
    }

}
