const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');

const app = express();

//Determino quem pode accesar à aplicacao com o cors
app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

//Conecto o usuario numa sala unica
io.on('connection', socket => { //Se executa cada vez que usuario abrir app no frontend
	//O socket é a representacao da conexao com o server em tempo real
	//creo rooms para cada box, é como criar uma rota
	socket.on('ConnectRoom', box => {
		//frontend vai requisitar essa ConnectRoom, pasando o id da box
		socket.join(box); //Pego o socket que chamo essa ConnectRoom
		//e entao dou um join na sala box
	});

	//Ate aqui estou conectando o usuario numa sala especifica
	socket.on('ConnectAdmin', conexao => {
		socket.join(conexao);
	});
});

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-otylu.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true
});

//Como faco para enviar uma mensagem para o usuario em tempo real?
//Assim...

app.use((req, res, next) => {
	req.io = io;

	next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333);