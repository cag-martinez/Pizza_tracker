const db = require("../models");
const passport = require("../config/passport")
const {Op} = require("sequelize")

module.exports = function(app) {


app.post("/api/login", passport.authenticate("local"), function(req, res) {

    res.json(req.user)
})

app.post("/api/signup", function(req, res) {
//   console.log(req.body)
    db.Employee.create({
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    })
    .then((data) => {
        console.log("Success")
        res.json(data)
    })
    .catch((err) => {
        console.log("This is an error")
        console.log(err)
        res.status(401).json(err);
    });
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

app.get("/api/employee_data", function(req, res) {
    if (!req.employee) {
        res.json({});
    } else {
        res.json({
            employee_id: req.employee.employee_id,
            first_name: req.employee.first_name,
            last_name: req.employee.last_name
        })
    }
})

app.post("/api/pizza", function(req, res) {
    db.Pizza.create({
        crust_type: req.body.crust_type,
        sauce_type: req.body.sauce_type,
        cheese_type: req.body.cheese_type,
        topping1: req.body.topping1,
        topping2: req.body.topping2,
        phone_number: req.body.phone_number
    }).then((newPizza) => {
        console.log(newPizza)
        res.json(newPizza)
    }).catch((err) =>{
        res.status(401).json(err)
    })
});

app.get("/api/pizza/", function(req, res) {
    db.Pizza.findAll({
        attributes: ["id"],
        where: {
            status: {
                [Op.lt]: 5
            }
        }
    }).then(pizzas => {
        res.json(pizzas)
    })
});

app.get("/api/pizza/:id", function(req, res) {
    db.Pizza.findOne({
        where: {
            id: req.params.id
        }
    }).then(pizzaData => {
        res.json(pizzaData)
    })
});

app.get("api/pizza/customer/:phone_number", function(req, res) {
    db.Pizza.findAll({
        where: {
            phone_number: req.params.phone_number
        }
    }).then(pizzaData => {
        res.json(pizzaData)
    })
})


app.put("/api/pizza", function(req, res) {
    db.Pizza.update({
        status: req.body.status
      }, {
        where: {
          id: req.body.id
        }
      }).then(function(pizzaData) {
        res.json(pizzaData);
      })
      .catch(function(err) {
        console.log("This is an error")
        console.log(err)
        if (err)
          throw err;
      });
})

}
