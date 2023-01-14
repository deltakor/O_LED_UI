




//데몬에서 작동되어야 할 함수들




const indexDao = require("../dao/indexDao");
const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");


exports.getLastDustData = async function (){

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

                for(let i = 0; i < jsonData.length; i++){
    
                    //stationName을 이용하여 id를 조회한다.     
                    const sName = jsonData[i].stationName;
                    
                    const [rows] = await indexDao.getStationId(connection, sName);
                    
                    if(rows.length >= 1){ //id가 존재할 때 실행
                      
                      const s_id = rows[0].station_id;
  
                      //공공데이터에서 가져온 날짜정보는 24:00로 표현되는데 24:00은  mysql에 저장이안됨 그래서 24:00을 다음날 00:00로 변환하는 작업 필요
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
                        const [results] = await indexDao.insertLogData(connection, s_id, "통신장애", -1, -1, -1, -1, -1, -1, newDate, body, jsonData[i].stationName);
                      }else{
                        
  
                        //일부 측정소에 측정데이터가 없는 경우도 존재함 해당경우를 처리
                        let o3Value;
                        let o3Grade;
                        let pm10Value;
                        let pm10Grade;
                        let pm25Value;
                        let pm25Grade;
  
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
  
                        //db에 log 데이터 삽입. 
                        const [results] = await indexDao.insertLogData(connection, s_id, "정상", o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, newDate, body, jsonData[i].stationName);
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
  




  exports.getWeatherData = async function (){

    try{
      const connection = await pool.getConnection(async (conn) => conn);
  
      try{
        
          console.log("getting WeatherData . . . ");
  
          //board 정보를 가져온다.
          const [boards] = await indexDao.selectBoards(connection);
  
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
            const [results] = await indexDao.insertWeatherLogData(connection, b_id, newDate, T1H, PTY, RN1, REH, body, boards[i].custom_id);

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
  
  
  