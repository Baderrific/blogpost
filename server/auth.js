const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		username: user.username,
		isAdmin: user.isAdmin
	};

	return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

module.exports.verify = (req, res, next) => {

	let token = req.headers.authorization;

	if(typeof token === "undefined" || !token.startsWith("Bearer ")) {

		return res.status(401).send({
			auth: "Failed",
			message: "No token provided. Please login first"
		});

	} else {

		token = token.slice(7, token.length);

		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {

			if(err) {

				return res.status(401).send({
					auth: "Failed",
					message: err.message
				})

			} else {

				req.user = decodedToken;

				next();
			}
		})
	}
}

module.exports.verifyAdmin = (req, res, next) => {

	if(req.user.isAdmin) {

		next();

	} else {

		// return message to the client
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

module.exports.errorHandler = (err, req, res, next) => {

	console.error(err);

	let statusCode = err.status || 500;
	let errorMessage = err.message || 'Internal Server Error';
	let errorCode = err.code || 'SERVER_ERROR';
	let details = err.details || null;

	// mongoose schema validation failed
	if(err.name === "ValidationError" && err.errors) {

		statusCode = 400;
		errorMessage = "Validation failed";
		errorCode = "VALIDATION_ERROR";
		details = Object.values(err.errors).map(error => error.message);

	// invalid ObjectId or wrong data type
	} else if(err.name === "CastError") {

		statusCode = 400;
		errorMessage = `Invalid value for ${err.path}`;
		errorCode = "INVALID_ID";

	// duplicate key (unique index)
	} else if(err.code === 11000) {

		statusCode = 409;
		errorMessage = "Duplicate value. Record already exists";
		errorCode = "DUPLICATE_KEY";
		details = err.keyValue || null;

	// malformed JSON body
	} else if(err.type === "entity.parse.failed") {

		statusCode = 400;
		errorMessage = "Request body contains invalid JSON";
		errorCode = "INVALID_JSON";
	}

	// never leak internal error messages to the client
	if(statusCode === 500) {
		errorMessage = "Internal Server Error";
	}

	return res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: errorCode,
			details: details
		}
	})
}
