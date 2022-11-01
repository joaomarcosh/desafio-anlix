# Desafio Anlix
Repositório onde foi feita a implementação do [desafio](https://github.com/anlix-io/desafio-anlix) proposto pela **anlix-io**.
Este projeto foi desenvolvido com Node.js para implementar uma base de dados Postgres utilizando a biblioteca Sequelize como ORM.

**Status do Projeto** : Finalizado

![Badge](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## Tabela de Conteúdo

1. [Requisitos](#requisitos)
2. [Instalação](#instalação)
3. [Configuração](#configuração)
4. [Uso](#uso)
5. [Arquitetura](#arquitetura)
6. [Funcionalidades](#funcionalidades)
7. [Endpoints](#endpoints)

## Requisitos
Para rodar este projeto é necessário ter instalados o **nodejs**, **npm** e algum banco de dados entre **PotgreSQL**, **MariaDB**, **MySQL** e **SQLite**. É possível também rodar através do **docker compose**.

## Instalação
- Repositório Git
  *Clone o repositório*
``` bash
$ git clone https://github.com/joaomarcosh/desafio-anlix
```
- Dependências
  *Instale as dependências necessárias*
``` bash
$ cd desafio-anlix
$ npm install
```
O comando *install* não é necessário se decidir rodar o projeto com o docker.

## Configuração
*No backend, temos que criar um banco de dados para a nossa aplicação, assim como configurar o arquivo ```.env```.* 
*Além disso, também é necessário migrar e seedar os dados para o banco de dados.*
*Segue o passo a passo.*

- Banco de dados
  *Abaixo são apresentados os comandos para criar uma base de dados Postgres.*

- *Comandos no bash.*
```
$ createdb <nome_do_banco>;
```
-  *Comandos no psql*
```
$ CREATE DATABASE <nome_do_banco>;
```

- Crie o arquivo ```.env```
  *Copie o conteúdo do arquivo de exemplo ```.envExemplo``` e renomeie para ```.env```*

- Configure o arquivo ```.env```
  *Adicione as informações necessárias para o backend rodar*
  **Não é necessario caso use o docker*
``` text
DB_username = <nome_usuario>
DB_password = <senha>
DB_database = <nome_do_banco>
DB_host = 127.0.0.1
DB_dialect = <tipo_do_banco> # postgres || mysql || mariadb || sqlite
PORT = 3000
```

## Uso
 - Docker
Caso tenha o docker, o projeto pode ser utilizado com o comando
```bash
$ docker compose up
```

 - Terminal
*Para rodar o projeto a partir do terminal, siga as instruções*

``` bash
$ node src/server.js
```

Para criar e popular as tabelas, acesse o endpoint ```/seed```

*Por fim, abra a URL ```localhost:PORT/dashboard.html```, onde ```PORT``` é a porta definida no arquivo ```.env``` (padrão 3000), no browser de escolha.*

## Arquitetura
- O banco de dados conta com três tabelas: **Pacientes**, **Leituras** e **Tipos_Leituras**. As tabelas **Pacientes** e **Tipos_Leituras** possuem uma relação one-to-many com a tabela **Leituras**, de forma que um paciente e um tipo de leitura pode possuir n leituras, e uma leitura só pode estar associada a um único paciente e um único tipo de leitura;

![](https://i.imgur.com/rS4CGwq.png)

- Para popular o banco de dados, foi criado um **Seeder**. O Seeder primeiro faz um BULK INSERT dos dados dos pacientes, contidos em um único arquivo JSON, na tabela **Pacientes**. Após os pacientes é feita a criação dos tipos de leituras a partir do nome dos diretórios onde os arquivos de leituras estão inseridos. Por fim, para popular a tabela de leituras, o Seeder percorre todos os arquivos nos diretórios e faz um ```SELECT``` para cada leitura a fim de encontrar o ID do paciente e fazer a inserção dos dados na tabela.

## Funcionalidades
- [x] Consultar, para cada paciente, cada uma das características individualmente e cada uma delas sendo a mais recente disponível;
- [x] Consultar em uma única chamada, todas as características de um paciente, com os valores mais recentes de cada uma;
- [x] Consultar para uma determinada data (dia, mês e ano), todas as características existentes de todos os pacientes da base de dados;
- [x] Consultar uma característica qualquer de um paciente para um intervalo de datas a ser especificado na chamada da API;
- [x] Consultar o valor mais recente de uma característica de um paciente que esteja entre um intervalo de valores;
- [x] Consultar pacientes que contenham um nome ou parte de um nome a ser especificado na chamada da API;
- [x] Buscar um paciente por nome e exibir o valor mais recente de cada uma de suas características;
- [x] Ser possível exportar as características de um ou mais pacientes de todas as datas disponíveis para um arquivo CSV;
- [x] Exibir um gráfico temporal para um determinado paciente e uma determinada característica a ser inserida através da interface.

## Endpoints

O projeto contém um arquivo chamado Desafio-Anlix.postman_collection para importar uma coleção de endpoints no programa Postman.
