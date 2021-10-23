const express = require('express');
const app = express();
const fs = require('fs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const mongoUri = 'mongodb://localhost:27017/insuremind'
const Message = require('./models/message');
const Collection1 = require('./models/collection1')
const Collection2 = require('./models/collection2')

mongoose.connect(mongoUri, { useNewUrlParser: true })
	.then(() => console.log("Mongodb Connected"))
	.catch(err => console.log(err))

const mainroute = require('./routes/index.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mainroute)

corn.schedule('* * * * *', () => {
	console.log('running a task every minute');
	messageInsertion();
	collectiondatacopy();
});

async function messageInsertion() {
	fs.readFile("./message.json", "utf8", (err, jsonString) => {
		if (err) {
			console.log("File read failed:", err);
			return;
		}
		var obj = JSON.parse(jsonString);
		if (obj && obj.length) {
			for (var i = 0; i < obj.length; i++) {
				var today = new Date();
				var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
				var time = today.getHours() + ":" + today.getMinutes();
				if (obj[i].day == date && obj[i].time == time) {
					let messageObj = { message: obj[i].message, day: obj[i].day, time: obj[i].time }
					const message = new Message(messageObj);
					message.save();
				}
			}
		}
	});
};
async function collectiondatacopy() {
	const collection1Obj = await Collection1.find({});
	if (collection1Obj) {
		for (var j = 0; j < collection1Obj.length; j++) {
			var today = new Date();
			var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			var time = today.getHours() + ":" + today.getMinutes();
			var datetime = date+ " "+ time;
			if (collection1Obj[j].timestamp == datetime) {
				let obj = {message :collection1Obj[j].message }
				const collection2Obj = new Collection2(obj);
				await collection2Obj.save()
			}

		}
	}
}


app.listen(3000, () => {
	console.log('Server started');
});
