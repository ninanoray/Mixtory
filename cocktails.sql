CREATE TABLE User {
    id int NOT NULL auto_increment primary key,
    username varchar(50) NOT NULL,
    password varchar(255) NOT NULL,
    email varchar(100) NOT NULL
};

CREATE TABLE Cocktails (
    id int NOT NULL auto_increment primary key,
    name varchar(20) NOT NULL unique key,
    enname varchar(20) NOT NULL,
    method varchar(10) NOT NULL
);

CREATE TABLE Ingredients (
    id int NOT NULL auto_increment primary key,
    name varchar(30) NOT NULL unique key,
    type varchar(10) NOT NULL,
    category varchar(10) NOT NULL,
    url varchar(100)
);

CREATE TABLE Recipes (
    id int not null auto_increment primary key,
    name varchar(20),
    igdcategory varchar(10),
    amount int NOT NULL,
    FOREIGN KEY(name) REFERENCES Cocktails(name),
    CHECK(amount >= 0)
);

CREATE TABLE Likes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cname VARCHAR(20) NOT NULL,
    uname VARCHAR(50) NOT NULL
);



INSERT INTO Cocktails VALUES (null, '깔루아밀크', 'Kahlua Milk', 'Build');
INSERT INTO Cocktails VALUES (null, '진토닉', 'Jin & Tonic', 'Build');
INSERT INTO Cocktails VALUES (null, '쿠바리브레', 'Cuba Libre', 'Build');
INSERT INTO Cocktails VALUES (null, '피나콜라다', 'Pina Colada', 'Blend');
INSERT INTO Cocktails VALUES (null, '피치크러쉬', 'Peach Crush', 'Build');

INSERT INTO Ingredients VALUES (null, 'Limmi 레몬즙', 'Juice', '레몬즙', 'http://beansmall.co.kr/products/5548569216');
INSERT INTO Ingredients VALUES (null, 'Giroux 라임 주스', 'Juice', '라임즙', 'https://smartstore.naver.com/barmade_kbg/products/415867499');
INSERT INTO Ingredients VALUES (null, '미닛메이드 오렌지', 'Juice', '오렌지주스', 'http://www.11st.co.kr/products/4383450160/share');
INSERT INTO Ingredients VALUES (null, 'Ocean Spray 크랜베리 주스', 'Juice', '크랜베리주스', 'https://smartstore.naver.com/-m-/products/5797523801');
INSERT INTO Ingredients VALUES (null, 'DOLE 스위티오 파인애플 쥬스', 'Juice', '파인애플주스', 'https://smartstore.naver.com/mccoffee/products/288129765');
INSERT INTO Ingredients VALUES (null, 'Giroux 그레나딘 시럽', 'Syrup', '그레나딘시럽','https://smartstore.naver.com/foodcan/products/121826181');
INSERT INTO Ingredients VALUES (null, 'Roi Thai 코코넛밀크', 'Juice', '코코넛밀크', 'http://foodvaluekorea.com/products/654423968');
INSERT INTO Ingredients VALUES (null, '진로 토닉워터', 'Juice', '토닉워터', 'http://cleanliving.kr/products/253309175');
INSERT INTO Ingredients VALUES (null, 'Peacock 진저에일 탄산음료', 'Juice', '진저에일', 'https://smartstore.naver.com/seduce/products/7370974759');
INSERT INTO Ingredients VALUES (null, '썬키스트 레몬에이드', 'Juice', '레몬에이드', 'https://smartstore.naver.com/canmarket/products/481527774');
INSERT INTO Ingredients VALUES (null, 'CocaCola 콜라', 'Juice', '콜라','https://smartstore.naver.com/jungpum119/products/7528585664');
INSERT INTO Ingredients VALUES (null, '서울우유 나 100%', 'Juice', '우유', 'https://smartstore.naver.com/guardenstore/products/4537975486');
INSERT INTO Ingredients VALUES (null, 'Titos', 'Alcohols', 'Vodka', 'https://dailyshot.co/pickup/products/1841/detail/');
INSERT INTO Ingredients VALUES (null, 'Tanqueray No.10', 'Alcohols', 'Gin', 'https://dailyshot.co/pickup/products/3199/detail/');
INSERT INTO Ingredients VALUES (null, 'Barcardi 카르타 블랑카', 'Alcohols', 'Rum', 'https://dailyshot.co/pickup/products/546/detail/');
INSERT INTO Ingredients VALUES (null, 'Jose Cuervo 에스페샬 실버', 'Alcohols', 'Tequila', 'https://dailyshot.co/pickup/products/1830/detail/');
INSERT INTO Ingredients VALUES (null, 'Makers Mark', 'Alcohols', 'Whiskey', 'https://dailyshot.co/pickup/products/246/detail/');
INSERT INTO Ingredients VALUES (null, 'De Kuyper 피치트리', 'Liqueur', '복숭아리큐르', 'https://dailyshot.co/pickup/products/273/detail/');
INSERT INTO Ingredients VALUES (null, 'Kahlua', 'Liqueur', '커피리큐르', 'https://dailyshot.co/pickup/products/144/detail/');
INSERT INTO Ingredients VALUES (null, 'Malibu 오리지널', 'Liqueur', '코코넛리큐르', 'https://dailyshot.co/pickup/products/4517/detail/');
INSERT INTO Ingredients VALUES (null, 'De Kuyper 블루큐라소', 'Liqueur', '블루큐라소', 'https://dailyshot.co/pickup/products/1835/detail/');

INSERT INTO Recipes VALUES (null, '깔루아밀크', '커피리큐르', 30);
INSERT INTO Recipes VALUES (null, '깔루아밀크', '우유', 60);
INSERT INTO Recipes VALUES (null, '진토닉', 'Gin', 30);
INSERT INTO Recipes VALUES (null, '진토닉', '토닉워터', 90);
INSERT INTO Recipes VALUES (null, '쿠바리브레', 'Rum', 50);
INSERT INTO Recipes VALUES (null, '쿠바리브레', '라임즙', 10);
INSERT INTO Recipes VALUES (null, '쿠바리브레', '콜라', 120);
INSERT INTO Recipes VALUES (null, '피나콜라다', 'Rum', 50);
INSERT INTO Recipes VALUES (null, '피나콜라다', '코코넛밀크', 30);
INSERT INTO Recipes VALUES (null, '피나콜라다', '파인애플주스', 50);
INSERT INTO Recipes VALUES (null, '피치크러쉬', '복숭아리큐르', 45);
INSERT INTO Recipes VALUES (null, '피치크러쉬', '레몬에이드', 45);
INSERT INTO Recipes VALUES (null, '피치크러쉬', '크렌베리주스', 60);