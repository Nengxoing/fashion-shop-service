import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                created_date: true,
            },
        });
        res.json(users);
    } catch (error: any) {
        console.error('Error fetching users:', error);
        next(error);
    }
};

export default getAllUsers;