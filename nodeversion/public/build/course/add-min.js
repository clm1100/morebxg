define(["tools","jquery","validate","form"],function(e,a){e.expandMenu(),a("#addCourseNameId").validate(),a("#addCourseNameId").submit(function(){return a(this).ajaxSubmit({url:"/api/course/create",type:"POST",success:function(e){200==e.code&&(console.log(e),alert("课程添加成功"),location.href="/course/add_step1?cs_id="+e.result.cs_id)}}),!1})});