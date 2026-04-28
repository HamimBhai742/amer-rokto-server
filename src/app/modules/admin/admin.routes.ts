import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { AdminValidation } from "./admin.validation";

const router = Router();

// Secure all admin routes
router.use(checkAuth("ADMIN"));

router.get("/stats", AdminController.getSystemStats);
router.get("/users", AdminController.getAllUsers);

router.patch(
  "/users/:id/role",
  validateRequest(AdminValidation.changeRoleSchema),
  AdminController.changeUserRole
);

export const AdminRoutes = router;
