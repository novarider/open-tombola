import { Inject, Service } from "typedi";
import { Application } from "express-serve-static-core";
import express from 'express';

@Service()
export class AppMiddleware {
    @Inject('app')
    private app?: Application;

    public registerMiddleware() {
        this.app?.use(express.json());
        this.app?.use(this.authMiddleware);
    }

    private encodedPassword = 'YVNpY2hlcnNQYSQkdzByZA=='
    public authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.url.startsWith('/tombola/') ||
            req.url.startsWith('/tickets/offline/create') ||
            req.url.startsWith('/tickets/offline/qr') ||
            req.url.startsWith('/tickets/offline/codes')) {
            if (req.method !== 'OPTIONS' && req.headers.authorization !== this.encodedPassword) {
                res.status(403).send({
                    error: 'Unauthorized'
                });
                return null;
            }
        }
        next();
    }
}