const express = require('express'),
      home    = require('../controller/home'),
      login    = require('../controller/login'),
      router  = express.Router();

router.get('/dashboard',home.index);

router.post('/login',login.index);

router.post('/device',login.device);

module.exports = router;
