const mongoose = require("mongoose");
const roleModel = require("./../models/RoleModel");
const employeeModel = require("../models/EmployeeModel")

// @Request   GET
// @Route     http://localhost:5000/api/role/
// @Access    Private
const getRole = async (req, res) => {
    try {
        const roles = await roleModel.find();

        if (!roles.length) return res.status(404).json({ err: "No Roles data found" });

        return res.status(200).json(roles);
    } catch (error) {
        console.log("Error Reading Roles", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

// @Request   GET
// @Route     http://localhost:5000/api/role/active/R
// @Access    Private
const getActiveRole = async (req, res) => {
    try {
        const activeRoles = await roleModel.find({ roleStatus: "active" });
        if (!activeRoles.length) return res.status(404).json({ err: "No active roles found" });
        return res.status(200).json(activeRoles);
    } catch (error) {
        console.error("Error fetching active roles:", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};


// @Request   GET
// @Route     http://localhost:5000/api/role/:id
// @Access    Private
const getSingleRole = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID format" });

        const role = await roleModel.findById(_id);

        if (!role) return res.status(404).json({ err: "Role not found" });

        return res.status(200).json(role);
    } catch (error) {
        console.log("Error Reading Role", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

// @Request   POST
// @Route     http://localhost:5000/api/role/
// @Access    Private
const createRole = async (req, res) => {
    try {
        const { roleName } = req.body;

        const roleNameRegex = /^[A-Za-z0-9\s]+$/;
        if (!roleName || !roleNameRegex.test(roleName)) {
            return res.status(400).json({ err: "Invalid name. Only letters, numbers, and spaces are allowed." });
        }

        const existingRole = await roleModel.findOne({ roleName });
        if (existingRole) return res.status(400).json({ err: "Role already exists" });

        const newRole = await roleModel.create({ roleName });

        return res.status(200).json({ msg: "Role created successfully", newRole });
    } catch (error) {
        console.log("Error creating Role", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};


// @Request   PUT
// @Route     http://localhost:5000/api/role/:id
// @Access    Private
const updateRole = async (req, res) => {
    try {
        const _id = req.params.id;
        const { roleName, roleStatus } = req.body;

        const roleNameRegex = /^[A-Za-z0-9\s]+$/;
        const roleStatusRegex = /^(active|inactive)$/; // Regex to validate roleStatus

        // Validate roleName
        if (!roleName || !roleNameRegex.test(roleName)) {
            return res.status(400).json({ err: "Invalid name. Only letters, numbers, and spaces are allowed." });
        }

        // Validate roleStatus
        if (!roleStatus || !roleStatusRegex.test(roleStatus)) {
            return res.status(400).json({ err: "Invalid role status. It should be either 'active' or 'inactive'." });
        }

        const role = await roleModel.findById(_id);
        if (!role) return res.status(404).json({ err: "Role not found" });

        const updatedRole = await roleModel.findByIdAndUpdate(_id, { roleName, roleStatus }, { new: true });

        return res.status(200).json({ msg: "Role updated successfully", updatedRole });
    } catch (error) {
        console.log("Error updating Role", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};
// Role Assinged to User
// @Request   DELETE
// @Route     http://localhost:5000/api/role/:id
// @Access    Private
const deleteRole = async (req, res) => {
    try {
        const _id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({ err: "Invalid ID format" });

         // Check if the role is assigned to any employee
        const checkExistanceInUserModel = await employeeModel.findOne({ employeeRole: _id });
        
        // If role is in use, prevent deletion and suggest role reassignment
        if (checkExistanceInUserModel) return res.status(400).json({ err: "Role is assigned to an employee. Please reassign the role before deletion." });

        const deletedRole = await roleModel.findByIdAndDelete(_id);

        if (!deletedRole) return res.status(404).json({ err: "Role not found" });

        return res.status(200).json({ msg: "Role deleted successfully", deletedRole });
    } catch (error) {
        console.log("Error deleting Role", error);
        return res.status(500).json({ err: "Internal Server Error", error: error.message });
    }
};

module.exports = { createRole, getRole,getActiveRole, getSingleRole , updateRole, deleteRole };
