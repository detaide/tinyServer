import PrismaManager, { PrismaType } from "@/Prisma";
import { Login, Prisma, PrismaClient } from "@prisma/client";
import Time from "@/Utils/Time"
import { ParameterizedContext } from "koa";
import Loging from "@/Log/log";
import { ResponseBody } from "@/Router";

let loginProxy : Prisma.LoginDelegate = PrismaManager.getPrisma().login;


async function checkLogin(loginMsg : Login, responseBody : ResponseBody) {
    let status = await PrismaManager.transaction(async (prisma) =>
    {
        let loginItem = await prisma.login.findFirst({
            where : {
                username : loginMsg.username,
                password : loginMsg.password
            }
        })

        if(!loginItem)
        {
            throw new Error(`checkLogin Error : ${loginMsg.username} - ${loginMsg.password}`)
        }

        let currTime = Time.currTime();
        await prisma.login.update(
            {
                data : {
                    login_time : currTime
                },
                where : {
                    username : loginMsg.username
                }
            }
        )
    }, responseBody);

    if(status)
        return  responseBody.setResponseData("checkLogin Success");

}

async function register(loginMsg : Login, responseBody : ResponseBody){

    await PrismaManager.getPrisma().$transaction( async (prisma) =>
    {
        let userItem = await userExist(prisma, loginMsg.username);

        if(userItem)
        {
            throw new Error(`username "${loginMsg.username}" has exist`);
        }

        let currTime = Time.currTime();

        let loginItem = await prisma.login.create(
            {
                data : {
                    username : loginMsg.username,
                    password : loginMsg.password,
                    register_time : currTime,
                    update_time : currTime,
                    login_time : currTime
                }
            }
        )

        if(!loginItem)
        {
            throw new Error("create user fail");
        }
    })

    return responseBody.setResponseData("create user success");

}

async function userExist(prisma : PrismaType, username:string) {
    return await prisma.login.findFirst({
        where : {
            username
        }
    })
}

async function getAllUser(responseBody : ResponseBody) {
    let allUser = await loginProxy.findMany();
    return responseBody.setResponseData(allUser);
}

export default
{
    checkLogin,
    register,
    getAllUser
}