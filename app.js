const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const Shortener = require("./models/shortener");
const shortenersRouter = require("./controller/shorteners");
const logger = require("./utils/logger");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("connected to MongoDB"))
  .catch((err) => logger.error(err.message));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.redirect("https://maxima.umn.ac.id");
});
app.use(express.static("public"));

app.get("/twibbon", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;
  const result = await Shortener.findOne({ short_url: shortUrl });
  if (result) {
    res.redirect(result.original_url);
  } else {
    res.status(404).json({ message: "link doesn't exists" });
  }
});
/* router placed below */
app.use("/api/shorteners", shortenersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
