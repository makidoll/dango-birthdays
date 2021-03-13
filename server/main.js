const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const nedb = require("nedb-promises");

const app = express();
const upload = multer({});
const db = new nedb({
	filename: path.join(__dirname, "db/birthdays.db"),
	autoload: true,
});

app.use(bodyParser.json());

const generateImageName = (length = 12) => {
	const letters = "abcdefghijklmnopqrstuvwxyz";
	const numbers = "0123456789";
	const dictionary = letters + letters.toUpperCase() + numbers;
	let output = "";
	for (let i = 0; i < length; i++) {
		output += dictionary[Math.floor(Math.random() * dictionary.length)];
	}
	return output;
};

app.get("/api/birthdays", async (req, res) => {
	res.json(await db.find({}));
});

const imagesPath = path.resolve(__dirname, "images");
app.use(express.static(imagesPath));

app.put("/api/birthday", upload.single("image"), async (req, res) => {
	try {
		const fileBuffer = req.file.buffer;
		const { name, date, color } = req.body;

		if (name == null) throw new Error("No name given");

		if (date == null) throw new Error("No date given");
		if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date))
			throw new Error("Invalid date");

		if (color == null) throw new Error("No color given");
		if (!/^#[0-9a-f]{6}$/.test(color)) throw new Error("Invalid color");

		if (fileBuffer == null) throw new Error("No image given");

		const imageBuffer = await sharp(fileBuffer)
			.resize(512, 512, {
				fit: "cover",
				position: "centre",
			})
			.jpeg({
				quality: 90,
			})
			.toBuffer();

		const image = generateImageName() + ".jpg";
		fs.writeFileSync(path.join(imagesPath, image), imageBuffer);

		await db.insert({
			name,
			date: date.replace(/^[0-9]{4}-/, "1970-"),
			color,
			image,
		});

		res.json({ success: true });
	} catch (error) {
		res.status(400);
		res.json({ success: false, error: error.message });
	}
});

let password = process.env.PASSWORD ?? "123";

const passwordPath = path.join(__dirname, "password.txt");
if (fs.existsSync(passwordPath)) {
	password = fs.readFileSync(passwordPath, "utf-8").trim();
}

const adminOnly = (req, res, next) => {
	const token = req.headers.authorization.replace(/^Bearer /, "");
	if (token == password) {
		next();
	} else {
		res.status(400);
		res.json({ success: false, error: "Invalid token" });
	}
};

app.get("/api/verify", adminOnly, (req, res) => {
	res.json({ success: true });
});

app.delete("/api/birthday/:id", async (req, res) => {
	try {
		const amount = await db.remove({ _id: req.params.id });
		if (amount == 0) throw new Error("Failed to find birthday");

		res.json({ success: true });
	} catch (error) {
		res.status(400);
		res.json({ success: false, error: error.message });
	}
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const port = process.env.PORT ?? 4200;
app.listen(port, () => {
	console.log(`Server listening on http://127.0.0.1:${port}`);
});
