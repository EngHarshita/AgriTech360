import { Router } from 'express';
import {
  getParcels,
  getParcelById,
  createParcel,
  updateParcel,
  deleteParcel
} from '../controllers/farmController';
import { authenticateJWT } from '../middleware';

const router = Router();

// Protect all farm routes with JWT authentication
router.use(authenticateJWT);

/**
 * @openapi
 * /farms:
 *   get:
 *     summary: Retrieve all registered farm parcels for the authenticated farmer
 *     description: Returns the list of farm field parcels owned by the farmer, total cultivated area, and soil/crop breakdown.
 *     tags:
 *       - Farm Management
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Farm parcels retrieved successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 *   post:
 *     summary: Register a new farm field / parcel
 *     description: Creates a new land parcel under the authenticated farmer with area, soil type, irrigation system, and current crop.
 *     tags:
 *       - Farm Management
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - areaAcres
 *             properties:
 *               name:
 *                 type: string
 *                 example: North Canal Field
 *               surveyNumber:
 *                 type: string
 *                 example: Khasra #218/1
 *               village:
 *                 type: string
 *                 example: Rampur
 *               district:
 *                 type: string
 *                 example: Indore
 *               state:
 *                 type: string
 *                 example: Madhya Pradesh
 *               areaAcres:
 *                 type: number
 *                 example: 3.5
 *               soilType:
 *                 type: string
 *                 example: Black Soil
 *               irrigationType:
 *                 type: string
 *                 example: Drip Irrigation
 *               currentCrop:
 *                 type: string
 *                 example: Sharbati Wheat
 *               croppingSeason:
 *                 type: string
 *                 example: Rabi 2026
 *               status:
 *                 type: string
 *                 enum: [Active Cultivation, Fallow, Harvested, Sowing Prep]
 *                 example: Active Cultivation
 *     responses:
 *       201:
 *         description: Farm parcel registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.route('/')
  .get(getParcels)
  .post(createParcel);

/**
 * @openapi
 * /farms/{id}:
 *   get:
 *     summary: Retrieve single farm parcel details
 *     description: Returns detailed specifications of a specific farm parcel owned by the authenticated farmer.
 *     tags:
 *       - Farm Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the farm parcel
 *     responses:
 *       200:
 *         description: Farm parcel details retrieved
 *       404:
 *         description: Farm parcel not found
 *   put:
 *     summary: Update an existing farm parcel
 *     description: Modifies area, crop, irrigation, or status for a farm parcel owned by the authenticated farmer.
 *     tags:
 *       - Farm Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Farm parcel updated successfully
 *       404:
 *         description: Farm parcel not found
 *   delete:
 *     summary: Delete a farm parcel
 *     description: Permanently removes a farm parcel record owned by the authenticated farmer.
 *     tags:
 *       - Farm Management
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Farm parcel deleted successfully
 *       404:
 *         description: Farm parcel not found
 */
router.route('/:id')
  .get(getParcelById)
  .put(updateParcel)
  .delete(deleteParcel);

export default router;
