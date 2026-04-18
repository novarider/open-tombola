import { Inject, Service } from "typedi";
import { Application } from "express-serve-static-core";

@Service()
export class AppHeaders {
    @Inject('app')
    private app?: Application;

    public registerHeaders() {
        this.app?.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', '*');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });
    }
}