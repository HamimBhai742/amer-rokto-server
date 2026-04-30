import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { adminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();

// Secure all admin routes
router.use(checkAuth("ADMIN"));

router.get("/stats", adminController.getSystemStats);
router.get("/users", adminController.getAllUsers);

router.patch(
  "/users/:id/role",
  validateRequest(AdminValidation.changeRoleSchema),
  adminController.changeUserRole
);

export const adminRoutes = router;
