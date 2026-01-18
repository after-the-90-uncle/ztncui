/*
  ztncui - ZeroTier network controller UI
  Copyright (C) 2017-2021  Key Networks (https://key-networks.com)
  Licensed under GPLv3 - see LICENSE for details.
*/

const express = require('express');
const router = express.Router();
const i18n = require('../lib/i18n');

router.get('/switch/:locale', function(req, res) {
  const locale = req.params.locale;
  const referer = req.get('Referer') || '/';

  i18n.setLocale(req, res, locale);

  res.redirect(referer);
});

router.post('/switch', function(req, res) {
  const locale = req.body.locale;
  const referer = req.body.referer || '/';

  i18n.setLocale(req, res, locale);

  res.json({ success: true });
});

module.exports = router;