==================<개발환경>=================

IP = 61.80.179.120
ID = oenterms
PW = 5920890~3
SSH PORT =  20022
Web PORT =  20080
원격데스크톱 PORT = 23389
MySql PORT = 3306 (외부접속은 23306인데 작동X)
Nodejs PORT = 23000
mysql 접속 : mysql -u oenterms -p
웹주소 :  http://61.80.179.120:20080/
참고사이트 : http://61.80.179.117:8082/

db이름 : d447 (없으면 생성)
mysql계정 : oenterms / 5920890~3


===========<우분투 서버 설치과정>====================================

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


<리눅스 컴퓨터에 설치하기>

프로젝트 폴더에 있는 sql문으로 db설정하기 (워크벤치 - Administration - Data Import/Restore)

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

<무중단 배포 실행 (서버시작)>
back 폴더내에서
sudo pm2 start index.js

<서버 재시작>
sudo pm2 list
sudo pm2 restart id번호

<서버 종료>
sudo pm2 list
sudo pm2 stop id번호



