const { pool } = require("../../config/database");
const { logger } = require("../../config/winston");
const demonFunction = require("./demonFunction");
const jwt = require("jsonwebtoken");
const secret = require("../../config/secret");
const indexDao = require("../dao/indexDao");
const { add } = require("winston");


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



//측정소 조회
exports.readStations = async function(req, res) {

  const {stationName} = req.query;
  console.log(stationName);


  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await indexDao.selectStations(connection);

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








  //미세먼지 측정 로그 조회 (최대 90일까지)
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




  //분전함 위치에 있는 날씨 로그 조회 (최대 90일까지)
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


//분전함 등록
//json 인자 : custom_id, station_id, name, modem_number, address, administrative_dong, lat, lon, memo, installAt
exports.createBoard = async function (req, res){
  
  const { custom_id, station_id, name, modem_number, address, administrative_dong, lat, lon, memo, installAt} = req.body;
  
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
      
      const [rows] = await indexDao.insertBoard(connection, custom_id, station_id, name, modem_number, address, administrative_dong, lat, lon, xy.x, xy.y, memo, installAt);
      await demonFunction.getWeatherData();

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






  //분전함 삭제 (custom_id를 받음)
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



  //분전함 수정 (custom_id에 해당하는 컬럼 수정)
  //json으로 입력받은 인자만 수정함 (모든 인자 다 적을 필요 없음, 변경할 인자만 기입)
  //json 인자 : custom_id(필수), station_id, name, modem_number, address, administrative_dong, lat, lon, memo, installAt
exports.updateBoard = async function (req, res){
  
  const { custom_id, station_id, name, modem_number, address, administrative_dong, lat, lon, memo, installAt} = req.body;
  
  //DB입력
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      


      //custom_id (기기고유번호) 중복 검사
      const duplicateCustomIdCheck = await indexDao.duplicateCustomIdCheck(connection, custom_id); 

      if(!duplicateCustomIdCheck){ //id가 존재할 때 (수정가능)

        let x;
        let y;



        if(lat && lon){ //json에 위도 경도 값이 있으면
          let xy = dfs_xy_conv('toXY', lat, lon);
          x = xy.x;
          y = xy.y;
        }


        console.log("test1")
   
        const [rows] = await indexDao.updateBoard(connection, custom_id, station_id, name, modem_number, address, administrative_dong, lat, lon, x, y, memo, installAt);
          return res.send({
            isSuccess: true,
            code: 200, // 요청 실패시 400번대 코드
            message: "분전함 수정 성공.",
          });
      }

    //id가 존재하지않을때 (수정불가능)
     return res.send({
          isSuccess: true,
          code: 400, // 요청 실패시 400번대 코드
          message: "분전함 수정 실패.",
        });
 


    } catch (err) {
      logger.error(`updateBoard Query error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    logger.error(`updateBoard DB Connection error\n: ${JSON.stringify(err)}`);
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

      const { userIdx, nickname } = rows[0];

      // 3. JWT 발급
      const token = jwt.sign(
        { userIdx: userIdx, nickname: nickname }, // payload 정의
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

  const { userID, password, nickname } = req.body;

  // 1. 유저 데이터 검증
  const userIDRegExp = /^[a-z]+[a-z0-9]{5,19}$/; // 아이디 정규식 영문자로 시작하는 영문자 또는 숫자 6-20
  const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,16}$/; // 비밀번호 정규식 8-16 문자, 숫자 조합
  const nicknameRegExp = /^[가-힣|a-z|A-Z|0-9|]{2,10}$/; // 닉네임 정규식 2-10 한글, 숫자 또는 영문

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

  if (!nicknameRegExp.test(nickname)) {
    return res.send({
      isSuccess: false,
      code: 400, // 요청 실패시 400번대 코드
      message: "닉네임 정규식 2-10 한글, 숫자 또는 영문",
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
        nickname
      );

      // 입력된 유저 인덱스
      const userIdx = rows.insertId;

      // 3. JWT 발급
      const token = jwt.sign(
        { userIdx: userIdx, nickname: nickname }, // payload 정의
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


// 로그인 유지, 토큰 검증
exports.readJwt = async function (req, res) {
  const { userIdx, nickname } = req.verifiedToken;

  return res.send({
    result: { userIdx: userIdx, nickname: nickname },
    code: 200, // 요청 실패시 400번대 코드
    message: "유효한 토큰입니다.",
  });
};


async function getStationData(){


  try{
    const connection = await pool.getConnection(async (conn) => conn);

    try{
      
        console.log("updating stationData . . . ");
  

        var request = require('request');

        var url = 'http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList';
        var queryParams = '?' + encodeURIComponent('serviceKey') + secret.publicDataKey; /* Service Key*/
        queryParams += '&' + encodeURIComponent('returnType') + '=' + encodeURIComponent('json'); /* */
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('100'); /* */
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
        queryParams += '&' + encodeURIComponent('addr') + '=' + encodeURIComponent('부산'); /* */
        queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(''); /* */
        
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

               if(rows.length < 1){ //id가 존재하지 않을 때 실행
                  const [results] = await indexDao.insertStation(connection, jsonData[i].dmX, jsonData[i].dmY, jsonData[i].addr, jsonData[i].stationName);
               }

          }


        });


    }catch (err) {
      logger.error(`getStationData error\n: ${JSON.stringify(err)}`);
      return false;
    } finally {
      connection.release();
    }


  }catch(err){
    logger.error(`getStationData DB Connection error\n: ${JSON.stringify(err)}`);
    return false;
  }



}



//<서버 가동 시 수행>
getStationData(); //서버 가동 시 측정소 정보 업데이트 수행

// demonFunction.getLastDustData(); //서버 가동시 1회 실행 (이미 해당시간 데이터가 있다면 주석 처리할 것)
// demonFunction.getWeatherData(); //서버 가동시 1회 실행 (이미 해당시간 데이터가 있다면 주석 처리할 것)

setInterval(demonFunction.getLastDustData, secret.intervalTime); //서버 가동 후 1시간뒤부터 1시간마다 실행
setInterval(demonFunction.getWeatherData, secret.intervalTime); //서버 가동 후 1시간뒤부터 1시간마다 실행