    const mongoose = require("mongoose");

    const employeeSchema = mongoose.Schema({
        employeeName: {
            type: String,
            required: [true, "Employee Name Is Required"],
            minLength: 3,
            trim: true
        },
        employeeEmail: {
            type: String,
            required: [true, "Employee Email Is Requires"],
            unique: true,
            minLength: 5,
            trim: true
        },
        employeeSalary:{
            type:Number,
            required:[true,"Employee Salary is Required"],
            minLength: 3,
            trim: true
        },
        employeePassword: {
            type: String,
            required: [true, "Employee Password Is Required"],
            minLength: 3,
            trim: true
        },
        employeeRole: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "roleModel",
            default:"672f5ac5c6665fc51d7902f3"
        }
    },
        {
            timestamps: true
        })

    module.exports = mongoose.model("employeeModel", employeeSchema);