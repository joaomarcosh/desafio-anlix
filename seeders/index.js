const db = require("../src/models");
const pacientes = require("./dados/pacientes.json");
const path = require("path");
const fs = require("fs");


class Seeder {

    static async criaPacientes() {
        const transacao_paciente = await db.sequelize.transaction();
        try {
            await db.Pacientes.bulkCreate(pacientes,{transaction:transacao_paciente});
            await transacao_paciente.commit();
        } catch(err) {
            await transacao_paciente.rollback();
            console.error(err.message);
        }
    }

    static async criaTipos() {
        const transacao_tipos = await db.sequelize.transaction();
        try {
            const caminhoDados = path.join(__dirname,'dados');
            const pastas = fs.readdirSync(caminhoDados,{withFileTypes:true});
            let tipo_dic = {};
            for (const pasta of pastas) {
                const indice = pastas.indexOf(pasta);
                if (pasta.isDirectory()) {
                    tipo_dic[pasta.name] = indice+1;
                    await db.Tipos_Leituras.create({descr_tipo:pasta.name},{transaction:transacao_tipos});
                }
            }
            await transacao_tipos.commit();
            return tipo_dic;
        } catch(err) {
            await transacao_tipos.rollback();
            console.error(err.message);
        }
    }

    static async criaLeituras() {
        const transacao_leituras = await db.sequelize.transaction();
        try {
            const caminhoDados = path.join(__dirname,'dados');
            const pastas = fs.readdirSync(caminhoDados,{withFileTypes:true});
            let tipos = await this.criaTipos();

            for (const pasta of pastas) {
                if (pasta.isDirectory()) {
                    const caminhoPasta = path.join(caminhoDados,pasta.name);
                    const arquivos = fs.readdirSync(caminhoPasta);
                    for (const arquivo of arquivos) {
                        let caminhoArquivo = path.join(caminhoPasta,arquivo);
                        const dados = fs.readFileSync(caminhoArquivo,'utf8');
                        const linhas = dados.trim().split("\n");

                        for (let i=1;i<linhas.length;i++) {
                            let linha_dados = linhas[i].split(" ");
                            let paciente_cpf = linha_dados[0];
                            let data = linha_dados[1];
                            let valor_leitura = linha_dados[2];

                            await db.Pacientes.findOne({
                                where: {cpf:paciente_cpf},
                                attributes:['id'],
                                raw:true
                            }).then(async ({id}) => await db.Leituras.create({
                                paciente_id: id,
                                data: data,
                                tipo_id: tipos[pasta.name],
                                valor: valor_leitura
                            },{transaction:transacao_leituras}));
                        }
                    }
                }
            }
            await transacao_leituras.commit();
        } catch(err) {
            await transacao_leituras.rollback();
            console.error(err.message);
        }
    }

    static async limpaCriaTudo(req,res) {
		await db.sequelize.sync({ force: true });
        await Seeder.criaPacientes();
        await Seeder.criaLeituras();
        return res.status(200).json({"mensagem": "tabelas populadas"});
    }
}

module.exports = Seeder;