/*
토큰 검증 API 연동

1. 로컬스토리지에서 x-access-token 확인
2. 토큰 검증 API 요청
3. 유효한 토큰이 아니라면, 로그아웃
4. 유효한 토큰이라면 로그인 상태 확인. 헤더 로그인/회원가입 -> 안녕하세요 (닉네임)님으로 수정


---
로그아웃 버튼 이벤트 연결

*/

//IP 설정--------------------------------------------------------------
const ipp = "127.0.0.1";
//const ipp = "61.80.179.120";
//--------------------------------------------------------------------



let url = "http://"+ipp+":23000";

// 1. 로컬스토리지에서 x-access-token 확인
const jwt = localStorage.getItem("x-access-token");
setHeader(jwt);

// 로그아웃 버튼 이벤트 연결
const btnSignOut = document.querySelector("#sign-out");
btnSignOut.addEventListener("click", signOut);

function signOut(event) {
  localStorage.removeItem("x-access-token"); // 토큰 삭제하고
  location.replace("../index.html"); // 새로고침
}

const btnEditMyInfo = document.querySelector("#edit-myInfo");
btnEditMyInfo.addEventListener("click", editMyInfo);

function editMyInfo(event){
  alert("개인정보 수정 화면 출력");
}

const btnUserManagement = document.querySelector("#user-management");
btnUserManagement.addEventListener("click", userManagement);

function userManagement(event){
  alert("회원관리 화면 출력");
}

const btnUserEnrollment = document.querySelector("#user-enrollment");
btnUserEnrollment.addEventListener("click", userEnrollment);

function userEnrollment(event){
  window.open("../signup.html","회원 등록","width=500,height=500,top=100,left=100")
}


async function setHeader(jwt) {
  if (!jwt) {
    return false;
  }

  // 2. 토큰 검증 API 요청
  const jwtReturn = await axios({
    method: "get", // http method
    url: url + "/jwt",
    headers: { "x-access-token": jwt }, // packet header
    data: {}, // packet body
  });

  // 3. 유효한 토큰이 아니라면, 로그아웃
  const isValidJwt = jwtReturn.data.code == 200;

  if (!isValidJwt) {
    signOut();
    return false;
  }

  // 4. 유효한 토큰이라면 로그인 상태 확인. 헤더 로그인/회원가입 -> 안녕하세요 (이름)님으로 수정
  const userIdx = jwtReturn.data.result.userIdx;
  const nickname = jwtReturn.data.result.nickname;
  const grade = jwtReturn.data.result.grade;

  const spanNickname = document.querySelector(".nickname");


  //등급별 사용 기능 제한
  if(grade >= 10){
    spanNickname.innerText = nickname + "(관리자)";
    btnUserManagement.style.visibility = "visible"; //회원관리 버튼 보이게 설정
    btnUserEnrollment.style.visibility = "visible"; //회원등록 버튼 보이게 설정
  } 
  else{
    spanNickname.innerText = nickname + "(일반사용자)";
  }

  return true;
}

