const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");
const indexDao = require("../dao/indexDao");

// 예시 코드
exports.example = async function (req, res) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.exampleDao(connection);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`example Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`example DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};




//측정소 조회
exports.readStations = async function(req, res) {

  const {stationName} = req.query;
 


  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.selectStations(connection, stationName);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readStations Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readStations DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }

};



//측정소 생성
exports.createStation = async function (req, res){
  
  const { dmX, dmY, addr, stationName} = req.body;
  
  //타입체크
  if(
    typeof stationName !== "string" ||
    typeof addr !== "string" ||
    isNaN(dmX) ||
    isNaN(dmY) 
  ){
    return  res.send({
      isSuccess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    })
  }


  //DB입력
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.insertStation(connection, dmX, dmY, addr, stationName);

      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "측정소 생성 성공",
      });


    } catch (err) {
      logger.error(`insertStation Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`insertStation DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }

};



//측정소 수정 (업데이트)
//입력받은 인자만 수정함
exports.updateStation = async function(req, res){

  const { dmX, dmY, addr, stationName} = req.body;
  const {station_id} = req.params;


  //타입체크
  if(stationName && typeof stationName !== "string"){ 
    return  res.send({
      isSuccess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    })
  }
  if(addr && typeof addr !== "string"){ 
    return  res.send({
      isSuccess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    })
  }
  if(dmX && isNaN(dmX)){ 
    return  res.send({
      isSuccess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    })
  }
  if(dmY && isNaN(dmY) ){ 
    return  res.send({
      isSuccess: false,
      code: 400,
      message: "값을 정확히 입력해주세요.",
    })
  }

  //DB입력
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

      const isValidStationId = await indexDao.isValidStationId(connection, station_id);

      if(!isValidStationId){
        return res.send({
          isSuccess: false,
          code: 410, // 요청 실패시 400번대 코드
          message: "존재하지않는 station_id입니다",
        });
      }

      const [rows] = await indexDao.updateStation(connection, station_id, dmX, dmY, addr, stationName);

      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "측정소 수정(업데이트) 성공",
      });


      console.log(2);


    } catch (err) {
      logger.error(`updateStation Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`updateStation DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }

}


//측정소 삭제
exports.deleteStation = async function (req, res) {

  const{station_id} = req.params;

  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
      const isValidStationId = await indexDao.isValidStationId(connection, station_id);

      if(!isValidStationId){
        return res.send({
          isSuccess: false,
          code: 410, // 요청 실패시 400번대 코드
          message: "존재하지않는 station_id입니다",
        });
      }
  
      const [rows] = await indexDao.deleteStation(connection, station_id);
  
      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "측정소 삭제 성공",
      });
    }catch (err) {
      logger.error(`deleteStation Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`deleteStation DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};




async function getLastDustData(){

  try{
    const connection = await pool.getConnection(async (conn) => conn);

    try{
      
        console.log("getting lastDustData . . . ");
        
        var request = require('request');

        var url = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty';
        var queryParams = '?' + encodeURIComponent('serviceKey') + '=yy48ZhZI0vb1gOljRi03%2BaL38Qu8P6nnA%2FhrUbXdAKLrt9u9pa2Lk4yfkE9PGQC%2Bj12DTPVh13EItiaamkdJ1w%3D%3D'; /* Service Key*/
        queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json'); /* */
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /* */
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
        queryParams += '&' + encodeURIComponent('sidoName') + '=' + encodeURIComponent('부산'); /* */
        queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent('1.0'); /* */
        

        request({
            url: url + queryParams,
            method: 'GET'
        }, async function (error, response, body) {
          const json = JSON.parse(body);
          const jsonData = json.response.body.items;

          const [reset] = await indexDao.resetLastestMeasuringLog(connection);
  
              for(let i = 0; i < jsonData.length; i++){
  
                  //stationName을 이용하여 id를 조회한다.     
                  const sName = jsonData[i].stationName;
                  const [rows] = await indexDao.getStationId(connection, sName);
                  
                  if(rows.length >= 1){ //id가 존재할 때 실행
                    
                    const s_id = rows[0].station_id;

                    //공공데이터에서 가져온 날짜정보는 24:00로 표현되는데 이렇게하면 mysql에 저장이안됨 그래서 24:00을 다음날 00:00로 변환하는 작업 필요
                    let date = new Date(jsonData[i].dataTime);
                    const year = date.getFullYear();
                    const month = ('0' + (date.getMonth() + 1)).slice(-2);
                    const day = ('0' + date.getDate()).slice(-2);
                    const dateStr = year + '-' + month + '-' + day;
                    const hours = ('0' + date.getHours()).slice(-2);
                    const minutes = ('0' + date.getMinutes()).slice(-2);
                    const seconds = ('0' + date.getSeconds()).slice(-2);
                    const timeStr = hours + ':' + minutes + ':' + seconds;          
                    const newDate = dateStr + " " + timeStr



                    //데이터를 가져와보면 flag라는 변수에 통신장애가 있는 결과들이 몇개 있어서 해당 부분 처리가 필요하다.
                    if(jsonData[i].coFlag === "통신장애" || jsonData[i].pm25Flag === "통신장애" || jsonData[i].pm10Flag === "통신장애" || jsonData[i].no2Flag === "통신장애" || jsonData[i].o3Flag === "통신장애" || jsonData[i].so2Flag === "통신장애"){
                      const [results] = await indexDao.insertLogData(connection, s_id, newDate, "error", -1, -1, -1, -1, -1, -1, -1, -1);
                    }else{
                      

                      //일부 측정소에 측정데이터가 없는 경우도 존재함 해당경우를 처리
                      let o3Value;
                      let o3Grade;
                      let pm10Value;
                      let pm10Grade;
                      let pm25Value;
                      let pm25Grade;
                      let khaiValue;
                      let khaiGrade;

                      if(!jsonData[i].o3Grade){
                        o3Value = -1;
                        o3Grade = -1;
                      }else{
                        o3Value = jsonData[i].o3Value;
                        o3Grade = jsonData[i].o3Grade;
                      }

                      if(!jsonData[i].pm10Grade){
                        pm10Value = -1;
                        pm10Grade = -1;
                      }else{
                        pm10Value = jsonData[i].pm10Value;
                        pm10Grade = jsonData[i].pm10Grade;
                      }

                      if(!jsonData[i].pm25Grade){
                        pm25Value = -1;
                        pm25Grade = -1;
                      }else{
                        pm25Value = jsonData[i].pm25Value;
                        pm25Grade = jsonData[i].pm25Grade;
                      }

                      if(!jsonData[i].khaiGrade){
                        khaiValue = -1;
                        khaiGrade = -1;
                      }else{
                        khaiValue = jsonData[i].khaiValue;
                        khaiGrade = jsonData[i].khaiGrade;
                      }

                      //db에 log 데이터 삽입. 
                      const [results] = await indexDao.insertLogData(connection, s_id, newDate, "normal", o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, khaiValue, khaiGrade);
                        
                    }

                  }
  
              }

              console.log("Success get lastDustData . . ! ");

        });

  


    }catch (err) {
      logger.error(`getLastDustData error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }


  }catch(err){
    logger.error(`getLastDustData DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }

}





//미세먼지 전체 측정 로그 조회
exports.readStationLogs = async function (req, res) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

      const [logs] = await indexDao.getAllMeasuringLog(connection);

      return res.send({
        result: logs,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readStationLogs Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readStationLogs DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};



//미세먼지 최신 측정 로그 조회
exports.readLastestStationLogs = async function (req, res) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      
      const [logs] = await indexDao.getLastStationLog(connection);

      return res.send({
        result: logs,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readStationLogs Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readStationLogs DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};




    //<!--
    //
    // LCC DFS 좌표변환을 위한 기초 자료
    //
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //


    function dfs_xy_conv(code, v1, v2) {
        var DEGRAD = Math.PI / 180.0;
        var RADDEG = 180.0 / Math.PI;

        var re = RE / GRID;
        var slat1 = SLAT1 * DEGRAD;
        var slat2 = SLAT2 * DEGRAD;
        var olon = OLON * DEGRAD;
        var olat = OLAT * DEGRAD;

        var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        var rs = {};
        if (code == "toXY") {
            rs['lat'] = v1;
            rs['lng'] = v2;
            var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
            ra = re * sf / Math.pow(ra, sn);
            var theta = v2 * DEGRAD - olon;
            if (theta > Math.PI) theta -= 2.0 * Math.PI;
            if (theta < -Math.PI) theta += 2.0 * Math.PI;
            theta *= sn;
            rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
            rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
        }
        else {
            rs['x'] = v1;
            rs['y'] = v2;
            var xn = v1 - XO;
            var yn = ro - v2 + YO;
            ra = Math.sqrt(xn * xn + yn * yn);
            if (sn < 0.0) - ra;
            var alat = Math.pow((re * sf / ra), (1.0 / sn));
            alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

            if (Math.abs(xn) <= 0.0) {
                theta = 0.0;
            }
            else {
                if (Math.abs(yn) <= 0.0) {
                    theta = Math.PI * 0.5;
                    if (xn < 0.0) - theta;
                }
                else theta = Math.atan2(xn, yn);
            }
            var alon = theta / sn + olon;
            rs['lat'] = alat * RADDEG;
            rs['lng'] = alon * RADDEG;
        }
        return rs;
    }
    //-->


    // let test = dfs_xy_conv('toXY', 35.0998490000, 129.0303440000);
    // console.log(test);



    
//분전함 조회
exports.readBoards = async function (req, res) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.selectBoards(connection);

      return res.send({
        result: rows,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readBoards Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readBoards DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};




//분전함 위치의 전체 날씨 로그 조회
exports.readBoardWeatherLogs = async function (req, res) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {


      const [logs] = await indexDao.getAllWeatherLog(connection);

      return res.send({
        result: logs,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readBoardWeatherLogs Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readBoardWeatherLogs DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};




//분전함 위치의 최신 날씨 로그 조회
exports.readBoardLastestWeatherLogs = async function (req, res) {

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      
      const [logs] = await indexDao.getLastWeatherLog(connection);

      return res.send({
        result: logs,
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "요청 성공",
      });
    } catch (err) {
      logger.error(`readBoardLastestWeatherLogs Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`readBoardLastestWeatherLogs DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};





async function getWeatherData(){

  try{
    const connection = await pool.getConnection(async (conn) => conn);

    try{
      
        console.log("getting WeatherData . . . ");

        //board 정보를 가져온다.
        const [boards] = await indexDao.selectBoards(connection);

        const [reset] = await indexDao.resetLastestWeatherLog(connection);

        for(let i = 0; i < boards.length; i++){
          
          let b_id = boards[i].board_id;
          let x = boards[i].grid_x;
          let y = boards[i].grid_y;

          //정시에 관한 날씨정보는 정시의 40분부터 받아올 수 있기 때문에 현재시간 - 42분 처리를 한다.
          var today = new Date();
          today.setMinutes(today.getMinutes() - 42);
        

          var year = today.getFullYear();
          var month = ('0' + (today.getMonth() + 1)).slice(-2);
          var day = ('0' + today.getDate()).slice(-2);
          
          var dateString = year + month + day;
          
          var hours = ('0' + today.getHours()).slice(-2); 
          var minutes = ('0' + today.getMinutes()).slice(-2);
          
          var timeString = hours + minutes;

          var request = require('request');

          var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
          var queryParams = '?' + encodeURIComponent('serviceKey') + '=yy48ZhZI0vb1gOljRi03%2BaL38Qu8P6nnA%2FhrUbXdAKLrt9u9pa2Lk4yfkE9PGQC%2Bj12DTPVh13EItiaamkdJ1w%3D%3D'; /* Service Key*/
          queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
          queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* */
          queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON'); /* */
          queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent(dateString); /* */
          queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent(timeString); /* */
          queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent(x); /* */
          queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent(y); /* */

          request({
              url: url + queryParams,
              method: 'GET'
          }, async function (error, response, body) {

          
          
          const json = JSON.parse(body);
          const jsonData = json.response.body.items.item;

          var T1H; //기온 (도)
          var PTY; //강수형태 (코드값)
          var RN1; //1시간 강수량 (mm)
          var REH; //습도 (%)
          
          for(let j = 0; j < jsonData.length; j++){
            
            if(jsonData[j].category === 'T1H'){
              T1H = jsonData[j].obsrValue;
            }else if(jsonData[j].category === 'PTY'){
              PTY = jsonData[j].obsrValue;
            }
            else if(jsonData[j].category === 'RN1'){
              RN1 = jsonData[j].obsrValue;
            }
            else if(jsonData[j].category === 'REH'){
              REH = jsonData[j].obsrValue;
            }

          }

        
                    const year = today.getFullYear();
                    const month = ('0' + (today.getMonth() + 1)).slice(-2);
                    const day = ('0' + today.getDate()).slice(-2);
                    const dateStr = year + '-' + month + '-' + day;
                    const hours = ('0' + today.getHours()).slice(-2);

                    let newDate = dateStr + " " + hours + ":00:00";


          //db에 log 데이터 삽입. 
          const [results] = await indexDao.insertWeatherLogData(connection, b_id, newDate, T1H, PTY, RN1, REH);
            
          });
  
        }
        
        console.log("Success get WeatherData . . ! ");

    }catch (err) {
      logger.error(`getWeatherData error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }


  }catch(err){
    logger.error(`getWeatherData DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }

}





//분전함 등록
exports.createBoard = async function (req, res){
  
  const { custom_id, name, modem_number, address, administrative_dong, lat, lon, installation_datetime, memo} = req.body;
  
  //DB입력
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {


      //custom_id (기기고유번호) 중복 검사
      const duplicateCustomIdCheck = await indexDao.duplicateCustomIdCheck(connection, custom_id); 

      if(!duplicateCustomIdCheck){ //중복일 때(false)
        return res.send({
          isSuccess: false,
          code: 410, // 요청 실패시 400번대 코드
          message: "중복된 custom_id(기기고유번호) 입니다.",
        });
      }


      //중복이 아닐 때
      let xy = dfs_xy_conv('toXY', lat, lon);
      
      const [rows] = await indexDao.insertBoard(connection, custom_id, name, modem_number, address, administrative_dong, lat, lon, installation_datetime, xy.x, xy.y, memo);

      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "분전함 등록 성공",
      });


    } catch (err) {
      logger.error(`createBoard Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createBoard DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }

};






//분전함 삭제
exports.deleteBoard = async function (req, res) {

  const{custom_id} = req.params;

  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try{
      const isValidCustomId = await indexDao.isValidCustomId(connection, custom_id);

      if(!isValidCustomId){
        return res.send({
          isSuccess: false,
          code: 410, // 요청 실패시 400번대 코드
          message: "존재하지않는 custom_id 입니다.",
        });
      }
  
      const [rows] = await indexDao.deleteBoard(connection, custom_id);
  
      return res.send({
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "분전함 삭제 성공",
      });
    }catch (err) {
      logger.error(`deleteBoard Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`deleteBoard DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};



//분전함 수정
exports.updateBoard = async function (req, res){
  


  const { custom_id, name, modem_number, address, administrative_dong, lat, lon, installation_datetime, memo} = req.body;
  
  



  //DB입력
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {


      //custom_id (기기고유번호) 중복 검사
      const duplicateCustomIdCheck = await indexDao.duplicateCustomIdCheck(connection, custom_id); 

      if(!duplicateCustomIdCheck){ //존재할 때

        let x;
        let y;



        if(lat && lon){ //위도 경도 값이 있으면
          let xy = dfs_xy_conv('toXY', lat, lon);
          x = xy.x;
          y = xy.y;
        }

        
        const [rows] = await indexDao.updateBoard(connection, custom_id, name, modem_number, address, administrative_dong, lat, lon, installation_datetime, x, y, memo);

          return res.send({
            isSuccess: true,
            code: 200, // 요청 실패시 400번대 코드
            message: "분전함 수정 성공.",
          });
      }


     return res.send({
          isSuccess: true,
          code: 400, // 요청 실패시 400번대 코드
          message: "분전함 수정 실패.",
        });
 


    } catch (err) {
      logger.error(`createBoard Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createBoard DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }

};





// 로그인
exports.createJwt = async function (req, res) {
  const { userID, password } = req.body;

  if (!userID || !password) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "회원정보를 입력해주세요.",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      // 2. DB 회원 검증
      const [rows] = await indexDao.isValidUsers(connection, userID, password);

      if (rows.length < 1) {
        return res.send({
          isSuccess: false,
          code: 410, // 요청 실패시 400번대 코드
          message: "회원정보가 존재하지 않습니다.",
        });
      }

      const { userIdx } = rows[0];

      // 3. JWT 발급
      const token = jwt.sign(
        { userIdx: userIdx }, // payload 정의
        secret.jwtsecret // 서버 비밀키
      );

      return res.send({
        result: { jwt: token },
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "로그인 성공",
      });
    } catch (err) {
      logger.error(`createJwt Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createJwt DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};




// 회원가입
exports.createUsers = async function (req, res) {
  const { userID, password } = req.body;

  // 1. 유저 데이터 검증
  const userIDRegExp = /^[a-z]+[a-z0-9]{5,19}$/; // 아이디 정규식 영문자로 시작하는 영문자 또는 숫자 6-20
  const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/; // 비밀번호 정규식 8-16 문자, 숫자 조합

  if (!userIDRegExp.test(userID)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "아이디 정규식 영문자로 시작하는 영문자 또는 숫자 6-20",
    });
  }

  if (!passwordRegExp.test(password)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "비밀번호 정규식 8-16 문자, 숫자 조합",
    });
  }

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      // 아이디 중복 검사가 필요. 직접 구현해보기.

      // 2. DB 입력
      const [rows] = await indexDao.insertUsers(
        connection,
        userID,
        password,
      );

      // 입력된 유저 인덱스
      const userIdx = rows.insertId;

      // 3. JWT 발급
      const token = jwt.sign(
        { userIdx: userIdx }, // payload 정의
        secret.jwtsecret // 서버 비밀키
      );

      return res.send({
        result: { jwt: token },
        isSuccess: true,
        code: 200, // 요청 실패시 400번대 코드
        message: "회원가입 성공",
      });
    } catch (err) {
      logger.error(`createUsers Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`createUsers DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }
};












//<서버 가동 시 수행>

getLastDustData(); //서버 가동시 1회 실행 (이미 해당시간 데이터가 있다면 주석 처리할 것)
getWeatherData(); //서버 가동시 1회 실행 (이미 해당시간 데이터가 있다면 주석 처리할 것)
setInterval(getLastDustData, 60*60*1000); //서버 가동 후 1시간뒤부터 1시간마다 실행
setInterval(getWeatherData, 60*60*1000); //서버 가동 후 1시간뒤부터 1시간마다 실행