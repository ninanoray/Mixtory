var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var connection = mysql.createConnection({
	host     : '127.0.0.1',
	user     : 'web2022',
	password : 'web2022',
	database : 'web'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.listen(34754, function () {
    console.log('Server Running at 127.0.0.1:34754');
});

function restrict(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.session.error = 'Access denied!';
	res.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});
    res.write("<script>alert('로그인이 필요합니다.')</script>");
	res.write('<script>location.href = "/login";</script>');
	res.end();
  }
}

app.use('/', function(request, response, next) {
	
	if ( request.session.loggedin == true || request.url == "/login" || request.url == "/register"
	 || request.url == "/minibar" || request.url == "/community" || request.url == "/insert"
	 || String(request.url).includes("/search") || String(request.url).includes("/show")
	 || String(request.url).includes("/notice")) {
    	next();
	}
	else {
		//response.sendFile(path.join(__dirname + '/my/index.html'));
		fs.readFile(__dirname + '/my/index.html', 'utf8', function (error, logio) {
			if (request.session.loggedin)
				response.send(ejs.render(logio, { logio: true }));
			else
				response.send(ejs.render(logio, { logio: false }));
		});
	}
});

app.set('index engine','ejs');
app.set('my','./my');
app.get('/', function(request, response) {
	//response.sendFile(path.join(__dirname + '/my/index.html'));
	fs.readFile(__dirname + '/my/index.html', 'utf8', function (error, logio) {
		if (request.session.loggedin)
			response.send(ejs.render(logio, { logio: true }));
		else
			response.send(ejs.render(logio, { logio: false }));
	});
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/my/login.html'));
});

app.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/');
				response.end();
			} else {
				response.writeHead(200, {
					'Content-Type': 'text/html; charset=utf-8'
				});
				response.write("<script>alert('ID/비밀번호를 다시 입력해주세요.')</script>");
				response.write('<script>location.href = "/login";</script>');
			}			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/my/register.html'));
});

app.post('/register', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var password2 = request.body.password2;
	var email = request.body.email;
	console.log(username, password, email);
	if (username && password && email) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ? AND email = ?', [username, password, email], function(error, results, fields) {
			if (error) throw error;
			if (results.length <= 0) {
        connection.query('INSERT INTO user (username, password, email) VALUES(?,?,?)', [username, password, email],
            function (error, data) {
                if (error)
                  console.log(error);
                else
                  console.log(data);
        });
			  response.send(username + ' Registered Successfully!<br><a href="/">Home</a>');
			} else {
				response.send(username + ' Already exists!<br><a href="/">Home</a>');
			}			
			response.end();
		});
	} else {
		response.send('Please enter User Information!');
		response.end();
	}
});

app.get('/logout', function(request, response) {
  request.session.loggedin = false;
	//response.send('<center><H1>Logged Out.</H1><H1><a href="/">Goto Home</a></H1></center>');
	response.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});
	response.write("<script>alert('로그아웃')</script>");
	response.write('<script>location.href = "/";</script>');
	response.end();
});

// 칵테일 검색
app.get('/search', function(request, response) { // 칵테일 목록
	fs.readFile(__dirname + '/public/search.html', 'utf8', function (error, data) {
		let is_logged_in;
		if (request.session.loggedin) {
			is_logged_in = true;
			// 아래 주석처리한 것처럼의 형태는 동작을 안함
			//response.send(ejs.render(data, { logio: true }));
		}
		else {
			is_logged_in = false;
			//response.send(ejs.render(data, { logio: false }));
		}

		connection.query('SELECT * FROM Cocktails', function (error, results) {
			response.send(ejs.render(data, { cdata : results, logio: is_logged_in}));		
		});
	});
});
app.get('/search/:igd', function(request, response) { // 칵테일 목록
	fs.readFile(__dirname + '/public/search.html', 'utf8', function (error, data) {
		let is_logged_in;
		if (request.session.loggedin) {
			is_logged_in = true;
		}
		else {
			is_logged_in = false;
		}
		var sql = 'SELECT Cocktails.* FROM Cocktails, Recipes WHERE Recipes.igdcategory=? AND Cocktails.name=Recipes.name';
		connection.query(sql, [ request.params.igd ], function (error, results) {
			response.send(ejs.render(data, { cdata : results, logio: is_logged_in }));
		});
	});
});
app.get('/show/:name', restrict, function (request, response) { // 칵테일 레시피 정보
	fs.readFile(__dirname + '/board/recipes.html', 'utf8', function (error, data) {
		let is_logged_in;
		if (request.session.loggedin) {
			is_logged_in = true;
		}
		else {
			is_logged_in = false;
		}
		var uname = request.session.username;
		var cname = request.params.name;
		var sql = 'SELECT * FROM Recipes WHERE name = ?';
		var sql_like = 'SELECT cname FROM Likes WHERE uname=? AND cname=?';

        connection.query(sql, [ cname ], function (error, results) {
			connection.query(sql_like, [ uname, cname ], function (error, result) {
				response.send(ejs.render(data, { cdata: results, isLike: result, logio: is_logged_in}));
			});
        });
    });
});
app.get('/insert', restrict, function (request, response) { // 칵테일 추가
	fs.readFile(__dirname + '/board/insert.html', 'utf8', function (error, data) {
		let is_logged_in;
		if (request.session.loggedin) {
			is_logged_in = true;
		}
		else {
			is_logged_in = false;
		}
        connection.query('SELECT * FROM Recipes WHERE name = ?', [ request.param('name') ],
		 function (error, results) {
            response.send(ejs.render(data, { cdata: results, logio: is_logged_in }));
        });
    });
});
app.post('/insert', function (request, response) { // 칵테일 추가
	var sql_cocktails = 'INSERT INTO Cocktails (name, enname, method) VALUES (?, ?, ?)';
	var sql_recipes = 'INSERT INTO Recipes (name, igdcategory, amount) VALUES (?, null, 0)';
    var name = request.body.name;
	var enname = request.body.enname;
	var method = request.body.method;

	if (name && enname && method) {
		connection.query(sql_cocktails, [name, enname, method], function () {
			connection.query(sql_recipes, [name] , function() {
				response.redirect('/edit/' + name);
			});
		});
	}
	else {
		response.redirect('/search');
	}
});
app.get('/edit/:name', function (request, response) { // 칵테일 레시피 정보 수정
	fs.readFile(__dirname + '/board/edit.html', 'utf8', function (error, data) {
		let is_logged_in;
		if (request.session.loggedin) {
			is_logged_in = true;
		}
		else {
			is_logged_in = false;
		}
        connection.query('SELECT * FROM Recipes WHERE name = ?', [ request.param('name') ],
		 function (error, results) {
            response.send(ejs.render(data, { cdata: results, logio: is_logged_in }));
        });
    });
});
app.post('/edit/:name/add', function (request, response) { // 칵테일 새재료 추가
	var sql = 'INSERT INTO Recipes (name, igdcategory, amount) VALUES (?, ?, ?)';
	var name = request.param('name');
	var igdcategory = request.body.igdcategoryAdd;
	var amount = request.body.amountAdd;

	if (igdcategory && amount) {
		connection.query(sql, [name, igdcategory, amount], function () {
			response.redirect('/edit/' + name);
		});
	}
	else {
		response.redirect('/edit/' + name);
	}
});
app.post('/edit/:name/:id', function (request, response) { // 칵테일 재료 정보 수정
	var sql = 'UPDATE Recipes SET igdcategory=?, amount=? WHERE id=?';
	var id = request.param('id');
	var amount = request.body['amount_' + id];
	var name = request.param('name');
	var igdcategory = request.body['igdcategory_' + id];

	connection.query(sql, [igdcategory, amount, id], function () {
			response.redirect('/show/' + name);
	});
});
app.get('/delete/:name', function (request, response) { // 칵테일 삭제
	var sql_cocktails = 'DELETE FROM Cocktails WHERE name=?';
	var sql_recipes = 'DELETE FROM Recipes WHERE name=?';
	var name = request.param('name');

    connection.query(sql_recipes, [name], function () {
		connection.query(sql_cocktails, [name], function () {
			response.redirect('/search');
		});
    });
});
app.get('/delete/:name/:id', function (request, response) { // 칵테일 재료 삭제
	var sql_recipes = 'DELETE FROM Recipes WHERE id=?';
	var id = request.param('id');
	var name = request.param('name');

    connection.query(sql_recipes, [id], function () {
		response.redirect('/edit/' + name);
    });
});

app.get('/like/:cname/', function (request, response) { // 칵테일 재료 삭제
	var sql_like = 'INSERT IGNORE INTO Likes (cname, uname) VALUES (?, ?)';
	var cname = request.params.cname;
	var uname = request.session.username;

    connection.query(sql_like, [cname, uname], function () {
		response.redirect('/minibar');
    });
});
app.get('/dislike/:cname/', function (request, response) { // 칵테일 재료 삭제
	var sql_like = 'DELETE FROM Likes WHERE cname=? AND uname=?';
	var cname = request.params.cname;
	var uname = request.session.username;

    connection.query(sql_like, [cname, uname], function () {
		response.redirect('/show/' + cname);
    });
});

// 나만의 미니바
app.get('/minibar', restrict, function(request, response) {
	fs.readFile(__dirname + '/my/minibar.html', 'utf8', function (error, data) {
		let is_logged_in;
		if (request.session.loggedin)
			is_logged_in = true;
		else
			is_logged_in = false;
		
		var uname = request.session.username;
		// 쿼리 : 사용자가 좋아요한 칵테일의 레시피 재료 목록을 가져온다
		var sql = 'SELECT * FROM Ingredients WHERE category IN (SELECT Recipes.igdcategory FROM Likes, Recipes WHERE Likes.uname=? AND Likes.cname=Recipes.name)';
		connection.query(sql, [uname], function (error, results) {
			connection.query('SELECT * FROM Ingredients', function (error, results_second) {
				response.send(ejs.render(data, {
					cdata : results, alldata : results_second,logio: is_logged_in
				}));
			});
		});
	});
});

// 커뮤니티
app.get('/community', restrict, function(request, response) {
	fs.readFile(__dirname + '/my/community.html', 'utf8', function (error, data) {
		let is_logged_in;
		if (request.session.loggedin)
			is_logged_in = true;
		else
			is_logged_in = false;

		var sql = 'SELECT * FROM Compost'
		connection.query(sql, function (error, results) {
			response.send(ejs.render(data, { post: results, logio: is_logged_in }));
		});
	});
});

// 공지사항
app.get('/notice', function(request, response) {
	fs.readFile(__dirname + '/public/notice.html', 'utf8', function (error, data) {
		let is_logged_in;
		if (request.session.loggedin)
			is_logged_in = true;
		else
			is_logged_in = false;

		var sql = 'SELECT * FROM Notice'
		connection.query(sql, function (error, results) {
			response.send(ejs.render(data, { post: results, logio: is_logged_in }));
		});
	});
});