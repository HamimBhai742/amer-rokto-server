import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import validateRequest from "../../middleware/validateRequest";
import { BloodValidation } from "./blood.validation";
import { bloodController } from "./blood.controller";

const router = Router();

// ===================== BLOOD DONOR ROUTES =====================
router.get("/donors", bloodController.getBloodDonors);
router.get("/donors/:id", bloodController.getBloodDonorDetails);

// ===================== BLOOD REQUEST ROUTES =====================
router.post(
  "/requests",
  checkAuth("USER", "ADMIN"),
  validateRequest(BloodValidation.createBloodRequestSchema),
  bloodController.createBloodRequest
);

router.get("/requests", bloodController.getAllBloodRequests);

router.get("/requests/:id", bloodController.getBloodRequestById);

router.put(
  "/requests/:id",
  checkAuth("USER", "ADMIN"),
  validateRequest(BloodValidation.updateBloodRequestSchema),
  bloodController.updateBloodRequest
);

router.patch(
  "/requests/:id/status",
  checkAuth("USER", "ADMIN"),
  validateRequest(BloodValidation.changeRequestStatusSchema),
  bloodController.updateBloodRequestStatus
);

export const bloodRoutes = router;
