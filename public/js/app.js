
var title = "";

  var paramId = getQueryVariable("id");
  var paramPage = getQueryVariable("select");
  //alert(paramId);
  if(paramId !== undefined){
    //show announcement details
    var paramAction = getQueryVariable("action");
    //action is null if user select to view

    if(paramAction !== undefined){
      //if not null, action is edit
      //show editable form
    }
  }else{
    if(paramPage === "myannouncements"){
      //show announcements
      title = "My Announcements";
      //$(".toHide").hide();
      //$("#myannouncements").show();
      
      //alert("myannouncements");
     }else if (paramPage === "announcementrequests"){
      
      //show requests
      title = "Announcement Requests";
      //$(".toHide").hide();
      //$("#requests").show();
      //alert("requests");
     }
  }
  
function toggleVisibility(newSection) {
        $(".hide").hide();
        $("#" + newSection).show();
    }

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
  console.log('Query Variable ' + variable + ' not found');
}

var app = angular.module("smux",[]);
  
app.controller("OptionController", function($scope){
	console.log(title);
	$scope.annocTitle = title;
})

