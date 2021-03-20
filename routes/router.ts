import { Router, Request, Response } from 'express';

import Server from '../classes/server';

import { usuariosConectados } from '../sockets/sockets';



const router = Router();

router.get( '/mensajes', ( req: Request, res: Response ) => {

    res.json({
        ok: true,
        mensaje: 'Todo está bien!!'
    });

});


router.post( '/mensajes', ( req: Request, res: Response ) => {

    const de     = req.body.de;
    const cuerpo = req.body.cuerpo;

    const payload = {
        de,
        cuerpo
    };
    
    const server = Server.instance;

    server.io.emit( 'mensaje-nuevo', payload );
    
    res.json({
        ok: true,
        cuerpo,
        de
    });

});


router.post( '/mensajes/:id', ( req: Request, res: Response ) => {

    const id     = req.params.id;
    const de     = req.body.de;
    const cuerpo = req.body.cuerpo;

    const payload = {
        de,
        cuerpo
    };

    const server = Server.instance;

    server.io.to( id ).emit( 'mensaje-privado', payload );

    res.json({
        ok: true,
        id,
        de,
        cuerpo
    });

});


// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', ( req: Request, res: Response ) => {

    const server = Server.instance;

    server.io.allSockets()
        .then( clientes => res.json({
            ok: true,
            clientes: Array.from(clientes)
            }))
        .catch( err => res.json({
            ok: false,
            err
        }));
}); 


// Obtener usuarios y sus nombres
router.get( '/usuarios/detalle', ( req: Request, res: Response ) => {    

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

});





export default router;
