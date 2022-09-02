const usuarioRetornado = {
    id: expect.any(Number),
    usuario: expect.any(String),
    cargo: expect.any(String),
    createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
    updatedAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
};

module.exports = { usuarioRetornado };
