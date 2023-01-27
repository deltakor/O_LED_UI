
<할일>


분전함 db에
제일최근통신시간, 분전함상태 컬럼 추가함

제일최근통신시간, 분전함 상태는 현재 알수없으니까 현재시간, 정상으로 디폴트값으로 자동입력되게 설정함

백엔드 데몬함수목록에서 1시간마다 분전함 select해서 제일최근통신시간이랑 현재시간이랑 18시간 차이나면 통신오류로 바뀌도록 만드는 함수 생성함

분전함 db에 panel_interval 추가 (ex. 5,4,2.5,2.5)


-------------------



정상/통신이상  .. 3개만?
클릭하면 정상만/통신이상만 보이게 수정

측정소 표에 정상/통신이상 빨강 초록 으로 표시 셀로만들어서 (분전함도 마찬가지)

연결누르면 yes no 정도는 출력
Yes 누르면 alert 창띄우게

수정하시겠습니까 창 삭제

클릭안하고 바로 우클릭가능하도록 수정

우클릭 항목중에 led전환시간 추가(연결밑에)
스피너? 로 값 입력
4개의 창을 몇초간 보여주고싳은지 설정하는곳
버튼은 전송버튼 (실제론db갱신)
분전함db에 패널인터벌 필드만들어서 스트링타입 입력박기 (0.5,30,30,50)
분전함 생성할때 기본값은 2.0으로 설정되게
창키면 저장된값 띄워놔야함

분전함 수정 용어를 수정 삭제로 변경

좌우 공간 좀더 넓히기

분전함은 뮤조건 숫자만

분전함 표를
분전함id,분전함명,상태(빨강초록),날씨(맑음 흐림 등),통신시간

로 수정

통신시간기준으로 현재시간보다 18시간 넘어가면 상태를 빨간색으로

초단위 삭제(왼쪽항목)


날씨정보 저장 + 바람 (북동 ??ms)

문서화 줫나 자세하게!!!!!!!!!!!
상업적으로 쓸때의 경우도 문서화

클릭이벤트 수정하기

아이콘 다운받기
날씨정보는 일단 임의값 집어넣기 (db)

로그인창 칸좀줄이기
백그라운드사진 저작권없는걸로
오엔터기준으류만들기

메인페이지에서 회원등록 기능추가

등급이 10이면 사용자 등록 버튼이 생김

암호수정은 전부보이게


2/2 오전미팅

회원가입아이콘없애고 디자인위주로 제작

회원든록 이런거 등급별로 보이는거 아이콘만 보이면됨 구현x




페이지새로고침하지말고
페이지실행할때 자동호출되는 함수들을 
다시실행하는방식 사용하기


상단바 로그아웃 타이틀 암호변경 
등급10일경우 회원등록(관리) 버튼보여주기
유저테이블 위도경도컬럼추가 
로그인할때 해당위치로 시작
위치저장버튼 추가
기본값은 동래구청을 저장


좌측집계값표시내역
도로조명 이랑 비슷하게
전체 n개
정상 n개
통신이상 n개
새로고침버튼

클릭했을때 우측리스트가 병셩되게

정상비정상을 아이콘으로 표시

그 밑에다가
측정소 n개
측정소 통신이상 n개

.
===========<리눅스환경설정>====================================

관리자 권한 획득 : sudo su

<원격데스트탑 설치>

sudo apt install xrdp

sudo systemctl enable --now xrdp

sudo ufw allow from any to any port 23389 proto tcp

<웹서버 설치>
apt-get install nginx

systemctl enable nginx

<웹포트변경 >
sudo nano /etc/nginx/sites-available/default

listen 20080 이랑 listen [::]:20080 으로 수정 후 저장

sudo service nginx restart

<nodejs 설치>
sudo apt-get install curl

curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -sudo apt-get install -y nodejs

node -v

npm -v 작동확인

<mysql 설치>

apt-get install mysql-server

mysql -u root -p

alter user 'root'@'localhost' identified with mysql_native_password by '5920890~3';

create user oenterms@localhost identified by '5920890~3';

grant all privileges on *.* to oenterms@localhost;

show grants for 'oenterms'@'localhost'; 로 권한 확인

flush privileges;

exit;

nano /etc/mysql/mysql.conf.d/mysqld.cnf

bind-address와 mysqlx-bind-address를 0.0.0.0로 수정 (주석x)

port 주석 해제하고 23306 수정 후 저장

systemctl start mysql

systemctl enable mysql

service mysql restart

<mysql 워크벤치연결> tcp/ip 로 23306 연결이 안되서 ssh 경유하는 방식을 사용함.

connection method : standard tcp/ip over ssh

ssh hostname : 61.80.179.120:20022

ssh username : oenterms

mysql hostname : 127.0.0.1

mysql server port : 23306

username : oenterms

+ 프로젝트 폴더에 들어있는 sql 백업본으로 DB 초기화하기


<리눅스 컴퓨터에 설치하기>

sudo apt install git

git clone https://github.com/deltakor/O_LED_UI.git

front 폴더안에 있는 js파일의 url을 전부 수정하기 (main.js는 ip변수의 값을 바꾸면되고 나머지 js파일은 하나의 url만 수정하면 된다.)

프로젝트 폴더로 가서
mv front /var/www/html/
(front 폴더 위치 이동)

sudo nano /etc/nginx/sites-enabled/default
root /var/www/html/front; 로 수정하기
index index.html index.htm; 으로 수정하기
service nginx restart

back/config/secret.js 파일 수정하기
(user : "oenterms" , password : "5920890~3", database : "d447")

cd back
sudo npm i


<무중단 배포 설치>
sudo npm i pm2 -g

<무중단 배포 실행>
back 폴더내에서
sudo pm2 start index.js

<서버 재시작>
sudo pm2 list
sudo pm2 restart id번호

<서버 종료>
sudo pm2 list
sudo pm2 stop id번호


========================================================================

IP = 61.80.179.120
ID = oenterms
PW = 5920890~3
SSH PORT =  20022
Web PORT =  20080
원격데스크톱 PORT = 23389
MySql PORT = 23306
Nodejs PORT = 23000
mysql 접속 : mysql -u oenterms -p
웹주소 :  http://61.80.179.120:20080/
참고사이트 : http://61.80.179.117:8082/
id : oenter


<<기상청_단기예보 ((구)_동네예보) 조회서비스 - 초단기실황조회>>

T1H 기온 --> 사용
PTY 강수형태 (없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7))   --> 사용
RN1 1시간 강수량
REH 습도
*입력값으로 격자 좌표를 사용함..!!
*위도경도를 가져와서 격자 좌표로 변환하여 공공데이터요청해야 함


<<한국환경공단_에어코리아_대기오염정보 - 시도별 실시간 측정정보 조회>>
1시간단위로 업데이트
통신장애가 난 측정소도 있다 flag값으로 구분함


stationName 측정소명
dataTime 측정일시 (1시간단위)
o3Value 오존 농도 (ex. 0.043)
o3Grade 오존 지수 (ex. 2)
pm10Value 미세먼지(pm10) 농도 (ex. 68)
pm10Grade 미세먼지(pm10) 지수 (ex. 2)
pm25Value 초미세먼지(pm25) 농도
pm25Grade 초미세먼지(pm25) 지수
khaiValue 통합대기환경수치 (ex. 76)
khaiGrade 통합대기환경지수 (ex. 2)

*지수(Grade) : 1 = 좋음, 2 = 보통, 3 = 나쁨 , 4  = 매우나쁨


<<한국환경공단_에어코리아_측정소정보 - 측정소 목록 조회>>
DB저장 필요

dmX, dmY = 위도경도
addr = 주소
stationName = 측정소이름