const Box = require('../models/Box');

class BoxController {
	async store(req, res){

		const box = await Box.create({ title: req.body.title });

		//Noticio todos os usuarios de um novo box criado, representado com "createdBox"
		req.io.sockets.in(123).emit("createdBox", box);

		return res.json(box);
	}

	async show(req, res){
		const box = await Box.findById(req.params.id).populate({
			path: 'files',
			options: {
				sort: { createdAt: -1 }
			}
		});

		return res.json(box);
	}

	async list(req, res){
		try{
			const box = await Box.find().sort({
				createdAt: -1
			});
			return res.json(box);
		}catch(err){
			return res.status(400).send('Nao ha boxes disponiveis');
		}
		
	}
}

module.exports = new BoxController();