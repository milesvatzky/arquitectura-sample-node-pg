import CalificacionesRepository from '../repositories/calificaciones-repository.js';
import AlumnosService from './alumnos-service.js';
import MateriasService from './materias-service.js';

export default class CalificacionesService {
    constructor() {
        console.log('Estoy en: CalificacionesService.constructor()');

        this.CalificacionesRepository = new CalificacionesRepository();
        this.AlumnosService = new AlumnosService();
        this.MateriasService = new MateriasService();
    }

    getAllAsync = async () => {
        console.log(`CalificacionesService.getAllAsync()`);

        const returnArray = await this.CalificacionesRepository.getAllAsync();
        return returnArray;
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesService.getByIdAsync(${id})`);

        const returnEntity = await this.CalificacionesRepository.getByIdAsync(id);
        return returnEntity;
    }

    getByAlumnoAsync = async (idAlumno) => {
        console.log(`CalificacionesService.getByAlumnoAsync(${idAlumno})`);

        // Validar que exista el alumno
        await this.validarAlumnoExiste(idAlumno);

        const returnArray = await this.CalificacionesRepository.getByAlumnoAsync(idAlumno);
        return returnArray;
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesService.createAsync(${JSON.stringify(entity)})`);

        // Validar nota
        this.validarNota(entity.nota);

        // Validar alumno
        await this.validarAlumnoExiste(entity.id_alumno);

        // Validar materia
        await this.validarMateriaExiste(entity.id_materia);

        // Validar duplicado alumno + materia
        const existente =
            await this.CalificacionesRepository.getByAlumnoMateriaAsync(
                entity.id_alumno,
                entity.id_materia
            );

        if (existente != null) {
            throw new Error(
                `Ya existe una calificación para el alumno ${entity.id_alumno} en la materia ${entity.id_materia}.`
            );
        }

        const rowsAffected =
            await this.CalificacionesRepository.createAsync(entity);

        return rowsAffected;
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesService.updateAsync(${JSON.stringify(entity)})`);

        // Verificar que exista
        const calificacion =
            await this.CalificacionesRepository.getByIdAsync(entity.id);

        if (calificacion == null) {
            throw new Error(
                `No se encontró la calificación (id:${entity.id}).`
            );
        }

        // Validar nota si viene
        if (entity.nota !== undefined) {
            this.validarNota(entity.nota);
        }

        // Validar alumno si viene
        if (entity.id_alumno) {
            await this.validarAlumnoExiste(entity.id_alumno);
        }

        // Validar materia si viene
        if (entity.id_materia) {
            await this.validarMateriaExiste(entity.id_materia);
        }

        const rowsAffected =
            await this.CalificacionesRepository.updateAsync(entity);

        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {
        console.log(`CalificacionesService.deleteByIdAsync(${id})`);

        const rowsAffected =
            await this.CalificacionesRepository.deleteByIdAsync(id);

        return rowsAffected;
    }

    // =========================
    // VALIDACIONES
    // =========================

    validarNota = (nota) => {
        if (
            nota === undefined ||
            nota === null ||
            !Number.isInteger(nota) ||
            nota < 0 ||
            nota > 10
        ) {
            throw new Error(
                'La nota debe ser un número entero entre 0 y 10.'
            );
        }
    }

    validarAlumnoExiste = async (idAlumno) => {
        if (!idAlumno) {
            throw new Error('El alumno es obligatorio.');
        }

        const alumno =
            await this.AlumnosService.getByIdAsync(idAlumno);

        if (alumno == null) {
            throw new Error(
                `El alumno con id ${idAlumno} no existe.`
            );
        }
    }

    validarMateriaExiste = async (idMateria) => {
        if (!idMateria) {
            throw new Error('La materia es obligatoria.');
        }

        const materia =
            await this.MateriasService.getByIdAsync(idMateria);

        if (materia == null) {
            throw new Error(
                `La materia con id ${idMateria} no existe.`
            );
        }
    }
}