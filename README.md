<git clone 시 해야할 일>
back/config/secret.js에서 db정보 수정
cd back
npm i


<웹서버실행>
npm start 또는 nodemon index.js





<할일>
-db 수정다하면 sql문 올리기

죄표 젤 아래로

로그컬럼 만들기
매저드엣 , 크리에이트엣 컬럼만들
왼탭 측정값전송 삭제 수정 연결(초기화)
Setinterval로 리프레시될함수 넣기
Cnf 파일만들어서 인터벌타임, db정보 키정보 저장해서 불러오기
Customid 문자열로 받고 숫자4자리만입력받도록 테스트


분전함기준
인스톨엣
업데이트엣
매저드엣
사용자 Grade컬럼추가

디지수정 (lastest삭제
분전한 측정소 관계만 설저ㅇ)


파일이름 영어로 수정
파일분리 (데몬에서쓸함수)

문서만들기 (,함수사룡법 json형식 )


 회원테이블 속성 추가 + grade 속성 추가





===========<리눅스환경에서 해야할 일>====================================

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

프로젝트파일 우분투에 옮기고

back 폴더로 들어가서

npm i  실행 (또는 npm start)



========================================================================
