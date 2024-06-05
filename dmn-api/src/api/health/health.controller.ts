import { type Request, type Response } from 'express';

const processRequest = (request: Request, res: Response) => {
    const healthCheck = {
        message: 'OK',
        timestamp: Date.now()
    };
    try {
        res.send(healthCheck);
    } catch {
        res.status(503).send();
    }
};

const healthController = { processRequest };

export default healthController;
