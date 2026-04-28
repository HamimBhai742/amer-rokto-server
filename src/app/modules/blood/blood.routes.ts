import { Router } from "express";
import { BloodController } from "./blood.controller";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { BloodValidation } from "./blood.validation";

const router = Router();

// ===================== BLOOD DONOR ROUTES =====================
router.get("/donors", BloodController.getBloodDonors);
router.get("/donors/:id", BloodController.getBloodDonorDetails);

// ===================== BLOOD REQUEST ROUTES =====================
router.post(
  "/requests",
  checkAuth("USER", "ADMIN"),
  validateRequest(BloodValidation.createBloodRequestSchema),
  BloodController.createBloodRequest
);

router.get("/requests", BloodController.getAllBloodRequests);

router.get("/requests/:id", BloodController.getBloodRequestById);

router.put(
  "/requests/:id",
  checkAuth("USER", "ADMIN"),
  validateRequest(BloodValidation.updateBloodRequestSchema),
  BloodController.updateBloodRequest
);

router.patch(
  "/requests/:id/status",
  checkAuth("USER", "ADMIN"),
  validateRequest(BloodValidation.changeRequestStatusSchema),
  BloodController.updateBloodRequestStatus
);

export const BloodRoutes = router;
