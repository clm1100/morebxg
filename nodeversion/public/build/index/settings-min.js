define(["jquery","template","CKEDITOR","uploadify","region","validate","zhcn","form"],function(e,t,a){e.ajax({url:"/api/teacher/profile",type:"get",success:function(i){if(200==i.code){console.log(i);var o=t("settingsFormTpl",i.result);e(".body .settings").html(o),e("#upfile").uploadify({swf:"/assets/lib/uploadify/uploadify.swf",uploader:"/api/uploader/avatar",fileObjName:"tc_avatar",onUploadSuccess:function(t,a){e("#upfileView").attr("src",JSON.parse(a).result.path)},itemTemplate:"<span></span>",buttonText:"",width:"120px",height:"120px"}),e(".hometown").region({url:"/assets/lib/jquery-region/region.json"}),a.replace("tc_introduce")}}}),e(".body .settings").on("submit","#profileForm",function(){for(var t in a.instances)a.instances[t].updateElement();var i=e("select",this).find(":selected").map(function(){return e(this).text()}).toArray().join("|");return e(this).ajaxSubmit({url:"./api/teacher/modify",type:"post",data:{tc_hometown:i},success:function(e){200==e.code&&alert("保存成功")}}),!1})});