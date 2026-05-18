import Db from './db-pg.js';

const { Client } = Db;

export default class CalificacionesRepository {

    getAllAsync = async () => {
        const client = new Client(config);

        try {
            await client.connect();

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
                INNER JOIN alumnos a
                    ON c.id_alumno = a.id
                INNER JOIN materias m
                    ON c.id_materia = m.id
                ORDER BY c.id
            `;

            const result = await client.query(sql);

            return result.rows;

        } catch (error) {
            throw error;

        } finally {
            await client.end();
        }
    }

    getByIdAsync = async (id) => {
        const client = new Client(config);

        try {
            await client.connect();

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
                INNER JOIN alumnos a
                    ON c.id_alumno = a.id
                INNER JOIN materias m
                    ON c.id_materia = m.id
                WHERE c.id = $1
            `;

            const values = [id];

            const result = await client.query(sql, values);

            return result.rows[0];

        } catch (error) {
            throw error;

        } finally {
            await client.end();
        }
    }

    getByAlumnoAsync = async (idAlumno) => {
        const client = new Client(config);

        try {
            await client.connect();

            const sql = `
                SELECT
                    c.id,
                    c.id_materia,
                    m.nombre AS nombre_materia,
                    c.nota,
                    c.fecha
                FROM calificaciones c
                INNER JOIN materias m
                    ON c.id_materia = m.id
                WHERE c.id_alumno = $1
                ORDER BY c.id
            `;

            const values = [idAlumno];

            const result = await client.query(sql, values);

            return result.rows;

        } catch (error) {
            throw error;

        } finally {
            await client.end();
        }
    }

    getByAlumnoMateriaAsync = async (idAlumno, idMateria) => {
        const client = new Client(config);

        try {
            await client.connect();

            const sql = `
                SELECT *
                FROM calificaciones
                WHERE id_alumno = $1
                AND id_materia = $2
            `;

            const values = [idAlumno, idMateria];

            const result = await client.query(sql, values);

            return result.rows[0];

        } catch (error) {
            throw error;

        } finally {
            await client.end();
        }
    }

    createAsync = async (entity) => {
        const client = new Client(config);

        try {
            await client.connect();

            const sql = `
                INSERT INTO calificaciones
                (id_alumno, id_materia, nota, fecha)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;

            const values = [
                entity.id_alumno,
                entity.id_materia,
                entity.nota,
                entity.fecha || null
            ];

            const result = await client.query(sql, values);

            return result.rows[0];

        } catch (error) {
            throw error;

        } finally {
            await client.end();
        }
    }

    updateAsync = async (entity) => {
        const client = new Client(config);

        try {
            await client.connect();

            const sql = `
                UPDATE calificaciones
                SET nota = $2,
                    fecha = $3
                WHERE id = $1
            `;

            const values = [
                entity.id,
                entity.nota,
                entity.fecha || null
            ];

            const result = await client.query(sql, values);

            return result.rowCount;

        } catch (error) {
            throw error;

        } finally {
            await client.end();
        }
    }

    deleteByIdAsync = async (id) => {
        const client = new Client(config);

        try {
            await client.connect();

            const sql = `
                DELETE FROM calificaciones
                WHERE id = $1
            `;

            const values = [id];

            const result = await client.query(sql, values);

            return result.rowCount;

        } catch (error) {
            throw error;

        } finally {
            await client.end();
        }
    }
}