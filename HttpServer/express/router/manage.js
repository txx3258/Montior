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

router.get('/data', function (req, res, next) {
    req.query.bizCode = 'data';

    manageWrap(req, res, manage);
});

router.get('/dataRedis', function (req, res, next) {
    req.query.bizCode = 'dataRedis';

    manageWrap(req, res, manage);
});

router.get('/dataMemcache', function (req, res, next) {
    req.query.bizCode = 'dataMemcache';

    manageWrap(req, res, manage);
});

router.get('/dataDB', function (req, res, next) {
    req.query.bizCode = 'dataDB';

    manageWrap(req, res, manage);
});


router.get('/dataRpc', function (req, res, next) {
    req.query.bizCode = 'dataRpc';

    manageWrap(req, res, manage);
});

router.get('/dataJms', function (req, res, next) {
    req.query.bizCode = 'dataJms';

    manageWrap(req, res, manage);
});

router.get('/dataGC', function (req, res, next) {
    req.query.bizCode = 'dataGC';

    manageWrap(req, res, manage);
});

module.exports = router;