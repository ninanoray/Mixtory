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
		fs.readFile(__dirname + '/my/index.html', 'utf8', function (error, data) {
			if (request.session.loggedin)
				response.send(ejs.render(data, { data: true }));
			else
				response.send(ejs.render(data, { data: false }));
		});
	}
});

app.set('index engine','ejs');
app.set('my','./my');
app.get('/', function(request, response) {
	//response.sendFile(path.join(__dirname + '/my/index.html'));
	fs.readFile(__dirname + '/my/index.html', 'utf8', function (error, data) {
		if (request.session.loggedin)
			response.send(ejs.render(data, { data: true }));
		else
			response.send(ejs.render(data, { data: false }));
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
				//response.send('Incorrect Username and/or Password!');
				response.writeHead(200, {
					'Content-Type': 'text/html; charset=utf-8'
				});
				response.write("<script>alert('ID/비밀번호를 다시 입력해주세요.')</script>");
				response.write('<script>location.href = "/login";</script>');
				//response.sendFile(path.join(__dirname + '/my/loginerror.html'));
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

app.get('/search', function(request, response) {
	fs.readFile(__dirname + '/public/search.html', 'utf8', function (error, data) {
		if (request.session.loggedin) {
			response.send(ejs.render(data, { data: true }));
		}
		else
			response.send(ejs.render(data, { data: false }));
			response.end();
	});
});

app.get('/minibar', restrict, function(request, response) {
	fs.readFile(__dirname + '/my/minibar.html', 'utf8', function (error, data) {
		if (request.session.loggedin) {
			response.send(ejs.render(data, { data: true }));
		}
		else
			response.send(ejs.render(data, { data: false }));
			//response.send('login!');
			response.end();
	});
	// if (request.session.loggedin) {
	// 	response.sendFile(path.join(__dirname + '/my/minibar.html'));
	// } else {
	// 	response.send('login!');
	// 	response.end();
	// }
});

app.get('/community', restrict, function(request, response) {
	fs.readFile(__dirname + '/my/community.html', 'utf8', function (error, data) {
		if (request.session.loggedin) {
			response.send(ejs.render(data, { data: true }));
		}
		else
			response.send(ejs.render(data, { data: false }));
			//response.send('login!');
			response.end();
	});
	// if (request.session.loggedin) {
	// 	response.sendFile(path.join(__dirname + '/my/community.html'));
	// } else {
	// 	response.send('login!');
	// 	response.end();
	// }
});

app.get('/notice', function(request, response) {
	fs.readFile(__dirname + '/public/notice.html', 'utf8', function (error, data) {
		if (request.session.loggedin) {
			response.send(ejs.render(data, { data: true }));
		}
		else
			response.send(ejs.render(data, { data: false }));
			//response.send('login!');
			response.end();
	});
});

// Board
app.get('/board', function (request, response) { 
    // 파일을 읽습니다
    fs.readFile(__dirname + '/board/list.html', 'utf8', function (error, data) {
        // 데이터베이스 쿼리를 실행합니다
        connection.query('SELECT * FROM products', function (error, results) {
            // 응답합니다
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});
app.get('/delete/:id', function (request, response) { 
    // 
    connection.query('DELETE FROM products WHERE id=?', [request.param('id')], function () {
        // ÀÀ´äÇÕ´Ï´Ù.
        response.redirect('/board');
    });
});
app.get('/insert', function (request, response) {	
    // 
    fs.readFile(__dirname + '/board/insert.html', 'utf8', function (error, data) {
        // ÀÀ´äÇÕ´Ï´Ù.
        response.send(data);
    });
});
app.post('/insert', function (request, response) {
    // º¯¼ö¸¦ ¼±¾ðÇÕ´Ï´Ù.
    var body = request.body;

    // µ¥ÀÌÅÍº£ÀÌ½º Äõ¸®¸¦ ½ÇÇàÇÕ´Ï´Ù.
    connection.query('INSERT INTO products (name, modelnumber, series) VALUES (?, ?, ?)', [
        body.name, body.modelnumber, body.series
    ], function () {
        // ÀÀ´äÇÕ´Ï´Ù.
        response.redirect('/board');
    });
});
app.get('/edit/:id', function (request, response) {
	    // ÆÄÀÏÀ» ÀÐ½À´Ï´Ù.
    fs.readFile(__dirname + '/board/edit.html', 'utf8', function (error, data) {
        // µ¥ÀÌÅÍº£ÀÌ½º Äõ¸®¸¦ ½ÇÇàÇÕ´Ï´Ù.
        connection.query('SELECT * FROM products WHERE id = ?', [
            request.param('id')
        ], function (error, result) {
            // ÀÀ´äÇÕ´Ï´Ù.
            response.send(ejs.render(data, {
                data: result[0]
            }));
        });
    });
});
app.post('/edit/:id', function (request, response) {
	    // º¯¼ö¸¦ ¼±¾ðÇÕ´Ï´Ù.
    var body = request.body

    // µ¥ÀÌÅÍº£ÀÌ½º Äõ¸®¸¦ ½ÇÇàÇÕ´Ï´Ù.
    connection.query('UPDATE products SET name=?, modelnumber=?, series=? WHERE id=?', [
        body.name, body.modelnumber, body.series, request.param('id')
    ], function () {
        // ÀÀ´äÇÕ´Ï´Ù.
        response.redirect('/board');
    });
});


app.listen(3000, function () {
    console.log('Server Running at http://127.0.0.1:3000');
});