const express = require('express');
var app = express();
const fs = require('fs')
var parse = require('csv-parse');
var User = require('../models/user');
var Agent = require('../models/agent');
var Account = require('../models/account');
var PolicyCarrier = require('../models/policycarrier')
var PolicyCategory = require('../models/policycategory')
var PolicyInfo = require('../models/policyinfo')
var Collection1 = require('../models/collection1')

var data = [];
var table = [];

fetchData();
app.get('/uploadfile', async (req, res, next) => {
	for (var i = 0; i < data.length; i++) {
		let userObj = {
			firstname: data[i].firstname,
			dob: data[i].dob,
			address: data[i].address,
			phone: data[i].phone,
			state: data[i].state,
			zip: data[i].zip,
			gender: data[i].gender,
			email: data[i].email,
			userType: data[i].userType
		}
		const user = new User(userObj);
		await user.save();
		await Agent.insertMany({ agentName: data[i].agent, userId: user._id })
		await Account.insertMany({ account_name: data[i].account_name, userId: user._id })
		await PolicyCarrier.insertMany({ company_name: data[i].company_name, userId: user._id })
		await PolicyCategory.insertMany({ category_name: data[i].category_name, userId: user._id })
		await PolicyInfo.insertMany({ policy_number: data[i].policy_number, policy_start_date: data[i].policy_start_date, policy_end_date: data[i].policy_end_date, userId: user._id })
	}

	res.send("Data inserted successfully..")
})

app.get('/policyinfo', async (req, res, next) => {
	const userName = req.query.name;
	const user = await User.aggregate(
		[{ $match: { firstname: userName } },
		{
			$project: {
				_id: {
					$toString: '$_id',
				},

			},
		},
		{
			$lookup: {
				from: 'policyinfos',
				localField: '_id',
				foreignField: 'userId',
				as: 'policyDetails',
			},
		},
		]);
	res.status(200).send(user);
})
app.get('/policies', async (req, res, next) => {
	const user = await User.aggregate(
		[{ $match: {  firstname: { $exists: true } }},
		{
			$project: {
				_id: {
					$toString: '$_id',
				},
				firstName : 1,
                dob :1,
				address :1,
				phone :1,
				state :1,
				zip :1,
				email :1,
				gender :1,

			},
		},
		{
			$lookup: {
				from: 'policyinfos',
				localField: '_id',
				foreignField: 'userId',
				as: 'policyDetails',
			},
		},
	 ]);
	res.status(200).send(user);
})
app.post('/addmessage', async (req, res, next) => {
	var message = req.body.message;
	var day = req.body.day;
	var time = req.body.time;
	table.push({ message: message, day: day, time });
	var json = JSON.stringify(table);
	fs.writeFile("./message.json", json, function (err) {
		if (err) throw err;
		console.log('Message added to josn file');
	}
	);
	res.send("Data added to json File")
});
app.post('/addcollection', async (req, res, next) => {
	let obj = {
		message: req.body.message,
		timestamp: req.body.timestamp
	}
	const coll_1 = new Collection1(obj)
	await coll_1.save();

	res.send("Data added to collection-1")

});
async function fetchData() {
	var parser = parse({ columns: true, delimiter: "," }, function (err, records) {
		data = records;
	});
	fs.createReadStream('./data-sheet.csv').pipe(parser);
	console.log("Reading Csv File")
};

module.exports = app;
