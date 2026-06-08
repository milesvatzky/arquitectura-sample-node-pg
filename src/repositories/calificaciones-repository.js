import Db from './db-pg.js';

export default class CalificacionesRepository {
    constructor() {
        console.log('Estoy en: CalificacionesRepository.constructor()');
        this.db = new Db();
    }

    getAllAsync = async () => {
        console.log('CalificacionesRepository.getAllAsync()');

        const sql = `
            SELECT
                c.id,
                c.id_alumno,
                a.nombre AS nombre_alumno,
                a.apellido AS apellido_alumno,
                c.id_materia,
                m.nombre AS nombre_materia,
                c.nota,
                c.fecha
            FROM calificaciones c
            INNER JOIN alumnos a ON c.id_alumno = a.id
            INNER JOIN materias m ON c.id_materia = m.id
            ORDER BY c.id
        `;

        return await this.db.queryAll(sql);
    }

    getByIdAsync = async (id) => {
        console.log(`CalificacionesRepository.getByIdAsync(${id})`);

        const sql = `
            SELECT
                c.id,
                c.id_alumno,
                a.nombre AS nombre_alumno,
                a.apellido AS apellido_alumno,
                c.id_materia,
                m.nombre AS nombre_materia,
                c.nota,
                c.fecha
            FROM calificaciones c
            INNER JOIN alumnos a ON c.id_alumno = a.id
            INNER JOIN materias m ON c.id_materia = m.id
            WHERE c.id = $1
        `;

        return await this.db.queryOne(sql, [id]);
    }

    getByAlumnoAsync = async (idAlumno) => {
        console.log(`CalificacionesRepository.getByAlumnoAsync(${idAlumno})`);

        const sql = `
            SELECT
                c.id,
                c.id_materia,
                m.nombre AS nombre_materia,
                c.nota,
                c.fecha
            FROM calificaciones c
            INNER JOIN materias m ON c.id_materia = m.id
            WHERE c.id_alumno = $1
            ORDER BY c.id
        `;

        return await this.db.queryAll(sql, [idAlumno]);
    }

    getByAlumnoMateriaAsync = async (idAlumno, idMateria) => {
        console.log(`CalificacionesRepository.getByAlumnoMateriaAsync(${idAlumno}, ${idMateria})`);

        const sql = `
            SELECT *
            FROM calificaciones
            WHERE id_alumno = $1
            AND id_materia = $2
        `;

        return await this.db.queryOne(sql, [idAlumno, idMateria]);
    }

    createAsync = async (entity) => {
        console.log(`CalificacionesRepository.createAsync(${JSON.stringify(entity)})`);

        const sql = `
            INSERT INTO calificaciones
            (
                id_alumno,
                id_materia,
                nota,
                fecha
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            RETURNING id
        `;

        const values = [
            entity?.id_alumno ?? 0,
            entity?.id_materia ?? 0,
            entity?.nota ?? 0,
            entity?.fecha ?? null
        ];

        return await this.db.queryReturnId(sql, values);
    }

    updateAsync = async (entity) => {
        console.log(`CalificacionesRepository.updateAsync(${JSON.stringify(entity)})`);

        const previousEntity = await this.getByIdAsync(entity.id);

        if (previousEntity == null) {
            return 0;
        }

        const sql = `
            UPDATE calificaciones
            SET
                nota = $2,
                fecha = $3
            WHERE id = $1
        `;

        const values = [
            entity.id,
            entity?.nota ?? previousEntity.nota,
            entity?.fecha ?? previousEntity.fecha
        ];

        return await this.db.queryRowCount(sql, values);
    }

    deleteByIdAsync = async (id) => {
        console.log(`CalificacionesRepository.deleteByIdAsync(${id})`);

        const sql = `
            DELETE FROM calificaciones
            WHERE id = $1
        `;

        return await this.db.queryRowCount(sql, [id]);
    }
}