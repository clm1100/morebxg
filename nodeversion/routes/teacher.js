var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var Teacher = require('../model/teacher.js');

var  TeacherModel = Teacher.TeacherModel;

var  TeacherDao = Teacher.TeacherModel;


/* GET users listing. */
router.post('/teacher/add', function(req, res, next) {


	var obj = {
		tc_name:req.body.tc_name,
        tc_pass:req.body.tc_pass,
        tc_join_date:req.body.tc_join_date,
		tc_type:req.body.tc_type,
		tc_gender:req.body.tc_gender,
	}
	console.log(obj);
	TeacherDao.create(obj,function(err,doc){
		if(!err){
			res.json({
			  code: 200,
			  msg: "OK",
			});
		}else{
			res.json({
				err:"报错了"
			})
		}
	})
});



router.get('/teacher', function(req, res, next){
		TeacherModel.find({}).select({
			tc_name:1,
			tc_gender:1,
			tc_roster: 1,
			tc_cellphone: 1,
			tc_email: 1,
			tc_status: 1,
			tc_birthday: 1,
			tc_join_date: 1,
			tc_status:1
		}).exec(function(err,result){
			if(!err){
				let obj = {
					code:200,
					msg:"ok",
					result:result
				}
				res.json(obj);
			}
		})
})


router.get("/teacher/view", function(req, res, next){
	var id = req.query.tc_id;
	TeacherModel.findById(id,function(err, item){
		if(!err){
			var obj  = {
				code:200,
				msg:"ok",
				result:item
			}
			console.log(item);
			res.json(obj);
		}
	})
})



router.get('/teacher/profile',function(req,res){
var id = req.user._id;
TeacherDao.findById(id,function(err,re){
			
			var obj  = {
							code:200,
							msg:"ok",
							result:re
						}
			console.log(obj);
			res.json(obj);

		})
});


router.post('/teacher/modify',function(req, res){
	var id = req.body.tc_id;
	var obj = req.body;
	TeacherDao.updateOne({_id:id},obj,function(err,result){

		TeacherDao.findById(id,function(err,re){
			res.send(re)
		})
		
	})
})


router.get('/teacher/edit', function(req, res){
	id = req.query.tc_id;
	TeacherModel.findById(id).select({
			tc_name:1,
			tc_gender:1,
			tc_join_date: 1,
			tc_type:1
		}).exec(function(err,re){

			if(!err){
			var obj  = {
				code:200,
				msg:"ok",
				result:re
			}
			res.json(obj);
		}else{
			res.json({code:400,msg:"报错了"})
		}
		})

})


router.post('/teacher/update',function(req, res){
		var id = req.body.tc_id;
		var obj = req.body;
		TeacherDao.updateOne({_id:id},obj,function(err,result){

		if(!err){
			res.json({
			  "code": 200,
			  "msg": "OK",
			  "time": 1482385456
			})
		}
		
	})

})

/* 上传图片接口 */
router.post('/uploader/avatar', function(req, res, next) {
	console.log("==================upload===========================");
	var id = req.user._id;
	console.log("id",id)
   var form = new formidable.IncomingForm();
   form.uploadDir = "./public/m"
   form.keepExtensions = true;
   form.maxFieldsSize = 2 * 1024 * 1024
    form.parse(req, function(err, fields, files) {
      console.log("fields",fields);
      console.log("files",files);
      var imgpath = path.join(files.tc_avatar.path.substring(6));
       // res.json({
       // 	fields: fields,
       // 	 files: files,
       // 	 imgpath:imgpath
       // 	}); 
		TeacherDao.updateOne({_id:id},{tc_avatar:imgpath},function(err,result){
			if(!err){
				res.json({
				  "code": 200,
				  "msg": "OK",
				  "result": {
				    "path": imgpath
				  }
				})
			}
		})	
    });
});

router.post('/teacher/handle',function(req,res){
	
})


module.exports = router;







/***********************************************************************/




