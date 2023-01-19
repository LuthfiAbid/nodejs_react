const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

var corsOptions = { origin: "http://localhost:8081" };

const db = require("./app/models");
const Role = db.role;

db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to the database!");
    initial();
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

app.use(cors(corsOptions));

//parse requres content-type = appliaction/json
app.use(bodyParser.json());

// parse request content-type = application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "example-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

// route
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

// setting port for listening request
const PORT = process.env.PORT || 8080;

require("./app/routes/tutorial.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}