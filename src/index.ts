#! /usr/bin/env node

/**
 * This is the main entrypoint for the helm-packager CLI application.
 */
import 'reflect-metadata';
import { Container } from 'typedi';

import App from './app/main';
const app = Container.get(App);
app.run();
