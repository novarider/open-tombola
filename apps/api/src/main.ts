import 'reflect-metadata';
import express from 'express';
import { App } from './App';
import Container from 'typedi';

Container.set('host', process.env.HOST ?? '0.0.0.0');
Container.set('port', process.env.PORT ? Number(process.env.PORT) : 3333);
Container.set('stripe-api-key', process.env.API_KEY_STRIPE ? process.env.API_KEY_STRIPE : '');

const app = express();
Container.set('app', app);

Container.get(App).startApp();