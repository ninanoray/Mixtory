CREATE TABLE Compost (
    id INT NOT NULL auto_increment primary key,
    title VARCHAR(50) NOT NULL unique key,
    pdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    writer VARCHAR(50) NOT NULL,
    content VARCHAR(500)
);

CREATE TABLE Notice (
    id INT NOT NULL auto_increment primary key,
    title VARCHAR(50) NOT NULL unique key,
    pdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content VARCHAR(500)
);

INSERT INTO Compost VALUES (null, '칵테일 추천부탁합니다.', DEFAULT, 'rumrum','달달한 칵테일 추천부탁드립니다. 알콜도수는 20도 이하면 좋겠어요.');
INSERT INTO Notice VALUES (null, '따뜻한 연말 특별한 칵테일과 함께하세요', DEFAULT, '공지 내용입니다.');