const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/registrar", (req, res) => {
    authController.registrar(req, res);
});

module.exports = router;