var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index/index', { title: 'Express' });
});


router.get('/login', function(req, res, next) {
  res.render('index/login',{});
});


router.get('/settings', function(req, res, next) {
  res.render('index/settings',{user:req.user});
});


router.get('/teacher/list', function(req, res, next) {
  res.render('teacher/list',{});
});

router.get('/teacher/add', function(req, res, next) {
  res.render('teacher/add',{});
});

router.get('/course/list', function(req, res, next) {
  res.render('teacher/list',{});
});


router.get('/course/add', function(req, res, next) {
  res.render('course/add',{});
});

router.get('/course/add_step1', function(req, res, next) {
  res.render('course/add_step1',{});
});


router.get('/course/add_step2', function(req, res, next) {
  res.render('course/add_step2',{});
});

router.get('/course/add_step3', function(req, res, next) {
  res.render('course/add_step3',{});
});


module.exports = router;
