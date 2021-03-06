// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
const shortId = require("shortid")

// Creating our Employe model
module.exports = function(sequelize, DataTypes) {
  var Employee = sequelize.define("Employee", {
    // The id cannot be null, and needs to be generated by shortId before creation
   
    employee_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // First name and Last name for employee database, though only the first name should be used by the tracker display
    first_name:
    {
      type: DataTypes.STRING,
    },
    last_name:
    {
      type: DataTypes.STRING,
    }
  });

  // Creating a custom method for our Employee model. This will check if an unhashed password entered by the employee can be compared to the hashed password stored in our database
  Employee.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the Employee Model lifecycle
  // In this case, before a Employee is created, we will automatically hash their password
  Employee.addHook("beforeCreate", function(employee) {
    employee.employee_id = shortId.generate();
    employee.password = bcrypt.hashSync(employee.password, bcrypt.genSaltSync(10), null);
  });
  return Employee;
};
