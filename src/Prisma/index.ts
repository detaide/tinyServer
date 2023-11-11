import Application from "koa";
import {PrismaClient} from "@prisma/client";
import { tbDemo } from "@prisma/client";

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

}
