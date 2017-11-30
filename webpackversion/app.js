import './css/style.css';
import moduleLog from './custom/module.js'
import $ from "jquery"
import Calculate from './custom/calculate.js'
import 'jquery.cookie';
$(function(){
	$.cookie('the_cookie', 'the_value');
	var obj = new Calculate('calculate');
	obj.init();
	moduleLog();
	$('.btn1').click(function(){
		var url = 'a/login';
		var data = {
			tc_name:'前端学院',
			tc_pass:'123456'
		}
		$.post(url,data,function(data){
			console.log(data)
		});
	});
	$('.btn2').click(function(){
		var url = 'a/v6/teacher';
		$.post(url,function(data){
			console.log(data)
		});
	})
})

