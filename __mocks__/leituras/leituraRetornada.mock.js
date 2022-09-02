const leituraRetornada = {
    id: expect.any(Number),
    paciente_id: expect.any(Number),
    data: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
    tipo_id: expect.any(Number),
    valor: expect.any(Number),
    createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
    updatedAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
};

module.exports = { leituraRetornada };
