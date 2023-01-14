const { pool } = require("../../config/database");

exports.exampleDao = async function (connection) {
  const Query = `SELECT * FROM measuring_station;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};

exports.selectStations = async function (connection, stationName){


  const selectAllStationQuery = `SELECT * FROM measuring_station;`;
  const selectStationByNameQuery = `SELECT * FROM measuring_station where stationName = ?;`;
  const Params = [stationName];

  let Query;

  if(!stationName){
    Query = selectAllStationQuery;
  }else{
    Query = selectStationByNameQuery;
  }

  const rows = await connection.query(Query, Params);

  return rows;

}


exports.insertStation = async function (connection, dmX, dmY, addr, stationName){
  const Query = `INSERT INTO measuring_station(dmX, dmY, addr, stationName) values(?,?,?,?);`;
  const Params = [dmX, dmY, addr, stationName];

  const rows = await connection.query(Query, Params);

  return rows;
}


exports.isValidStationId = async function (connection, station_id){

  const Query = `SELECT * FROM measuring_station WHERE station_id = ?;`;
  const Params = [station_id];

  const [rows] = await connection.query(Query, Params);

  if (rows < 1){ //존재하지않는 id일때
    return false;
  }

  return true;

}

exports.updateStation = async function (connection, station_id, dmX, dmY, addr, stationName){

  //입력된 값만 수정하는 쿼리
  const Query = `UPDATE measuring_station SET dmX = ifnull(?, dmX), dmY = ifnull(?, dmY), addr = ifnull(?, addr), stationName = ifnull(?, stationName) WHERE station_id = ?;`;
  const Params = [dmX, dmY, addr, stationName, station_id];

  const rows = await connection.query(Query, Params);

  return rows;
}


exports.deleteStation = async function (connection, station_id){
  const Query = `DELETE FROM measuring_station WHERE station_id = ?;`;
  const Params = [station_id];

  const rows = await connection.query(Query, Params);

  return rows;
}



exports.getStationId = async function (connection, stationName){

  const Query = `SELECT * FROM blog.measuring_station WHERE stationName = ? limit 1;`;
  const Params = [stationName];

  const rows = await connection.query(Query, Params);

  return rows;

}


exports.resetLastestMeasuringLog = async function (connection){

  const resetQuery = `TRUNCATE measuring_lastest_log;`;
  const Params = [];

  const rows = await connection.query(resetQuery, Params);

  return rows;

}



exports.insertLogData = async function(connection, station_id, dataTime, status, o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, khaiValue, khaiGrade){

  const Query = `INSERT INTO measuring_log(station_id, dataTime, status, o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, khaiValue, khaiGrade) values(?,?,?,?,?,?,?,?,?,?,?);`;
  const QueryLastest = `INSERT INTO measuring_lastest_log(station_id, dataTime, status, o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, khaiValue, khaiGrade) values(?,?,?,?,?,?,?,?,?,?,?);`;
  const Params = [station_id, dataTime, status, o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, khaiValue, khaiGrade];

  let rows = await connection.query(Query, Params); //전체 log db 삽입
  rows = await connection.query(QueryLastest, Params); //최신 log db 삽입

  return rows;

}



exports.getAllMeasuringLog = async function (connection){

  const Query = `SELECT * FROM measuring_log WHERE dataTime BETWEEN DATE_ADD(NOW(), INTERVAL -3 MONTH) AND NOW();`; //최근 90일 데이터만 조회
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;

}


exports.getLastStationLog = async function (connection) {
  const Query = `SELECT * FROM measuring_lastest_log;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};


exports.selectBoards = async function (connection) {
  const Query = `SELECT * FROM distribution_board;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};


exports.getAllWeatherLog = async function (connection){ 

  const Query = `SELECT * FROM board_weather_log WHERE datetime BETWEEN DATE_ADD(NOW(), INTERVAL -3 MONTH) AND NOW();`; //최근 90일까지 조회
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;

}


exports.getLastWeatherLog = async function (connection) {
  const Query = `SELECT * FROM board_weather_lastest_log;`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};




exports.insertWeatherLogData = async function(connection, board_id, datetime, T1H, PTY, RN1, REH){

  const Query = `INSERT INTO board_weather_log(board_id, datetime, T1H, PTY, RN1, REH) values(?,?,?,?,?,?);`;
  const QueryLastest = `INSERT INTO board_weather_lastest_log(board_id, datetime, T1H, PTY, RN1, REH) values(?,?,?,?,?,?);`;
  const Params = [board_id, datetime, T1H, PTY, RN1, REH];

  let rows = await connection.query(Query, Params); //log db삽입
  rows = await connection.query(QueryLastest, Params); //lastest log db 삽입

  return rows;

}


exports.resetLastestWeatherLog = async function (connection){

  const resetQuery = `TRUNCATE board_weather_lastest_log;`;
  const Params = [];
  const rows = await connection.query(resetQuery, Params);

  return rows;

}



exports.duplicateCustomIdCheck = async function (connection, custom_id){

  const Query = `SELECT * FROM distribution_board WHERE custom_id = ?;`;
  const Params = [custom_id];

  const [rows] = await connection.query(Query, Params);

  if (rows < 1){ //존재하지않는 id일때 (정상)
    return true;
  }

  return false;

}



exports.insertBoard = async function (connection, custom_id, name, modem_number, address, administrative_dong, lat, lon, installation_datetime, grid_x, grid_y, memo){
  const Query = `INSERT INTO distribution_board(custom_id, name, modem_number, address, administrative_dong, lat, lon, installation_datetime, grid_x, grid_y, memo) values(?,?,?,?,?,?,?,?,?,?,?);`;
  const Params = [custom_id, name, modem_number, address, administrative_dong, lat, lon, installation_datetime, grid_x, grid_y, memo];

  const rows = await connection.query(Query, Params);

  return rows;
}



exports.isValidCustomId = async function (connection, custom_id){

  const Query = `SELECT * FROM distribution_board WHERE custom_id = ?;`;
  const Params = [custom_id];

  const [rows] = await connection.query(Query, Params);

  if (rows < 1){ //존재하지않는 id일때
    return false;
  }

  return true;

}


exports.deleteBoard = async function (connection, custom_id){
  const Query = `DELETE FROM distribution_board WHERE custom_id = ?;`;
  const Params = [custom_id];

  const rows = await connection.query(Query, Params);

  return rows;
}



exports.updateBoard = async function (connection, custom_id, name, modem_number, address, administrative_dong, lat, lon, installation_datetime, grid_x, grid_y, memo){
  const Query = `UPDATE distribution_board SET name = ifnull(?, name), modem_number = ifnull(?, modem_number), address = ifnull(?, address), administrative_dong = ifnull(?, administrative_dong), lat = ifnull(?, lat), lon = ifnull(?, lon), installation_datetime = ifnull(?, installation_datetime), grid_x = ifnull(?, grid_x), grid_y = ifnull(?, grid_y), memo = ifnull(?, memo) WHERE custom_id = ?;`;

  const Params = [name, modem_number, address, administrative_dong, lat, lon, installation_datetime, grid_x, grid_y, memo, custom_id];

  const rows = await connection.query(Query, Params);

  return rows;
}


// 로그인 (회원검증)
exports.isValidUsers = async function (connection, userID, password) {
  const Query = `SELECT userIdx FROM Users where userID = ? and password = ?;`;
  const Params = [userID, password];

  const rows = await connection.query(Query, Params);

  return rows;
};


// 회원가입
exports.insertUsers = async function (connection, userID, password) {
  const Query = `insert into Users(userID, password) values (?,?);`;
  const Params = [userID, password];

  const rows = await connection.query(Query, Params);

  return rows;
};