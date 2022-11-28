var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var connection = mysql.createConnection({
	host     : 'localhost',
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
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

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
	 || request.url == "/minibar" || request.url == "/community" || request.url == "/search"
	 || request.url == "/notice") {
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
app.get('/search', function(request, response) {
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
			// 응답합니다
			response.send(ejs.render(data, { cdata : results, logio: is_logged_in}));
		});
	});
});
app.get('/delete/:id', function (request, response) { 
    connection.query('DELETE FROM Cocktails WHERE id=?', [request.param('id')], function () {
		response.redirect('/search');
    });
});
app.get('/insert', function (request, response) {	
	fs.readFile(__dirname + '/board/insert.html', 'utf8', function (error, data) {
        response.send(data);
    });
});
app.post('/insert', function (request, response) {
    var body = request.body;

    connection.query('INSERT INTO Cocktails (name, enname, method) VALUES (?, ?, ?)', [
        body.name, body.enname, body.method
    ], function () {
		response.redirect('/search');
    });
});
app.get('/edit/:id', function (request, response) {
	fs.readFile(__dirname + '/board/edit.html', 'utf8', function (error, data) {
        connection.query('SELECT * FROM Cocktails WHERE id = ?', [
            request.param('id')
        ], function (error, result) {
            response.send(ejs.render(data, { data: result[0] }));
        });
    });
});
app.post('/edit/:id', function (request, response) {
    var body = request.body

    connection.query('UPDATE Cocktails SET name=?, enname=?, method=? WHERE id=?', [
        body.name, body.enname, body.method, request.param('id')
    ], function () {
		response.redirect('/search');
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

		connection.query('SELECT * FROM Ingredients', function (error, results) {
			// 응답합니다
			response.send(ejs.render(data, { cdata : results, logio: is_logged_in}));
		});
	});
});
app.get('/minibar/delete/:id', function (request, response) { 
    // 
    connection.query('DELETE FROM Ingredients WHERE id=?', [request.param('id')], function () {
		response.redirect('/minibar');
    });
});

// 커뮤니티
app.get('/community', restrict, function(request, response) {
	fs.readFile(__dirname + '/my/community.html', 'utf8', function (error, data) {
		if (request.session.loggedin) {
			response.send(ejs.render(data, { logio: true }));
		}
		else
			response.send(ejs.render(data, { logio: false }));
			response.end();
	});
});

// 공지사항
app.get('/notice', function(request, response) {
	fs.readFile(__dirname + '/public/notice.html', 'utf8', function (error, data) {
		if (request.session.loggedin) {
			response.send(ejs.render(data, { logio: true }));
		}
		else
			response.send(ejs.render(data, { logio: false }));
			response.end();
	});
});


app.listen(3000, function () {
    console.log('Server Running at http://127.0.0.1:3000');
});