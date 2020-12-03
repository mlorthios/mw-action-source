import HttpServer from "./src/server";
import config from './config.json';

global.__base           = __dirname;
global.__config         = config;

new HttpServer;
