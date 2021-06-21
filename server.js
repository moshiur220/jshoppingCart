const express = require("express");
const cors = require("cors");
const { product, color, size } = require("./products");
const app = express();

app.use(cors());
// static file
app.use(express.static("public"));
// parse requests of content-type - application/json
app.use(express.json());

// Get request all products

app.get("/products", (req, res) => {
  res.json({
    product,
    color,
    size,
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
