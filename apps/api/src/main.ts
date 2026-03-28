import 'reflect-metadata';
import express from 'express';
import { App } from './App';
import Container from 'typedi';
import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME, FRONTEND_BASE_URL, HOST, PORT, STRIPE_API_KEY, STRIPE_PRICE_ID } from '@org/api/products';

Container.set(HOST, process.env.HOST ?? '0.0.0.0');
Container.set(PORT, process.env.PORT ? Number(process.env.PORT) : 3333);
Container.set(STRIPE_API_KEY, process.env.API_KEY_STRIPE ? process.env.API_KEY_STRIPE : '');
Container.set(STRIPE_PRICE_ID, process.env.STRIPE_PRICE_ID ? process.env.STRIPE_PRICE_ID : 'price_1Svi0kA2DLsR0rymvypQGdBZ');
Container.set(FRONTEND_BASE_URL, process.env.FRONTEND_BASE_URL ? process.env.FRONTEND_BASE_URL : 'http://localhost:4200');

Container.set(DB_HOST, process.env.DB_HOST ?? 'localhost');
Container.set(DB_PORT, process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432);
Container.set(DB_USERNAME, process.env.DB_USERNAME ? process.env.DB_USERNAME : 'user');
Container.set(DB_PASSWORD, process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'password');

const app = express();
Container.set('app', app);

Container.get(App).startApp().catch((e) => {
    console.error("Failed to start the application", e);
})