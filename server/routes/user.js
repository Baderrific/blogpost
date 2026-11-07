const express = require('express');
const userController = require('../controllers/user');
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/register", userController.userRegistration);

router.post("/login", userController.userAuthentication);

router.get("/details", verify, userController.retrieveUser);

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUser);

module.exports = router;
