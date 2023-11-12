import Koa from "koa";
import {useLog} from "@/Log/log"
import {useResponseHandler, useRouter} from "@/Router/index"
import "@/Global/TypeSupport"

async function Bootstrap() {
    const app = new Koa();


    await useLog(app);

    await useRouter(app);

    await useResponseHandler(app)

    await app.listen(3000, () =>
    {
        console.log("3000 port listening...")
    })

}


Bootstrap();





