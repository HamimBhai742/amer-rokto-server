import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.routes";

import { bloodRoutes } from "../modules/blood/blood.routes";
import { adminRoutes } from "../modules/admin/admin.routes";

export const router=Router()


const routes=[
    {
        path:"/user",
        route:userRoutes
    },
    {
        path:"/auth",
        route:authRoutes
    },
    {
        path:"/blood",
        route:bloodRoutes
    },
    {
        path:"/admin",
        route:adminRoutes
    }
]


routes.forEach(route=>router.use(route.path,route.route))   

