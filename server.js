// =============================================================================

// Dependencies

// =============================================================================
const express    = require("express");
const bodyParser = require("body-parser");

// Setup express app
const app  = express();
const PORT = process.env.PORT || 8080;

const db = require("./models");

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Routes
require("./routes/html-routes.js")(app);
require("./routes/author-api-routes.js")(app);
require("./routes/post-api-routes.js")(app);

// Sync models start express
db.sequelize.sync({ force: true }).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on port: " + PORT);
    });
});
