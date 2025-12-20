import express from "express";
import { allowOnlyAuthenticatedUser } from "../middlewares/auth";
import { getFeatures, postFeatures } from "../controllers/feature";

export const featureRoute = express.Router();

featureRoute.get('/', getFeatures);
featureRoute.post('/', allowOnlyAuthenticatedUser, postFeatures);