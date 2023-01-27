

(function sendValue() {

    let btn = document.querySelector("#btn")
    btn.addEventListener("click",function() {

        if(checkform() == true) {

        var custom_id = document.getElementById("new_id").value;
        var name = document.getElementById("new_name").value;
        var modem_number= document.getElementById("new_mdNum").value;
    
        var address = document.getElementById("new_addr").value;
    
        var administrative_dong = document.getElementById("new_dong").value;
        var lat= document.getElementById("new_lat").value;
        var lon = document.getElementById("new_lon").value;
        var memo = document.getElementById("memo").value;    
        var selected_station = $("#selectLED_list option:selected").val();
     
        
    
    
        // [요청 url 선언]
    var reqURL = "http://127.0.0.1:23000/boards"; // 요청 주소
    //var reqURL = "http://61.80.179.120:23000/boards";
    
    
    // [요청 json 데이터 선언]
    var jsonData = { // Body에 첨부할 json 데이터
        "custom_id" : custom_id,
        "name" : name,
        "modem_number" : modem_number,
        "address" :address ,
        "administrative_dong" : administrative_dong,
        "lat" : lat,
        "lon" : lon,
        "memo" : memo,
        "station_id" : selected_station
        };  
    
    console.log("");
    console.log("[requestPostBodyJson] : [request url] : " + reqURL);
    console.log("[requestPostBodyJson] : [request data] : " + JSON.stringify(jsonData));
    console.log("[requestPostBodyJson] : [request method] : " + "POST BODY JSON");
    console.log("");
    
    $.ajax({
        // [요청 시작 부분]
        url: reqURL, //주소
        data: JSON.stringify(jsonData), //전송 데이터
        type: "patch", //전송 타입
        async: true, //비동기 여부
        timeout: 5000, //타임 아웃 설정
        dataType: "JSON", //응답받을 데이터 타입 (XML,JSON,TEXT,HTML,JSONP)    			
        contentType: "application/json; charset=utf-8", //헤더의 Content-Type을 설정
                        
        // [응답 확인 부분 - json 데이터를 받습니다]
        success: function(response) {
            alert("성공적으로 보냈습니다!")
            setTimeout(function()  {
            opener.location.reload();
            },250);
            window.close();
        },
                        
        // [에러 확인 부분]
        error: function(xhr) {
            alert("에러가 났습니다!")			
        },
                        
        // [완료 확인 부분]
        complete:function(data,textStatus) {
            console.log("");
            console.log("[requestPostBodyJson] : [complete] : " + textStatus);
            console.log("");    				
        }
        });		
    }
    })
    

})();


// sendValue();



//입력폼 제어


$(document).ready(function(){

  $("input:text[numberOnly]").on("keyup", function() {
     let content = $(this).val();
     $(this).val($(this).val().replace(/[^0-9]/g,""));

     if(content.length<4) {
        //여기다가 0000 붙이샘
     }
     if(content.length>4) {
        $(this).val($(this).val().substring(0, 4));
        alert('숫자는 4자리수 만큼 가능합니다..');
     }
  });
  
});

function numberPad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}








$('#selectLED_list').each(function() {
     

    var val = $(this).val();  //value
    var text = $(this).text();  //text     
    var openselect = $(opener.document).find('#select2 option'); //부모창 select 박스
 
    
    for(var i = 0; i < openselect.length; i++) {
      
      
      $(selectLED_list).append("<option value = " + openselect[i].value +">" +openselect[i].text +"</option>");
     
    }

    
    
   });  

   if(window.close()) {
   window.opener.location.reload();
   }

function close_reload(){
    opener.parent.location.reload();
    window.close();
}
   


function checkform(){


    if( $.trim($("#new_id").val()) == '' ){
    
            alert("아이디를 입력해 주세요.");
    
            $("#new_id").focus();
    
            return false;
    
    }
    
    if( $.trim($("#new_name").val()) == '' ){
    
    alert("이름을 입력해 주세요.");
    
    $("#new_name").focus();
    
    return false;
    
        }
    if( $.trim($("#new_mdNum").val()) == '' ){
    
            alert("모뎀번호를 입력해 주세요.");
            
            $("#new_mdNum").focus();
            
            return false;
            
     }   
    
    if( $.trim($("#new_addr").val()) == '' ){
    
              alert("장소를 입력해 주세요.");
                    
              $("#new_addr").focus();
                    
             return false;
                    
     }
    
     if( $.trim($("#new_dong").val()) == '' ){
    
        alert("행정구역를 입력해 주세요.");
              
        $("#new_dong").focus();
              
       return false;
              
    }
    
        return true;
    }