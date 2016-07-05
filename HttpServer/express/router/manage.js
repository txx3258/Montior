'use strict';

var express = require('express');
var router = express.Router();

let manageWrap = require('../service/manageWrap');
let manage = require('../service/manage');

router.get('/roleLeveList', function (req, res, next) {
    req.query.bizCode = 'roleLeveList';

    manageWrap(req, res, manage);
});

router.get('/login', function (req, res, next) {
    req.query.bizCode = 'login';

    manageWrap(req, res, manage);
});

router.post('/checklogin', function (req, res, next) {
    req.query=req.body;
    req.query.bizCode = 'checklogin';
    
    manageWrap(req, res, manage);
});

router.get('/index', function (req, res, next) {
    req.query.bizCode = 'index';

    manageWrap(req, res, manage);
});

module.exports = router;