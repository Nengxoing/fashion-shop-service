import { Router } from 'express';
import getAllUsers from '../controllers/getUsersController';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   created_date:
 *                     type: string
 *                     format: date-time
 */
router.get('/', getAllUsers);

export default router;