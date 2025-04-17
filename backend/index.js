const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

require("dotenv").config();
const db = require("./src/db");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/teams", require("./src/routes/teams"));
app.use("/api/members", require("./src/routes/members"));
app.use("/api/tasks", require("./src/routes/tasks"));

app.listen(port, () => {
  console.log(`✅ Backend running at http://localhost:${port}`);
});
