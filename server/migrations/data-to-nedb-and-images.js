const nedb = require("nedb-promises");
const fs = require("fs");
const path = require("path");

if (!fs.existsSync(path.join(__dirname, "../data"))) {
	throw new Error("Data folder not found");
}

const db = new nedb({
	filename: path.join(__dirname, "../db/birthdays.db"),
	autoload: true,
});

const birthdays = JSON.parse(
	fs.readFileSync(path.join(__dirname, "../data/birthdays.json"), "utf8"),
);

(async () => {
	for (const birthday of birthdays) {
		await db.insert(birthday);
	}
})();

fs.renameSync(
	path.join(__dirname, "../data"),
	path.join(__dirname, "../images"),
);

fs.unlinkSync(path.join(__dirname, "../images/birthdays.json"));
