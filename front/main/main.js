/* 지도 생성 */


var map = new Tmapv2.Map("tmap", { // 지도가 생성될 div
    center : new Tmapv2.LatLng(35.2071463000, 129.0762170000),
    width : "100%", // 지도의 넓이
    height : "100%", // 지도의 높이
    zoom : 17
});


  let new_lat,new_lon;



  //tab1에 마커 정보 띄우기

  function getMarkerContent(data) {
  
    return `
    
    <table>
        <tbody>
            <tr>
                <td class = "category">측정소 id</td>
                <td>${data.st_id}</td>
            </tr>
             <tr>
                <td class = "category">측정소명</td>
                <td>${data.stName}</td>
            </tr>

            <tr>
                <td class = "category">측정일시</td>
                <td>${data.dataTime}</td>
            </tr>

            
            <tr>
                <td class = "category">상태</td>
                <td>${data.status}</td>
            </tr>


            <tr>
                <td class = "category">주소 </td>
               <td>${data.addr}</td>
            </tr>

            <tr>
                <td class= "category">x좌표</td>
                <td>${data.dmx}</td>
            </tr>

              <tr>
                  <td class = "category">y좌표</td>
                  <td>${data.dmy}</td>
            </tr>

    
            <tr>
                <td class = "category">오존 농도</td>
                <td>${data.o3Value}</td>
            </tr>

            <tr>
                <td class= "category">오존 등급</td>
                <td>${data.o3Grade}</td>
            </tr>

            <tr>
                <td class = "category">미세먼지 농도</td>
                <td>${data.pm10Value}</td>
            </tr>

            <tr>
                <td class = "category">미세먼지 등급</td>
                <td>${data.pm10Grade}</td>
            </tr>
            <tr>
                <td class = "category">초미세먼지 농도</td>
                <td>${data.pm25Value}</td>
            </tr>

            <tr>
                <td class= "category">초미세먼지 등급</td>
                <td>${data.pm25Grade}</td>
            </tr>

            <tr>
                <td class= "category">통합대기환경수치</td>
                <td>${data.khaiValue}</td>
            </tr>

           <tr>
                <td class = "category">통합대기환경지수</td>
                <td>${data.khaiGrade}</td>
            </tr>
        </tbody>
         
       </table>
    `;``
  }







  var stationArr = [];

  class StationInfo {
    constructor() {
      this.st_id = null;
      this.dmx = null;
      this.dmy = null;
      this.addr = null;
      this.stName = null;
      this.dataTime = null;
      this.status = null;
      this.o3Value = null;
      this.o3Grade = null;
      this.pm10Value = null;
      this.pm10Grade = null;
      this.pm25Value = null;
      this.pm25Grade = null;
      this.khaiValue = null;
      this.khaiGrade = null;
    }
    
    setStId(value) {
      this.st_id = value;
    }
    setDmx(value) {
      this.dmx= value;
    }
    setDmy(value) {
      this.dmy = value;
    }
    setAddr(value) {
      this.addr = value;
    }
    setStName(value) {
      this.stName= value;
    }
    
    setDataTime(value) {
      this.dataTime = value;
    }

    setStatus(value) {
      this.status = value;
    }
    setO3Value(value) {
      this.o3Value= value;
    }
    setO3Grade(value) {
      this.o3Grade = value;
    }
    setPm10Value(value) {
      this.pm10Value = value;
    }
    setPm10Grade(value) {
      this.pm10Grade = value;
    }
    setPm25Value(value) {
      this.pm25Value= value;
    }
    setPm25Grade(value) {
      this.pm25Grade = value;
    }
    setKhaiValue(value) {
      this.khaiValue = value;
    }
    setKhaiGrade(value) {
      this.khaiGrade= value;
    }

    getStId() {
     return this.st_id;
    }
    getDmx() {
      return this.dmx;
    }
    getDmy() {
      return this.dmy;
    }
    getAddr() {
      return this.addr;
    }
    getStName() {
      return this.stName;
    }
    getDataTime() {
      return this.dataTime;
    }
    getDataTime() {
      return this.status;
    }
    getO3Value() {
      return this.o3Value;
    }
    getO3Grade() {
      return this.o3Grade;
    }
    getPm10Value() {
      return this.pm10Value;
    }
    gettPm10Grade() {
      return this.pm10Grade;
    }
    getPm25Value() {
      return this.pm25Value;
    }
    getPm25Grade() {
      return this.pm25Grade;
    }
    getKhaiValue() {
      return this.khaiValue;
    }
    getKhaiGrade() {
      return this.khaiGrade;
    }

  }






  

//이동 기능


$(document).ready(function(){
 
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');

   
	})

});


(async function getStations(){
  stationArray = [];
  stationInfoArray = [];
	
	const dataSet = await axios({
		method: "get",
		url: 'http://localhost:23000/stations/',
		headers: {},
		data: {},
	});

  const dataSet2 = await axios({
    method: "get",
    url: 'http://localhost:23000/stationLogs',
    headers: {},
    data: {},
  });

  stationList = dataSet.data.result;
  stationList2 = dataSet2.data.result;
  
  for (var i = 0; i < stationList.length; i++) {
    const stationDummy = new StationInfo;


    
    stationDummy.setStId(stationList[i].station_id)
    stationDummy.setDmx(stationList[i].dmX)
    stationDummy.setDmy(stationList[i].dmY)
    stationDummy.setAddr(stationList[i].addr)
    stationDummy.setStName(stationList[i].stationName)
    stationDummy.setDataTime(stationList2[i].dataTime)
    stationDummy.setStatus(stationList2[i].status)
    stationDummy.setO3Value(stationList2[i].o3Value)
    stationDummy.setO3Grade(stationList2[i].o3Grade)
    stationDummy.setPm10Value(stationList2[i].pm10Value)
    stationDummy.setPm10Grade(stationList2[i].pm10Grade)
    stationDummy.setPm25Value(stationList2[i].pm25Value)
    stationDummy.setPm25Grade(stationList2[i].pm25Grade)
    stationDummy.setKhaiValue(stationList2[i].khaiValue)
    stationDummy.setKhaiGrade(stationList2[i].khaiGrade)


    stationArr.push(stationDummy)
  }
  let selectTop = document.querySelector("#select2");
    
  for (var i = 0; i < stationArr.length; i++) {
    // 마커를 생성합니다
    console.log(stationArr.stName);
    $(selectTop).append("<option> " +stationArr[i].stName + " (id=" +stationArr[i].st_id + ")" +"</option>");


    let coords = new Tmapv2.LatLng(stationArr[i].getDmx(), stationArr[i].getDmy());
    
    let markerContents = getMarkerContent(stationArr[i])

    var marker = new Tmapv2.Marker({
      map: map, // 마커를 표시할 지도
      position: coords, // 마커를 표시할 위치
      icon: "../icon/측정소.png"
    });

    stationArray.push(marker);



  


    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
    // 이벤트 리스너로는 클로저를 만들어 등록합니다
    // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
       marker.addListener("mouseenter", function(evt) {
          
    const tab1 =  document.querySelector("#tab-1")
        tab1.innerHTML = markerContents
        $('ul.tabs li#testtest').trigger("click");
  });

    
      marker.addListener("mouseleave", function(evt) {
    infowindow.setVisible(false)
  });

   
  }


	$(function() {

    $("#select2").change(function() {

        var v = $("#select2").val();
        var startIdx = v[0].indexOf('=');
        var endIdx = v[0].indexOf(')');
        var str_id = v[0].substring(startIdx + 1, endIdx);

        for (var i = 0; i < stationArr.length; i++) {

          if(stationArr[i].st_id == str_id){
            
            var ll = new Tmapv2.LatLng(stationArr[i].dmx, stationArr[i].dmy);
            map.setCenter(ll);
            var markerContents = getMarkerContent(stationArr[i]);
            const tab1 =  document.querySelector("#tab-1");
            tab1.innerHTML = markerContents
            $('ul.tabs li#testtest').trigger("click");
            break;
          }
          
        }


    });

});

})();

//분전함/////////////////////////////////////////




//tab1에 마커 정보 띄우기

function getLedMarkerContent(data) {

  return `
  
  <table>
      <tbody>
          <tr>
              <td class = "category">분전함 id</td>
              <td>${data.custom_id}</td>
          </tr>
           <tr>
              <td class = "category">분전소명</td>
              <td>${data.name}</td>
          </tr>

          <tr>
              <td class = "category">설치일자</td>
              <td>${data.installation_datetime}</td>
          </tr>

          
          <tr>
              <td class = "category">모뎀번호</td>
              <td>${data.modem_number}</td>
          </tr>


          <tr>
              <td class = "category">주소 </td>
             <td>${data.address}</td>
          </tr>

          <tr>
              <td class= "category">위도</td>
              <td>${data.lat}</td>
          </tr>

            <tr>
                <td class = "category">경도</td>
                <td>${data.lon}</td>
          </tr>

          <tr>
                <td class = "category">메모</td>
                <td>${data.memo}</td>
          </tr>

  
          
      </tbody>
       
     </table>
  `;``
}




function confirmPorm() {
 
      if (confirm("현재 위치에 분전함을 등록하시겠습니까?") == true){    
          showPopup()
         
      }else{   //취소
          
          return false;
     
      }
     
  }

let openWin;
  function showPopup() { 
    
    
  
    var _width = '650';
    var _height = '380';
 
    // 팝업을 가운데 위치시키기 위해 아래와 같이 값 구하기
    var _left = Math.ceil(( window.screen.width - _width )/2);
    var _top = Math.ceil(( window.screen.height - _height )/2); 
 
      openWin = window.open('../popup/08_2_popup.html', 'a', 'width='+ _width +', height='+ _height +', left=' + _left + ', top='+ _top );
      console.log(new_lat)
     
      setTimeout(function()  {
        openWin.document.getElementById('new_lat').value=new_lat
        openWin.document.getElementById('new_lon').value=new_lon
      }, 250);
      
  }




(async function setLedMarker(){

var lonlat;




    map.addListener("contextmenu", function(evt) {
      lonlat = evt.latLng; 
      new_lat = lonlat.lat();
      new_lon = lonlat.lng();  
      confirmPorm();    
      // winMessage(new_lat,new_lon);    
     
});




const dataSet = await axios({
  method: "get",
  url: 'http://localhost:23000/boards/',
  headers: {},
  data: {},
});


 ledInfo = dataSet.data.result;

 let selectTop = document.querySelector("#select3");


for (var i = 0; i < ledInfo.length; i++) {
  // 마커를 생성합니다


  $(selectTop).append("<option>" + ledInfo[i].name + " (" +ledInfo[i].custom_id + ")" +"</option>");
    led_custom_id = ledInfo[i].custom_id;


  
  let coords = new Tmapv2.LatLng(ledInfo[i].lat, ledInfo[i].lon);

  let LedmarkerContents = getLedMarkerContent(ledInfo[i])
  

  var marker = new Tmapv2.Marker({
    map: map, // 마커를 표시할 지도
    position: coords, // 마커를 표시할 위치
    draggable: true,
    icon: "../icon/분전함.png"
  });






  // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
  // 이벤트 리스너로는 클로저를 만들어 등록합니다
  // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다




     marker.addListener("mouseenter", function(evt) {

        const tab1 =  document.querySelector("#tab-1")
        tab1.innerHTML = LedmarkerContents
        $('ul.tabs li#testtest').trigger("click");
});

   
  
    marker.addListener("mouseleave", function(evt) {
  infowindow.setVisible(false)
});

    marker.addListener("dragend", function (evt) {

      let isConfilm = confirm("분전함의 위치를 현재 위치로 이동시키시겠습니까?")
      
      lonlat = evt.latLng; 
      new_lat = lonlat.lat();
      new_lon = lonlat.lng();
    

      if(isConfilm) {

        sendLonlatValue(led_custom_id,new_lat,new_lon);
      } else {
        location.reload();
      }
    });

//마커 드래그시 좌표값 넘겨주기..
    

}








//이동기능
$(function() {
  $("#select3").change(function() {

      var v = $("#select3").val();
      var startIdx = v[0].indexOf('(');
      var endIdx = v[0].indexOf(')');
      var str_id = v[0].substring(startIdx + 1, endIdx);

      for (var i = 0; i < ledInfo.length; i++) {

        if(ledInfo[i].custom_id == str_id){
          
          var ll = new Tmapv2.LatLng(ledInfo[i].lat, ledInfo[i].lon);
          map.setCenter(ll);
          var markerContents = getLedMarkerContent(ledInfo[i]);
          const tab1 =  document.querySelector("#tab-1");
          tab1.innerHTML = markerContents;


          $('ul.tabs li#testtest').trigger("click");
          break;
        }
      }
  });
});


$(function() {
  $("#select3").change(function() {

      var v = $("#select3").val();
      var startIdx = v[0].indexOf('(');
      var endIdx = v[0].indexOf(')');
      var str_id = v[0].substring(startIdx + 1, endIdx);

      for (var i = 0; i < ledInfo.length; i++) {

        if(ledInfo[i].custom_id == str_id){
          
          var ll = new Tmapv2.LatLng(ledInfo[i].lat, ledInfo[i].lon);
          map.setCenter(ll);
          var markerContents = getLedMarkerContent(ledInfo[i]);
          const tab1 =  document.querySelector("#tab-1");
          tab1.innerHTML = markerContents;


          $('ul.tabs li#testtest').trigger("click");
          break;
        }
      }
  });
});



})();






// 위치값 넘겨주는 함수



function sendLonlatValue(led_id,lat_data,lon_data) {



  console.log("hi")

      // [요청 url 선언]
  var reqURL = "http://127.0.0.1:23000/boards"; // 요청 주소
  
  
  // [요청 json 데이터 선언]
  var jsonData = { // Body에 첨부할 json 데이터
      "custom_id" : led_id,
      "lat" : lat_data,
      "lon" : lon_data,
      };  


  console.log(jsonData)

  
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
          alert("분전함의 위치가 이동되었습니다!")
    
      },
                      
      // [에러 확인 부분]
      error: function(xhr) {
          alert("DB에러")			
      },
                      
      // [완료 확인 부분]
      complete:function(data,textStatus) {
          console.log("");
          console.log("[requestPostBodyJson] : [complete] : " + textStatus);
          console.log("");    				
      }
      });		
  

}









function DeleteLed(custom_id) {

     // [요청 url 선언]
  var reqURL = "http://127.0.0.1:23000//boards/:custom_id"; // 요청 주소
  
  
  // [요청 json 데이터 선언]
  var jsonData = { // Body에 첨부할 json 데이터
      "custom_id" : custom_id,
      };  


  console.log(jsonData)

  
  console.log("");
  console.log("[requestPostBodyJson] : [request url] : " + reqURL);
  console.log("[requestPostBodyJson] : [request data] : " + JSON.stringify(jsonData));
  console.log("[requestPostBodyJson] : [request method] : " + "POST BODY JSON");
  console.log("");
  
  $.ajax({
      // [요청 시작 부분]
      url: reqURL, //주소
      data: JSON.stringify(jsonData), //전송 데이터
      type: "delete", //전송 타입
      async: true, //비동기 여부
      timeout: 5000, //타임 아웃 설정
      dataType: "JSON", //응답받을 데이터 타입 (XML,JSON,TEXT,HTML,JSONP)    			
      contentType: "application/json; charset=utf-8", //헤더의 Content-Type을 설정
                      
      // [응답 확인 부분 - json 데이터를 받습니다]
      success: function(response) {
          alert("분전함이 삭제되었습니다!")
    
      },
                      
      // [에러 확인 부분]
      error: function(xhr) {
          alert("DB에러")			
      },
                      
      // [완료 확인 부분]
      complete:function(data,textStatus) {
          console.log("");
          console.log("[requestPostBodyJson] : [complete] : " + textStatus);
          console.log("");    				
      }
      });		
  
}


