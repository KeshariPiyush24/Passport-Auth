import { Router } from "express";
import { checkAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get("/", checkAuth, (req, res) => {
  res.json(req.user);
});

export default router;
