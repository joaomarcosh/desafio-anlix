const tipoSelect = document.getElementById('tipoLeitura');
const pacienteInput = document.getElementById('nomePaciente');
const listaPacientes = document.getElementById('listaPacientes');
const botaoExportaUm = document.getElementById('exportaUm');
const botaoExportaTodos = document.getElementById('exportaTodos');
let myChart = null;
let tipos_dic = {};
let pacienteNome;
let pacienteID;

pacienteInput.addEventListener('keyup',_.debounce(pegaID,400));
tipoSelect.addEventListener('change',pegaID);
botaoExportaTodos.addEventListener('click',exportaTodos)
botaoExportaUm.addEventListener('click',exportaUm)

pegaPacientes();
pegaTipos();
criaGrafico();

function pegaPacientes() {
    fetch(`http://localhost:3000/pacientes`)
        .then(res => res.json())
        .then(dados => {
            let innerHtml = ``;
            for (let i=0;i<dados.length;i++) {
                const paciente = dados[i].nome;
                innerHtml += `<option value="${paciente}">\n`
            }
            listaPacientes.innerHTML = innerHtml;
        })
}

function pegaTipos() {
    fetch(`http://localhost:3000/tipos`)
        .then(res => res.json())
        .then(dados => {
            let innerHtml = ``;
            for (let i=0;i<dados.length;i++) {
                const value = dados[i].descr_tipo;
                const key = dados[i].id
                tipos_dic[key] = value;
                innerHtml += `<option value="${key}">${value}</option>\n`
            }
            tipoSelect.innerHTML = innerHtml;
            document.querySelector('th')
                .setAttribute('colspan',`${Object.keys(tipos_dic).length+1}`);
        })
}

function pegaID() {
    const nomePesquisa = pacienteInput.value;
    fetch(`http://localhost:3000/pacientes?nome=${nomePesquisa}`)
        .then(res => res.json())
        .then(dados => {
            pacienteID = dados[0].id;
            const tipo = tipoSelect.value;
            pacienteNome = dados[0].nome;
            pegaLeituras(pacienteID,tipo);
            pegaLeiturasRecentes(pacienteID);
        })
}

function pegaLeituras(paciente_id,tipo_id) {
    fetch(`http://localhost:3000/leituras/${paciente_id}/${tipo_id}`)
        .then(res => res.json())
        .then(dados => criaGrafico(dados))
}

function pegaLeiturasRecentes(id) {
    fetch(`http://localhost:3000/leituras/recentes/${id}`)
        .then(res => res.json())
        .then(dados => {
            criaTabelaLeituras(dados);
        })
}

function criaGrafico(dados = null) {
    let grafico = {};
    if (dados != null) {
        for (let i = 0; i<dados.length;i++) {
            let {data,valor} = dados[i];
            grafico[data] = Number(valor);
        }
    } else {
        grafico = {
            "1970-01-01": "0",
            "2030-01-01": "0"
        }
    }

    const data = {
        datasets: [{
            data: {...grafico},
            label: `${pacienteNome || "Nenhum paciente selecionado"}`,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    type: 'time',
                    bounds: 'ticks',
                    time: {
                        unit: 'day',
                        stepSize: 7,
                        displayFormats: {
                            day: 'DD[/]MM[/]YYYY'
                        },
                        tooltipFormat: 'DD[/]MM[/]YYYY - HH:mm:ss'
                    }
                },
                y: {
                    min: 0,
                    max: 1
                }
            },
            elements: {
                point: {
                    hitRadius: 5
                }
            }
        }
    };

    if (myChart!=null) myChart.destroy();
    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );
}

function criaTabelaLeituras(dados) {
    let tableLeitura = `<th>Tipo de Leitura</th>\n`;
    let tableData = `<th>Data da Leitura</th>\n`;
    let tableValor = `<th>Valor da Leitura</th>\n`;
    for (let i=0;i<dados.length;i++) {
        const tipoLeitura = tipos_dic[dados[i].tipo_id];
        const data = moment(dados[i].data).format('DD[/]MM[/]YYYY-HH:mm:ss');
        const valor = dados[i].valor;
        tableLeitura += `<td>${tipoLeitura}</td>\n`;
        tableData += `<td>${data}</td>\n`;
        tableValor += `<td>${valor}</td>\n`;
    }
    document.getElementById('tableTipoLeitura').innerHTML = tableLeitura;
    document.getElementById('tableDataLeitura').innerHTML = tableData;
    document.getElementById('tableValorLeitura').innerHTML = tableValor;
}

function exportaUm() {
    fetch(`http://localhost:3000/leituras/${pacienteID}/${tipoSelect.value}`)
        .then(res => {
            if (res.ok) return res.json()
            throw new Error("Nenhum paciente selecionado")
        })
        .then(dados => {
            const csv = converteJSONParaCSV(dados)
            const blob = new Blob([csv],
                { type: "text/csv;charset=utf-8" });
            saveAs(blob, `Leituras - ${pacienteNome}.csv`);
        }).catch((erro) => console.error(erro.message))
}

function exportaTodos() {
    fetch(`http://localhost:3000/leituras`)
        .then(res => res.json())
        .then(dados => {
            const csv = converteJSONParaCSV(dados)
            const blob = new Blob([csv],
                { type: "text/csv;charset=utf-8" });
            saveAs(blob, "Todas Leituras.csv");
        })
}

function converteJSONParaCSV(json) {
    const dados = json
    const fields = Object.keys(dados[0])
    const replacer = function(key, value) { return value === null ? '' : value }
    let csv = dados.map(function(row){
        return fields.map(function(fieldName){
            return JSON.stringify(row[fieldName], replacer)
        }).join(';')
    })
    csv.unshift(fields.join(';')) // add header column
    csv = csv.join('\r\n');
    return csv
}