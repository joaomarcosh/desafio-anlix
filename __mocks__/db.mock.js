const todosRegistros = [
    { id: 1, paciente_id: 1, tipo_id: 1, data: new Date('2022-08-25'), valor: 0.75 },
    { id: 2, paciente_id: 2, tipo_id: 2, data: new Date('2022-08-25'), valor: 0.65 },
];

const novoRegistro = { id: 3, paciente_id: 1, tipo_id: 2, data: new Date('2022-08-25'), valor: 0.55 };

const registroAtualizado = { id: 3, paciente_id: 1, tipo_id: 1, data: new Date('2022-08-25'), valor: 0.55 };

function leiturasRecentesQueryString(condicao) {
    return `SELECT r.*
            FROM "Leituras" AS r
            JOIN (
                SELECT MAX(data) AS date, tipo_id, paciente_id
                FROM "Leituras" AS gp
                ${condicao}
                GROUP BY tipo_id, paciente_id
            ) AS gp
            ON r.data = gp.date
            AND r.tipo_id = gp.tipo_id
            ORDER BY paciente_id ASC, tipo_id ASC;`
}

module.exports = { todosRegistros, novoRegistro, registroAtualizado, leiturasRecentesQueryString };