const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
//  configuração do cors para aceitar varios protocolos de requisiçao
const configCors = {
  origin: "*",
  optionsSuccessStatus: 200,
};
// conexão com o banco de dados mysql
const cx = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "onlatter",
  port: "3306",
});
cx.connect((error,dados)=>{
  if (error){
    console.error(`Erro ao tentar executar o servidor -> ${erro.stack}`);
    return;
  }
  console.log(`Dados do servidor -> ${cx.threadId}`);
});
// Rotas para o usuario
app.post("/usuario/cadastro", cors(configCors),(req,res)=>{
  const sh = req.body.senha;
  const us = req.body.nomeusuario;
  bcrypt.hash(sh, saltRound).then((senha)=>{
    cx.query(
      "insert to tbusuario set nomeusuario=?,senha=?",
      [us,senha],
      (error,result)=>{
        if (error){
          res.status(400).send({output:`não cadastrou -> ${error}`});
          return;
        }
        res.status(201).send({output:result});
      }
    );
  });
});
app.get("/usuario/listar",cors(configCors),(req,res)=>{
  cx.query("selec * from tbusuario", (error,result)=>{
    if(error){
      res
      .status(400)
      .send({output:`Não foi possivel listar os usuarios ${error}`});
      return;
    }
    res.status(200).send({output:result});
  });
});
app.put("/usuario/alterarsenha/:id", cors(configCors),(req,res)=>{
  cx.query
  "update tbusuario set ? whare idusuario=?",
  [req.body.params.id],
  (error,result)=>{
    if (error){
      res
      .status(400)
      .sand({output:`Não foi possivel alterar a senha -> ${error}`});
      return;
    }
    res.status(200).send({output:result});
  };
});
app.post("/usuario/login",cors(configCors),(req,res)=>{
  const us = req.body.nomeusuario;
  const em = req.body.email;
  const sh = req.body.senha;

  cx.query(
    `select u.* from tbusuario u
  inner join tbcliente cl
  on u.idusuario = cl.idusuario
  inner join tbcontato co
  on cl.idcontato = co.idcontato
  where (u.nomeusuario=? or cl.cpf=? or co.email=?)`,
  [us,em],
  (e,rs)=>{
    if (e) return res.status(400).send({output: e })
    bcrypt.compare(sh, rs[0].senha).then((resultado)=>{
      if (resultado){
        res.status(200).send({output:"Logado"});
      } else {
        res.status(404).send({output: "Usuario não localizado"});
      }
    });
  }
  )
});