const { pool } = require("../../config/database");

exports.selectStations = async function (connection){

  const selectAllStationQuery = `SELECT * FROM measuring_station;`;
  const Params = [];

  const rows = await connection.query(selectAllStationQuery, Params);

  return rows;

}


exports.insertStation = async function (connection, dmX, dmY, addr, stationName){

  var now = new Date();

  const Query = `INSERT INTO measuring_station(dmX, dmY, addr, stationName, updateAt) values(?,?,?,?,?);`;
  const Params = [dmX, dmY, addr, stationName, now];

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

  const Query = `SELECT * FROM measuring_station WHERE stationName = ? limit 1;`;
  const Params = [stationName];

  const rows = await connection.query(Query, Params);

  return rows;

}




exports.insertLogData = async function(connection, station_id, status, o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, measureAt, json, stationName){


  var now = new Date();

  const updateQuery = `UPDATE measuring_station SET status = ?, o3Value = ?, o3Grade = ?, pm10Value = ?, pm10Grade = ?, pm25Value = ?, pm25Grade = ?, updateAt = ?, measureAt = ?, json = ? WHERE station_id = ?`; 
  const updateParams = [status, o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, now, measureAt, json, station_id];

  const insertQuery = `INSERT INTO measuring_log(stationName, measureAt, createAt, status, o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, json) values(?,?,?,?,?,?,?,?,?,?,?);`;
  const insertParams = [stationName, measureAt, now, status, o3Value, o3Grade, pm10Value, pm10Grade, pm25Value, pm25Grade, json];

  let rows1 = await connection.query(updateQuery, updateParams); 
  let rows2 = await connection.query(insertQuery, insertParams); 

  return rows1;
}



exports.getAllMeasuringLog = async function (connection){

  const Query = `SELECT * FROM measuring_log WHERE createAt BETWEEN DATE_ADD(NOW(), INTERVAL -3 MONTH) AND NOW();`; //최근 90일 데이터만 조회
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;

}




exports.selectBoards = async function (connection) {
  const Query = `select * from distribution_board left outer join  measuring_station on distribution_board.station_id = measuring_station.station_id`;
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;
};


exports.getAllWeatherLog = async function (connection){ 

  const Query = `SELECT * FROM board_weather_log WHERE createAt BETWEEN DATE_ADD(NOW(), INTERVAL -3 MONTH) AND NOW();`; //최근 90일까지 조회
  const Params = [];

  const rows = await connection.query(Query, Params);

  return rows;

}



exports.insertWeatherLogData = async function(connection, board_id, weatherMeasureAt, T1H, PTY, RN1, REH, WND, SKY, nowCastJson, forecastJson, custom_id, status, latestCommunicationAt, panel_interval){

  var now = new Date();

  const updateQuery = `UPDATE distribution_board SET weatherMeasureAt = ?, updateAt = ?, T1H = ?, PTY = ?, RN1 = ?, REH = ?, WND = ?, SKY = ?, json = ?, forecast_json = ? WHERE board_id = ?`; 
  const updateParams = [weatherMeasureAt, now, T1H, PTY, RN1, REH, WND, SKY, nowCastJson, forecastJson, board_id];

  const insertQuery = `INSERT INTO board_weather_log(custom_id, status, weatherMeasureAt, createAt, latestCommunicationAt, panel_interval, T1H, PTY, RN1, REH, SKY, WND, json, forecast_json) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
  const insertParams = [custom_id, status, weatherMeasureAt, now, latestCommunicationAt, panel_interval, T1H, PTY, RN1, REH, SKY, WND, nowCastJson, forecastJson];

  let rows1 = await connection.query(updateQuery, updateParams); 
  let rows2 = await connection.query(insertQuery, insertParams); 

  return rows1;

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



exports.insertBoard = async function (connection, custom_id, station_id, name, modem_number, address, administrative_dong, panel_interval, lat, lon, grid_x, grid_y, memo, installAt){

  var now = new Date();

  const Query = `INSERT INTO distribution_board(custom_id, station_id, name, modem_number, status, address, administrative_dong, panel_interval ,lat, lon, grid_x, grid_y, memo, updateAt, installAt, latestCommunicationAt) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
  const Params = [custom_id, station_id, name, modem_number, "정상", address, administrative_dong, panel_interval, lat, lon, grid_x, grid_y, memo, now, installAt, now];

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



exports.updateBoard = async function (connection, custom_id, station_id, name, modem_number, address, administrative_dong, panel_interval, lat, lon, x, y, memo, installAt){

  var now = new Date();

  const Query = `UPDATE distribution_board SET updateAt = ?, station_id = ifnull(?, station_id), name = ifnull(?, name), modem_number = ifnull(?, modem_number), address = ifnull(?, address), administrative_dong = ifnull(?, administrative_dong), panel_interval = ifnull(?, panel_interval), lat = ifnull(?, lat), lon = ifnull(?, lon), grid_x = ifnull(?, grid_x), grid_y = ifnull(?, grid_y), memo = ifnull(?, memo), installAt = ifnull(?, installAt) WHERE custom_id = ?;`;

  const Params = [now, station_id, name, modem_number, address, administrative_dong, panel_interval, lat, lon, x, y, memo, installAt,  custom_id];

  const rows = await connection.query(Query, Params);

  return rows;
}


// 로그인 (회원검증)
exports.isValidUsers = async function (connection, userID, password) {
  const Query = `SELECT userIdx, nickname, grade FROM users where userID = ? and password = ?;`;
  const Params = [userID, password];

  const rows = await connection.query(Query, Params);

  return rows;
};


// 회원가입
exports.insertUsers = async function (connection, userID, password, nickname) {

  var now = new Date();

  const Query = `insert into users(userID, password, nickname, grade, createAt) values (?,?,?,?,?);`;
  const Params = [userID, password, nickname, 10, now];

  const rows = await connection.query(Query, Params);

  return rows;
};


exports.updateBoardStatus = async function(connection, board_id, status){

  const Query = `UPDATE distribution_board SET status = ? WHERE board_id = ?;`;

  const Params = [status, board_id];

  const rows = await connection.query(Query, Params);

  return rows;
  
}
