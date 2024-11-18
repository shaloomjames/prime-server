const express = require("express");
const {  getExpance, getSingleExpance,  createExpance, updateExpance, deleteExpance } = require("../controller/ExpanceController");
const router = express.Router();
const {upload} = require("../config/multer")


router.route("/").post(upload.single("expanceImage"),createExpance).get(getExpance)
router.route("/:id").get(getSingleExpance).put(upload.single("expanceImage"),updateExpance).delete(deleteExpance)



module.exports = router