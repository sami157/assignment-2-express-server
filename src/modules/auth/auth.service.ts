import { pool } from '../../database/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerUserInDB(data: Record<string, unknown>) {
    const { name, email, password, phone, role } = data as {
        name: string;
        email: string;
        password: string;
        phone: string;
        role: string;
    };

    const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1;',
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        `
        INSERT INTO users (name, email, password, phone, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, role;
        `,
        [name, email, hashedPassword, phone, role]
    );

    return result.rows[0];
}

export async function loginUserFromDB(data: Record<string, unknown>) {
    const { email, password } = data as {
        email: string;
        password: string;
    };

    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1;',
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    const verifiedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
    };

    return {
        token,
        user: verifiedUser
    };
}