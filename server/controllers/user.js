const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth.js");
const { errorHandler } = require("../auth");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/;

module.exports.userRegistration = (req, res) => {

    const { username, email, password } = req.body || {};

    if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string"
        || username.trim() === "" || email.trim() === "" || password === "") {

        return res.status(400).send({
            message: "Username, email and password are required"
        });

    } else if (!usernamePattern.test(username.trim())) {

        return res.status(400).send({
            message: "Username must be 3-30 characters and can only contain letters, numbers and underscores"
        });

    } else if (!emailPattern.test(email.trim())) {

        return res.status(400).send({ message: "Email is invalid" });

    } else if (password.length < 8) {

        return res.status(400).send({
            message: "Password must contain at least 8 characters"
        });

    } else {

        return User.findOne({
            $or: [
                { email: email.trim().toLowerCase() },
                { username: username.trim() }
            ]
        })
        .collation({ locale: 'en', strength: 2 })
        .then(existingUser => {

            if (existingUser) {

                const field = existingUser.email === email.trim().toLowerCase() ? "Email" : "Username";

                return res.status(409).send({
                    message: `${field} is already taken`
                });
            }

            let newUser = new User({
                username : username.trim(),
                email : email.trim(),
                password : bcrypt.hashSync(password, 10)
            });

            return newUser.save()
            .then((result) => res.status(201).send({
                message: "User registered successfully",
                user: {
                    _id: result._id,
                    username: result.username,
                    email: result.email,
                    isAdmin: result.isAdmin
                }
            }));
        })
        .catch(error => errorHandler(error, req, res));
    }
};


module.exports.userAuthentication = (req, res) => {

    const { email, password } = req.body || {};

    if (typeof email !== "string" || typeof password !== "string" || email.trim() === "" || password === "") {

        return res.status(400).send({ message: "Email and password are required" });
    }

    if (!emailPattern.test(email.trim())) {

        return res.status(400).send({ message: "Email is invalid" });
    }

    return User.findOne({ email: email.trim().toLowerCase() }).select("+password")
    .then(result => {

        // same message for wrong email and wrong password so accounts can't be guessed
        if (result == null) {

            return res.status(401).send({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, result.password);

        if (!isPasswordCorrect) {

            return res.status(401).send({ message: "Invalid email or password" });
        }

        return res.status(200).send({
            message: "User logged in successfully",
            access: auth.createAccessToken(result)
        });

    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.retrieveUser = (req, res) => {

    return User.findById(req.user.id)
    .then(result => {

        if(result == null) {

            return res.status(404).send({
                message: "User cannot be found"
            });
        }

        return res.status(200).send({ user: result });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.updateUser = (req, res) => {

    return User.findById(req.params.id)
    .then(user => {

        if(user == null) {
            return res.status(404).send({
                message: "User does not exist"
            });
        }

        user.isAdmin = true;

        return user.save()
        .then(updatedUser => {

            return res.status(200).send({
                message: "User was successfully set as an administrator",
                user: updatedUser
            });
        });
    })
    .catch(error => errorHandler(error, req, res));
};
