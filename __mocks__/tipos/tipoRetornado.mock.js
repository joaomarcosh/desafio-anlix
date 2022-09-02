const tipoRetornado = {
    id: expect.any(Number),
    descr_tipo: expect.any(String),
    createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
    updatedAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
};

module.exports = { tipoRetornado };
