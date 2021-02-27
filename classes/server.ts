import express from 'express';
import { SERVER_PORT } from '../globals/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/sockets';



export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;


    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = require('socket.io')( this.httpServer, {
            cors: {
                origin: true,
                credentials: true
            }
        } );

        this.escucharSockets();
    }


    start( callback: () => void ) {

        this.httpServer.listen( this.port, callback );
    }



    public static get instance() {

        return this._instance || ( this._instance = new this() );

    }


    private escucharSockets() {

        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente => {

            console.log('Cliente conectado');

            // Mensajes
            socket.mensaje( cliente, this.io );



            // Desconectar
            socket.desconectar( cliente );

        });




    }
}