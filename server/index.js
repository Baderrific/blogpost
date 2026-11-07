const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const { errorHandler } = require("./auth");

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

const corsOption = {

	origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://localhost:8080"],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOption));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// handle unknown routes
app.use((req, res) => {

	return res.status(404).send({
		message: `Route ${req.method} ${req.originalUrl} does not exist`
	});
});

// catches anything thrown outside of the controllers (e.g. malformed JSON body)
app.use(errorHandler);

if(require.main === module) {
	app.listen(process.env.PORT || 4000, () => console.log(`Server running at port ${process.env.PORT || 4000}`))
};

module.exports = { app, mongoose };
