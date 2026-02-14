import 'reflect-metadata';
import express from 'express';
import { App } from './App';
import Container from 'typedi';

Container.set('host', process.env.HOST ?? '0.0.0.0');
Container.set('port', process.env.PORT ? Number(process.env.PORT) : 3333);
Container.set('stripe-api-key', process.env.API_KEY_STRIPE ? process.env.API_KEY_STRIPE : '');

Container.set('db-host', process.env.DB_HOST ?? 'localhost');
Container.set('db-port', process.env.DB_PORT ? Number(process.env.DB_PORT) : 4444);
Container.set('db-username', process.env.DB_USERNAME ? process.env.DB_USERNAME : 'admin');
Container.set('db-password', process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'password');

const app = express();
Container.set('app', app);

Container.get(App).startApp().catch((e) => {
    console.error("Failed to start the application", e);
})