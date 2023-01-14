module.exports = function (app) {
  const index = require("../controllers/indexController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  // app.HTTP메서드(uri, 컨트롤러 콜백함수)
  //route : 어떤 요청이 들어오면 어떤 반응을 할 것인지 정의하는 부분임

  
  //측정소 조회 
  app.get("/stations", index.readStations);

  //미세먼지 측정 전체 로그 조회 (최대 90일까지)
  app.get("/stationLogs", index.readStationLogs);

  //미세먼지 측정 최신 로그 조회
  app.get("/stationLastestLogs", index.readLastestStationLogs);

  //분전함 조회
  app.get("/boards", index.readBoards);

  //분전함 위치에 있는 날씨 전체 조회 (최대 90일까지)
  app.get("/boardWeatherLogs", index.readBoardWeatherLogs);

  //분전함 위치에 있는 날씨 최신정보 조회
  app.get("/boardLastestWeatherLogs", index.readBoardLastestWeatherLogs);

  //분전함 등록 (json으로 전달)
  app.post("/boards", index.createBoard);

  //분전함 삭제 (custom_id를 받음)
  //예제 : 127.0.0.1:23000/boards/1ABC 
  app.delete("/boards/:custom_id", index.deleteBoard);


  //분전함 수정 (json으로 전달)
  //json으로 입력받은 인자만 수정함
  app.patch("/boards", index.updateBoard);

  // 로그인
  app.post("/sign-in", index.createJwt);


  // 회원가입
  app.post("/sign-up", index.createUsers);


};
