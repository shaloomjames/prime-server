const express = require("express");
const { createEmployee, getEmployee, getSingleEmployee, deleteEmployee, updateEmployee } = require("../controller/EmployeeController");
const router = express.Router();

router.route("/").post(createEmployee).get(getEmployee)
router.route("/:id").get(getSingleEmployee).put(updateEmployee).delete(deleteEmployee)

module.exports = router