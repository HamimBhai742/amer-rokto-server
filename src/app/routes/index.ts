import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.routes";

import { BloodRoutes } from "../modules/blood/blood.routes";

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
        route:BloodRoutes
    }
]


routes.forEach(route=>router.use(route.path,route.route))   

