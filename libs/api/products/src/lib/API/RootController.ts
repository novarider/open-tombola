import { Application } from 'express';
import { Inject, Service } from 'typedi';

@Service()
export class RootController {
    @Inject('app')
    private app: Application;

    public registerRoutes() {
        this.app.get('/', (req, res) => {
            res.send({ message: 'open-tombola v0.0.1' });
        });

    }
}