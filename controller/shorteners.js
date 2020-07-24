const shortenersRouter = require('express').Router();
const validUrl = require('valid-url');
const Shortener = require('../models/shortener');

shortenersRouter.get('/', async (req, res) => {
  const result = await Shortener.find({});
  res.status(200).json(result);
});

shortenersRouter.post('/', async (req, res) => {
  const { url } = req.body;
  if (validUrl.isUri(url)) {
    const result = await Shortener.findOne({ original_url: url });
    if (result) {
      return res.status(200).json({
        url: result.original_url,
        short_url: result.short_url,
      });
    }
    const shortener = new Shortener({
      original_url: url,
      short_url: Math.random().toString(36).substr(2, 5),
    });

    const savedUrl = await shortener.save();
    res.status(200).json(savedUrl);
  } else {
    res.status(400).json({ error: 'invalid URL!' });
  }
});

shortenersRouter.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const result = await Shortener.findOne({ short_url: shortUrl });
  if (result) {
    res.redirect(result.original_url);
  } else {
    res.status(404).json({ message: "link doesn't exists" });
  }
});
module.exports = shortenersRouter;
