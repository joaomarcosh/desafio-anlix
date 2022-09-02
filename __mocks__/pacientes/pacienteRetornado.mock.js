const pacienteRetornado = {
    id: expect.any(Number),
    nome: expect.any(String),
    cpf: expect.stringMatching(/\d{3}-\d{3}-\d{3}-\d{2}/),
    rg: expect.stringMatching(/\d{7}-\d/),
    data_nasc: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
    email: expect.any(String),
    senha: expect.any(String),
    tipo_sanguineo: expect.stringMatching(/[ABO]B?[+-]/),
    createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
    updatedAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
};

module.exports = { pacienteRetornado };
