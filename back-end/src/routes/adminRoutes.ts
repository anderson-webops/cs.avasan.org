// src/routes/adminRoutes.ts

import express from "express";
import { getLoggedInAdmin, updateAdmin } from "../controllers/users/adminController.js";
import { validAdmin } from "../middleware/auth.js";

const router = express.Router();

// There is no HTTP account creation, directory, or deletion surface. The sole
// teacher account is provisioned with create-admin-user.ts.
router.get("/loggedin", validAdmin, getLoggedInAdmin);
router.put("/:adminID", validAdmin, updateAdmin);

export const adminRoutes = router;
