import { Router } from 'express';
import { 
  getOverview, 
  getUsers, 
  updateUserStatus, 
  getAuditLogs, 
  getSystemHealth 
} from '../controllers/adminController';
import { authenticateJWT, authorizeRoles } from '../middleware';

const router = Router();

// Enforce strict administrative authorization on all admin routes
router.use(authenticateJWT, authorizeRoles('admin'));

/**
 * @openapi
 * /admin/overview:
 *   get:
 *     summary: Retrieve aggregate platform statistics
 *     description: Returns live metrics on registered farmers, buyers, admins, active fields, total acreage, and health.
 *     tags:
 *       - Admin Control Panel
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Platform overview retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 */
router.get('/overview', getOverview);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: List platform users with pagination and filters
 *     description: Search users by name, email, phone, role, and account status without exposing credentials.
 *     tags:
 *       - Admin Control Panel
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [all, farmer, buyer, admin] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [all, active, suspended] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated user list
 */
router.get('/users', getUsers);

/**
 * @openapi
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Suspend or restore user account
 *     description: Changes user lifecycle status with audit logging. Prevents administrator self-lockout.
 *     tags:
 *       - Admin Control Panel
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [active, suspended] }
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Self-lockout or invalid status
 *       403:
 *         description: Forbidden
 */
router.patch('/users/:id/status', updateUserStatus);

/**
 * @openapi
 * /admin/logs:
 *   get:
 *     summary: Retrieve administrative audit trail
 *     description: Returns chronological records of administrative interventions.
 *     tags:
 *       - Admin Control Panel
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 */
router.get('/logs', getAuditLogs);

/**
 * @openapi
 * /admin/health:
 *   get:
 *     summary: Retrieve subsystem infrastructure telemetry
 *     description: Returns detailed server runtime, database latency, and memory utilization.
 *     tags:
 *       - Admin Control Panel
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Subsystem health details
 */
router.get('/health', getSystemHealth);

export default router;
