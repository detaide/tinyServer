import PrismaManager from "@/Prisma";
import { Login, Prisma, PrismaClient } from "@prisma/client";
import Time from "@/Utils/Time"
import { ParameterizedContext } from "koa";
import Loging from "@/Log/log";
import { ResponseBody } from "@/Router";

let loginProxy : Prisma.LoginDelegate = PrismaManager.getPrisma().login;

async function checkLogin(loginMsg : Login, responseBody : ResponseBody) {

    let loginItem = await loginProxy.findFirst({
        where : {
            username : loginMsg.username,
            password : loginMsg.password
        }
    })

    if(!loginItem)
    {
        return responseBody.setResponseReason(`checkLogin Error : ${loginMsg.username} - ${loginMsg.password}`);
    }

    return  responseBody.setResponseData("checkLogin Success");

}

async function register(loginMsg : Login, responseBody : ResponseBody){

    let userItem = await userExist(loginMsg.username)

    if(userItem)
    {
        return responseBody.setResponseReason(`username "${loginMsg.username}" has exist`);
    }

    let currTime = Time.currTime();

    let loginItem = await loginProxy.create(
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
        Loging.Error("create user fail");
    }

    return true;

}

async function userExist(username:string) {
    return await loginProxy.findFirst({
        where : {
            username
        }
    })
}

export default
{
    checkLogin,
    register
}