
<할일>
1. 우클릭 - 연결 화면 만들기


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

front 폴더안에 있는 js파일의 url을 전부 수정하기 (127.0.0.1 -> 61.80.179.120)
ex) sudo nano signup.js

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