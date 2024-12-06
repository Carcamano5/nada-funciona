import express from "express";
//commonjs const express = require('express')

import session from "express-session";


import cookieParser from "cookie-parser";


const app = express();

app.use(session({
  secret: 'Mazzega',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30,
    secure: false,
    httpOnly: true,
  }
  
}))

app.use(cookieParser());
//configurar aplicação para receber dados do formulario

app.use(express.urlencoded({ extended: true }));




import path from 'path';
app.use(express.static(path.join(process.cwd(), 'pages/public')));


const porta = 3000;
const host = "0.0.0.0"; //IP se refere-se a todas as interfaces locais (Placas de rede) no seu PC

var listaRegis = []; //Variavel global - Lista para armazenar os cadastros
//implementar a tareda para entregar um formulario html para o cliente

function CadsProdsView(req, resp) {
  resp.send(`
        <html>
                <head>
                    <tittle>Cadastro de Usuarios</tittle>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
      <body>
                    <div class="container text-center">
                        <h1>Cadastro de Usuarios</h1>

        <form method="POST" action="/Produto" class="row g-3">

            <div class="form-group">
                <label for="formGroupExampleInput">Nome de usuario</label>
                <input type="text" class="form-control" id="NomeUser" name="NomeUser" placeholder="Insira seu nome de usuario">
            </div>

            <div class="form-group">
                <label for="formGroupExampleInput2">Data de nascimento</label>
                <input type="text" class="form-control" id="NascUser" name="NascUser"placeholder="Informe sua data de nascimento">
            </div>

            <div class="form-group">
                <label for="formGroupExampleInput2">Nickname ou apelido</label>
                <input type="text" class="form-control" id="NickUser" name="NickUser" placeholder="Informe seu nickname ou apelido">
            </div>

            <div class="col-12">
                <button class="btn btn-primary" type="submit">Cadastrar User</button>
            </div>
            
        </form> 
        </body>
        
      </html> 
    `);
}

function menuView(req, resp) {
  const dataHoraUlt = req.cookies['dataHoraUlt'];
  if(!dataHoraUlt)
  {
    dataHoraUlt = ''
  }
  resp.send(`
        <head>
            <tittle>Menu</tittle>
        </head>
        <body>
             <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-md">
                    <a class="navbar-brand" href="/Produto">Cadastrar Usuarios</a>
                    <br>
                    <a class="navbar-brand" href="/batepapo">Bate papo</a>
                    <br>
                    <a class="navbar-brand" href="/logout">Logout</a>
                    <br>
                 </div>
            </nav><span>Seu ultimo acesso em ${dataHoraUlt}</span>
        </body>
        `);
}

function CadastraProduto(req, resp) {
  //recuperar os dados do formulario enviado para o servidor
  //adicionar o produto na lista
  const NomeUser = req.body.NomeUser;
  const NascUser = req.body.NascUser;
  const NickUser = req.body.NickUser;
 
 

  //valida dados

  if (NomeUser && NascUser && NickUser) {
    //entrada valida!

    const regis = { NomeUser, NascUser, NickUser };//dados validos = cria instancia
    listaRegis.push(regis);

    
    resp.write(`
            <html>
                <head>
                    <tittle>Usuarios Cadastrados</tittle>
                    <meta charset = "utf-8">
                </head>

                 <body>
                    <table class="table">
                         <thead>
                        <tr>
                           
                            <th scope="col">Nome do usuario:</th>
                            <th scope="col">Data de nascimento:</th>
                            <th scope="col">Nickname ou apelido:</th>
                             </tr>
                                </thead>
                                     <tbody>`);
    //adicionar as linhas da tabela, para cada produto nos devemos criar uma linha
    for (var i = 0; i < listaRegis.length; i++) {
      resp.write(`<tr>
                        <td>${listaRegis[i].NomeUser}</td>
                        <td>${listaRegis[i].NascUser}</td>
                        <td>${listaRegis[i].NickUser}</td>
                    </tr>`);
    }

    resp.write(`</tbody>
            </table>
             </body>
            </html>
        `);
  } //fim da validação

  else
  {
    //enviar de volta o form de cadastro contendo msg de validação
    //implementar o html com o esse conteud!
    resp.write(` <html>
                <head>
                    <tittle>Cadastro de usuarios</tittle>
                    <meta charset = "utf-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container text-center">
                        <h1>Cadastro de usuarios</h1>

        <form method="POST" action="/Produto" class="row g-3">
        <div class="col-md-4">
          <div class="form-group">
                <label for="formGroupExampleInput">Nome de usuario</label>
                <input type="text" class="form-control" id="NomeUser" name="NomeUser" value="${NomeUser}">
            </div>
        </div>`);

        if(!NomeUser || NomeUser.trim().length < 8)
        {
          resp.write(`
                <div>
                    <span style="color: red; ">O nome do usuario não pode estar vazio ou ter menos que 8 caracteres!</span>
                     
                </div>
            `);
        }

        resp.write(`
        <div class="col-md-4">
              <div class="form-group">
                <label for="formGroupExampleInput2">Data de nascimento</label>
                <input type="text" class="form-control" id="NascUser" name="NascUser" value="${NascUser}">
            </div>


        </div>
          `)
          const regex = /^\d{2}-\d{2}-\d{4}$/;
          if(!NascUser || !regex.test(NascUser) || NascUser.trim().length < 10)
          {
            resp.write(`
              <div>
                  <span style="color: red;" >A data de nascimento não pode estar vazia, ou deve estar no padrão dd/mm/aa</span>
              </div>
          `);
          }

          resp.write(`
                <div class="col-md-6">
                  <div class="form-group">
                       <label for="formGroupExampleInput2">Nickname ou apelido</label>
                      <input type="text" class="form-control" id="NickUser" name="NickUser" value="${NickUser}">
                  </div>


                </div>
            `)
            if(!NickUser || NickUser.trim().length < 7)
            {
              resp.write(`
                     <div>
                          <span style="color: red;"  >Nickname não pode estar vazio e ser menor que 7 caracteres</span>
                      </div>
                </html>`)
            }

        
            
  }//fim else

 

  resp.end(); //sera enviada a resposta
}




const mensagens = [];


function batePapoView(req, resp) {
  let opcoesUsuarios = '';
  for (let i = 0; i < listaRegis.length; i++) {
    opcoesUsuarios += `<option value="${listaRegis[i].NomeUser}">${listaRegis[i].NomeUser}</option>`;
  }
    

  resp.send(`
    <html>
      <head>
        <title>Bate-papo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container mt-4">
          <h1>Bate-papo</h1>
          <form id="batePapoForm" method="POST" action="/batepapo">
            <div class="mb-3">
              <label for="usuario">Usuário:</label>
              <select id="usuario" name="usuario" class="form-select" required>
                <option value="">Selecione um usuário</option>
                ${opcoesUsuarios}
              </select>
              <small id="erroUsuario" class="text-danger d-none">Selecione um usuário antes de enviar!</small>
            </div>
            <div class="mb-3">
              <label for="mensagem">Mensagem:</label>
              <textarea id="mensagem" name="mensagem" class="form-control" rows="3" required></textarea>
            </div>
            <button class="btn btn-primary">Enviar</button>
          </form>
          <hr>
          <h2>Mensagens:</h2>
          <ul class="list-group">
            ${mensagens.map(
              (msg) =>
                `<li class="list-group-item"><strong>${msg.usuario}</strong>: ${msg.texto} [${msg.dataHora}]</li>`
            ).join("")}
          </ul>
        </div>
      </body>
    </html>
  `);
}

// Processar envio de mensagens
function processaBatePapo(req, resp) {
  const { usuario, mensagem } = req.body;

  if (!usuario || !mensagem) {
    resp.send("<p>Todos os campos são obrigatórios! <a href='/batepapo'>Voltar</a></p>");
    return;
  }

  mensagens.push({
    usuario,
    texto: mensagem,
    dataHora: new Date().toLocaleString(),
  });

  resp.redirect("/batepapo");
}












function autenticar(req, resp)
{
  const usuario = req.body.usuario;
  const senha = req.body.senha;

  if(usuario === 'admin' && senha === '123')
  {
    req.session.usuarioLogado = true
    resp.cookie('dataHoraUlt',new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
    resp.redirect("/")
  }
  else
  {
    resp.send(`<html>
              <head>
    <meta charset="utf-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

      <body>
        <p>senha invalida</p>
                <div>
                  <a href="/login.html">Tentar denovo</a>
                </div>
      </html>
      </body>
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>
      `
    );
  }
}

function verificarAut(req, resp, next)
{
  if(req.session.usuarioLogado)
  {
    next();
  }
  else
  {
    resp.redirect('/login.html');
  }

}

app.get('/login', (req, resp) => {
  resp.redirect('/login.html');
});

app.get('/logout', (req, resp) =>{
  req.session.destroy();
})

app.get("/batepapo", verificarAut, batePapoView);
app.post("/batepapo", verificarAut, processaBatePapo);
app.post('/login', autenticar);
app.get("/", verificarAut, menuView);
app.get("/Produto",verificarAut, CadsProdsView); //enviar o formulario para cadastrar o aluno
//novidade desta aula é o metodo post
app.post("/Produto",verificarAut,  CadastraProduto);

app.listen(porta, host, () => {
  console.log(
    `Servidor iniciado e em execução no endereço http:// ${host}:${porta}`
  );
});
