const mongoose = require("mongoose");
const employeeModel = require("../models/EmployeeModel");
const bcrypt = require("bcrypt");

// @Request   GET
// @Route     http://localhost:5000/api/employee/
// @Access    Private
const getEmployee = async (req, res) => {
    try {
        const employees = await employeeModel.find().populate("employeeRole");
        if (!employees.length) return res.status(404).json({ err: "No data found" });
        return res.status(200).json(employees);
    } catch (error) {
        console.log("Error Reading Employees:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   GET
// @Route     http://localhost:5000/api/employee/:id
// @Access    Private
const getSingleEmployee = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID format" });

        const employee = await employeeModel.findById(_id).populate("employeeRole");
        if (!employee) return res.status(404).json({ err: "Employee not found" });

        return res.status(200).json(employee);
    } catch (error) {
        console.log("Error Reading Employee:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   POST
// @Route     http://localhost:5000/api/employee/
// @Access    Private
const createEmployee = async (req, res) => {
    try {
        const { employeeName, employeeEmail, employeePassword,employeeSalary, employeeRole } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[A-Za-z\s]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const numberRegex = /^\d+$/; // Only digits

        if (!employeeName || !nameRegex.test(employeeName)) return res.status(400).json({ err: "Invalid Username. Only letters and spaces are allowed." });
        if (!employeeEmail || !emailRegex.test(employeeEmail)) return res.status(400).json({ err: "Invalid Email Address." });
        if (!employeeSalary || !numberRegex.test(employeeSalary)) return res.status(400).json({ err: "Invalid Salary. Only Numbers are allowed." });
        if (!employeePassword || !passwordRegex.test(employeePassword)) return res.status(400).json({ err: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character." });
        if (!employeeRole || !mongoose.Types.ObjectId.isValid(employeeRole)) return res.status(400).json({ err: "Invalid Role ID format." });

        const existingUser = await employeeModel.findOne({ employeeEmail });
        if (existingUser) return res.status(400).json({ err: "Email already exists." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(employeePassword, salt);

        const newEmployee = await employeeModel.create({
            employeeName,
            employeeEmail,
            employeeSalary,
            employeePassword: hashedPassword,
            employeeRole
        });

        return res.status(201).json({ msg: "Employee registered successfully", newEmployee });
    } catch (error) {
        console.log("Error Creating Employee:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   PUT
// @Route     http://localhost:5000/api/employee/:id
// @Access    Private
const updateEmployee = async (req, res) => {
    try {
        const _id = req.params.id;
        const { employeeName, employeeEmail,employeeSalary, employeeRole } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[A-Za-z\s]+$/;
        const numberRegex = /^\d+$/; // Only digits

        if (!employeeName || !nameRegex.test(employeeName)) return res.status(400).json({ err: "Invalid Username. Only letters and spaces are allowed." });
        if (!employeeEmail || !emailRegex.test(employeeEmail)) return res.status(400).json({ err: "Invalid Email Address." });
        if (!employeeSalary || !numberRegex.test(employeeSalary)) return res.status(400).json({ err: "Invalid Salary. Only Numbers are allowed." });
        if (!mongoose.Types.ObjectId.isValid(employeeRole)) return res.status(400).json({ err: "Invalid Role ID format." });

        const existingEmployee = await employeeModel.findById(_id);
        if (!existingEmployee) return res.status(404).json({ err: "Employee not found" });

        const updatedData = {
            employeeName,
            employeeEmail,
            employeeSalary,
            employeeRole
        };

        const updatedEmployee = await employeeModel.findByIdAndUpdate(_id, updatedData, { new: true, omitUndefined: true });
        return res.status(200).json({ msg: "Employee updated successfully", updatedEmployee });
    } catch (error) {
        console.log("Error Updating Employee:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

// @Request   DELETE
// @Route     http://localhost:5000/api/employee/:id
// @Access    Private
const deleteEmployee = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID format" });

        const deletedEmployee = await employeeModel.findByIdAndDelete(_id);
        if (!deletedEmployee) return res.status(404).json({ err: "Employee not found" });

        return res.status(200).json({ msg: "Employee deleted successfully", deletedEmployee });
    } catch (error) {
        console.log("Error Deleting Employee:", error);
        return res.status(500).json({ err: "Internal Server Error" });
    }
};

module.exports = { createEmployee, getEmployee, getSingleEmployee, updateEmployee, deleteEmployee };