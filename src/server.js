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

io.on('connection', socket => {
	socket.on('ConnectRoom', box => {
		socket.join(box);
	});
});

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-otylu.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true
});

app.use((req, res) => {
	req.io = io;

	next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333);