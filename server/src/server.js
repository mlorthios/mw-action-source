import express from 'express';
import http from 'http';
import fs from 'fs';
import bodyParser from 'body-parser';
import HttpRouter from './router';
import helmet from 'helmet';
import mongoose from 'mongoose';
import colors from 'colors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import SocketIO from 'socket.io';
import UUID from 'uuid/v1';
import SocketIOServer from './socketio/connect';

import ManageToken from './middleware/protection/ManageToken';

export default class HttpServer
{
    constructor()
    {
        const app           = express();

        mongoose.connect('mongodb://mwaction.app:27017/mwaction', {
            user: 'arwantys',
            pass: 'azerty',
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);


        var db = mongoose.connection;

        db.on('error', console.error.bind(console, 'MongoDB connection error:'));

        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.use(fileUpload());

        app.use('/public', express.static('public'));

        app.disable('x-powered-by');

        app.use(function (req, res, next) {

            res.setHeader('Access-Control-Allow-Origin', '*');

            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-api-key, Authorization');

            res.setHeader('Access-Control-Allow-Credentials', true);

            next();
        });

        var server = http.createServer(app).listen(__config.portHttp, __config.ip, () => {

            console.log(`[${__config.name}]`.yellow + ' Server => ' + 'Loaded'.green)

        });

        var io = SocketIO.listen(server);

        new SocketIOServer().init(io);

        app.use(new HttpRouter);

        app.use(function(req, res, next) {
            const send = {
                response: 'Forbidden',
                status: 'error',
                statusCode: '403'
            }
            res.status(404).send(send);
        });

        return app;
    }
}
