const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/RealtimeChat.sqlite", error => {
	// if (error) {
	// 	console.error(error.message);
	// 	throw error;
	// }

	console.log("Connected to SQLite3 database.");

	let statement = `CREATE TABLE users ( 
		id TEXT,
		username TEXT, 
		room TEXT
	);`;

	db.run(statement, error => {
		// if (error) {
		// 	console.error(error.message);
		// 	return;
		// }

		console.log(`Created "Users" table.`);
	});

	statement = `CREATE TABLE messages (
		username TEXT, 
		text TEXT,
		room TEXT,
		time TEXT
	)`;

	db.run(statement, error => {
		// if (error) {
		// 	console.error(error.message);
		// 	return;
		// }

		console.log(`Created "Messages" table.`);
	});

	statement = `CREATE TABLE rooms (
		name TEXT,
		time TEXT
	)`;

	db.run(statement, error => {
		// if (error) {
		// 	console.error(error.message);
		// 	return;
		// }

		console.log(`Created "Rooms" table.`);
	});

	statement = `CREATE TABLE logs (
		text TEXT,
		time TEXT
	)`;

	db.run(statement, error => {
		// if (error) {
		// 	console.error(error.message);
		// 	return;
		// }

		console.log(`Created "Logs" table.`);
	});
});

module.exports = db;
