import { Request, Response, NextFunction, RequestHandler } from 'express';
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

const getAllUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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

const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                created_date: true,
            },
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_date: user.created_date,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        next(error);
    }
};

export {
    registerUser,
    getAllUsers,
    loginUser,
};