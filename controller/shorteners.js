const shortenersRouter = require('express').Router();
const validUrl = require('valid-url');
const Shortener = require('../models/shortener');

shortenersRouter.get('/', async (req, res) => {
  const result = await Shortener.find({});
  res.status(200).json(result);
});

shortenersRouter.post('/', async (req, res) => {
  let { url } = req.body;
  url = url.trim();

  if (validUrl.isUri(url)) {
    const result = await Shortener.findOne({ original_url: url });
    if (result) {
      return res.status(200).json({
        message: 'shortener already exist!',
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
  }

  return res.status(400).json({ error: 'invalid URL!' });
});

shortenersRouter.post('/custom', async (req, res) => {
  let { url, shortUrl } = req.body;
  url = url.trim();
  shortUrl = shortUrl.trim();

  if (validUrl.isUri(url)) {
    const result = await Shortener.findOne({ original_url: url });
    if (result) {
      return res.status(200).json({
        message: 'shortener already exist!',
        url: result.original_url,
        short_url: result.short_url,
      });
    }
    const shortener = new Shortener({
      original_url: url,
      short_url: shortUrl,
    });

    const savedUrl = await shortener.save();
    res.status(200).json(savedUrl);
  }

  return res.status(400).json({ error: 'invalid URL ' });
});

module.exports = shortenersRouter;
