import type { Request, Response, NextFunction } from 'express';
import validateAuthHeader from '../utils/validate-auth-header.js';

export const auth = (request: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = request?.headers?.authorization ?? '';

        if (!validateAuthHeader(authorizationHeader)) {
            throw new Error('Invalid authorization');
        }

        next();
    } catch {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
