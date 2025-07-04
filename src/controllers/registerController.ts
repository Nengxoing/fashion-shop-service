// src/controllers/registerController.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required.' });
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(409).json({ error: 'Email already registered.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                created_date: true,
            },
        });

        res.status(201).json(newUser);
    } catch (error: any) {
        console.error('Error registering user:', error);
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'A user with this email already exists.' });
            return;
        }
        next(error);
    }
};

export default registerUser;
