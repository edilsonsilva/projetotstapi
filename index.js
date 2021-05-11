const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const optCors = {
    origin:"*",
    optionSuccessStatus:"200"
}

// configurações do banco de dados

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'tstdb'
});
connection.connect((erro)=>{
    if(erro){
        console.error(`Erro ao estabelecer a conexão com o banco de dados ${erro.stack}`);
        return;
    }
    console.log(`Conectado ao servidor -> ${connection.threadId}`);
});

// rotas para mainupulação de usuario
app.get("/usuario/listar",cors(optCors),(req,res)=>{
    connection.query('SELECT * FROM usuario',(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar listar os usuários -> ${error}`});
            return;
        }
        res.status(200).send({result:data});
    });
});

app.get("/usuario/codigo/:id",cors(optCors),(req,res)=>{
    connection.query('SELECT * FROM usuario WHERE `idusuario`=?',[req.params.id],(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar listar os usuários -> ${error}`});
            return;
        }
        res.status(200).send({result:data});
    });
});

// login
app.post("/usuario/login",cors(optCors),(req,res)=>{
    let body = req.body;
    connection.query('SELECT * FROM usuario WHERE nomeusuario=? AND senha=?',[body.nomeusuario,body.senha],(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar logar -> ${error.stack}`});
            return;
        }
        if(data=="" || data==null){
            res.status(400).send({result:`NLogin`});
            return;
        }
        res.status(200).send({result:data});
    })
})


app.post("/usuario/cadastro",cors(optCors),(req,res)=>{
    let body = req.body;
    connection.query('INSERT INTO usuario SET ?', body,(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar cadastrar o usuário -> ${error.stack}`});
            return;
        }
        res.status(201).send({result:data});
    });
});

app.put("/usuario/updatedata/:id",cors(optCors),(req,res)=>{
    let body = req.body;
    let id = req.params.id;
    connection.query("UPDATE usuario SET ? WHERE idusuario = ?",[body,id],(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar atualizar os dados do usuário -. ${error.stack}`});
            return;
        }
        res.status(200).send({result:data});
    });
});





// rotas para manipulação de epis
app.get("/epi/listar",cors(optCors),(req,res)=>{
    connection.query("SELECT * FROM epi",(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar listar os epis -> ${error.stack}`});
            return;
        }
        res.status(200).send({result:data});
    });
});

app.post("/epi/cadastro",cors(optCors),(req,res)=>{
    connection.query("insert into epi set ?",[req.body],(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar cadastrar os epis -> ${error.stack}`});
            return;
        }
        res.status(200).send({result:data});
    });
});



app.get("/retirada_devolucao/listar",cors(optCors),(req,res)=>{
    connection.query(`select e.nomeepi,e.datavalidade,r.idretirada_devolucao,r.dataretirada, r.datadevolucao,r.devolvido 
    from epi e inner join retirada_devolucao r on e.idepi = r.idepi`,(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar listar as retiradas e devoluções -> ${error.stack}`});
            return;
        }
        res.status(200).send({result:data});
    });
});

app.get("/retirada_devolucao/listar/:id",cors(optCors),(req,res)=>{
    connection.query(`select e.nomeepi,e.datavalidade,r.idretirada_devolucao,r.dataretirada, r.datadevolucao,r.devolvido 
    from epi e inner join retirada_devolucao r on e.idepi = r.idepi where r.idusuario=?`,[req.params.id],(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar listar as retiradas e devoluções -> ${error.stack}`});
            return;
        }
        res.status(200).send({result:data});
    });
});


app.post("/retirada_devolucao/cadastro",cors(optCors),(req,res)=>{
    let body = req.body;
    connection.query('INSERT INTO retirada_devolucao SET ?', body,(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar cadastrar a retirada do epi -> ${error.stack}`});
            return;
        }
        res.status(201).send({result:data});
    });
});


app.put("/retirada_devolucao/updatedata/:id",cors(optCors),(req,res)=>{
    let body = req.body;
    let id = req.params.id;
    connection.query("UPDATE retirada_devolucao SET ? WHERE idretirada_devolucao = ?",[body,id],(error,data,fields)=>{
        if(error){
            res.status(400).send({result:`Erro ao tentar atualizar os dados do a devolução -. ${error.stack}`});
            return;
        }
        res.status(200).send({result:data});
    });
});

//informacoes do servidor
app.listen(3218,()=>console.log(`Servidor online na porta 5535`));