const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({});

const dataPath = path.join(__dirname, "data");
const birthdaysPath = path.join(dataPath, "birthdays.json");

if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);
if (!fs.existsSync(birthdaysPath)) fs.writeFileSync(birthdaysPath, "[]");

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.static(dataPath));

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

app.post("/api/add-birthday", upload.single("image"), async (req, res) => {
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
		fs.writeFileSync(path.join(dataPath, image), imageBuffer);

		const birthdays = JSON.parse(fs.readFileSync(birthdaysPath, "utf8"));
		birthdays.push({
			name,
			date,
			color,
			image,
		});
		fs.writeFileSync(birthdaysPath, JSON.stringify(birthdays, null, 4));

		res.json({ success: true });
	} catch (error) {
		res.status(400);
		res.json({ success: false, error: error.message });
	}
});

const port = process.env.PORT ?? 4200;
app.listen(port, () => {
	console.log(`Server listening on http://127.0.0.1:${port}`);
});
