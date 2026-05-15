import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import CalificacionesService from './../services/calificaciones-service.js';
import Calificacion from './../entities/calificacion.js';

const router = Router();
const currentService = new CalificacionesService();

router.get('', async (req, res) => {
    try {
        const returnArray = await currentService.getAllAsync();

        if (returnArray != null) {
            res.status(StatusCodes.OK).json(returnArray);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error interno.');
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let id = req.params.id;

        const returnEntity = await currentService.getByIdAsync(id);

        if (returnEntity != null) {
            res.status(StatusCodes.OK).json(returnEntity);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontró la calificación (id:${id}).`);
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
});

router.get('/alumno/:idAlumno', async (req, res) => {
    try {
        let idAlumno = req.params.idAlumno;

        const returnArray = await currentService.getByAlumnoAsync(idAlumno);

        res.status(StatusCodes.OK).json(returnArray);

    } catch (error) {
        console.log(error);

        if (error.message.includes('no existe')) {
            res.status(StatusCodes.NOT_FOUND).send(`Error: ${error.message}`);
        } else {
            res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
        }
    }
});

router.post('', async (req, res) => {
    try {
        let entity = req.body;

        const newEntity = await currentService.createAsync(entity);

        res.status(StatusCodes.CREATED).json(newEntity);

    } catch (error) {
        console.log(error);

        if (error.message.includes('Ya existe')) {
            res.status(StatusCodes.CONFLICT).send({ error: error.message });
        } else {
            res.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
        }
    }
});

router.put('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let entity = req.body;

        entity.id = id;

        const rowsAffected = await currentService.updateAsync(entity);

        if (rowsAffected != 0) {
            res.status(StatusCodes.OK).json(rowsAffected);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontró la calificación (id:${id}).`);
        }

    } catch (error) {
        console.log(error);

        if (error.message.includes('No se encontró')) {
            res.status(StatusCodes.NOT_FOUND).send(`Error: ${error.message}`);
        } else {
            res.status(StatusCodes.BAD_REQUEST).send(`Error: ${error.message}`);
        }
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let id = req.params.id;

        const rowCount = await currentService.deleteByIdAsync(id);

        if (rowCount != 0) {
            res.status(StatusCodes.OK).json(null);
        } else {
            res.status(StatusCodes.NOT_FOUND).send(`No se encontró la calificación (id:${id}).`);
        }

    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
});

export default router;