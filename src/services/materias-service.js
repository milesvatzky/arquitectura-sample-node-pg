import MateriasRepository from '../repositories/materias-repository.js';

export default class MateriasService {

    constructor() {
        console.log('Estoy en: MateriasService.constructor()');

        this.MateriasRepository = new MateriasRepository();
    }

    getAllAsync = async () => {

        console.log(`MateriasService.getAllAsync()`);

        const returnArray =
            await this.MateriasRepository.getAllAsync();

        return returnArray;
    }

    getByIdAsync = async (id) => {

        console.log(`MateriasService.getByIdAsync(${id})`);

        const returnEntity =
            await this.MateriasRepository.getByIdAsync(id);

        return returnEntity;
    }

    createAsync = async (entity) => {

        console.log(`MateriasService.createAsync(${JSON.stringify(entity)})`);

        // Regla de negocio
        this.validarNombre(entity?.nombre);

        const rowsAffected =
            await this.MateriasRepository.createAsync(entity);

        return rowsAffected;
    }

    updateAsync = async (entity) => {

        console.log(`MateriasService.updateAsync(${JSON.stringify(entity)})`);

        // Regla de negocio
        this.validarNombre(entity?.nombre);

        const rowsAffected =
            await this.MateriasRepository.updateAsync(entity);

        return rowsAffected;
    }

    deleteByIdAsync = async (id) => {

        console.log(`MateriasService.deleteByIdAsync(${id})`);

        const rowsAffected =
            await this.MateriasRepository.deleteByIdAsync(id);

        return rowsAffected;
    }

    validarNombre = (nombre) => {

        if (
            !nombre ||
            nombre.trim() === ''
        ) {
            throw new Error(
                'El nombre de la materia es obligatorio.'
            );
        }
    }
}