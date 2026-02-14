import { Inject, Service } from "typedi";
import { Application } from "express-serve-static-core";
import express from 'express';

@Service()
export class AppMiddleware {
    @Inject('app')
    private app: Application;

    public registerMiddleware() {
        this.app.use(express.json());
    }
}