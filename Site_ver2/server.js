const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const app = express();
const port = 3000;
const urlencodedParser = express.urlencoded({ extended: false });
const mysql = require('mysql');
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json()); //Переводим все полученные данные в объекты json
app.use(express.urlencoded({ extended: false })); //Запрещаем формировать массивы(Если передаете массив данных,лучше поставить true)



app.use(
    session({
        secret: "secret", //Задаем ключ сессий
        store: new FileStore(), //Указываем место хранения сессий(Используя этот пакет,у вас будет создана папка sessions, в которой будут хранится сессии и, даже если сервер перезагрузится,пользователь останется авторизованным
        cookie: {
            path: "/",
            httpOnly: true, // path - куда сохранять куки, httpOnly: true - передача данных только по https/http,maxAge - время жизни куки в миллисекундах 60 * 60 * 1000 = 1 час 
            maxAge: 60 * 60 * 1000
        },
        resave: false,
        saveUnitialized: false
    })
);



var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "site_vkr"
});


require('./config'); //Подключаем наш конфиг

connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

app.use(passport.initialize()); //Инициализируем паспорт
app.use(passport.session()); //Синхронизируем сессию с паспортом

//Проверяем если авторизован - пропускаем дальше,если нет запрещаем посещение роута
const logout = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        next()
    }
}



app.get("/", function (request, response) {
    response.render("index.ejs");
});

app.get("/index.html", function (res, response) {
    response.render("index.ejs");
});

app.get("/search", (req, res) => {

    connection.query("SELECT Tags FROM tags WHERE id = '" + req.user + "'", function (err_2, result_2) {
        console.log(result_2);
        let arr = result_2[0].Tags.split(', ');
        console.log(arr);
        connection.query("SELECT * FROM job WHERE tags LIKE '%"+ arr[0] + "%' OR tags LIKE '%" + arr[1] + 
        "%' OR tags LIKE '%" + arr[2] + "%' OR tags LIKE '%" + arr[3] + "%' OR tags LIKE '%" + arr[4] + 
        "%' OR tags LIKE '%" + arr[5] + "%'", (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send(error);
            }
            console.log(result);
            res.send(`
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Главная</title>
                <script src="server.js"></script>
                <style>
                    body {
                        margin: 0;
                        background-color: #5CDB95;
                    }

                    main {
                        background-color: #05386B;
                        color: #EDF5E1;
                        box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
                        border-radius: 30px;
                        margin-top: 25px;
                        margin-left: auto;
                        margin-right: auto;
                        padding-bottom: 30px;
                        padding-left: 15px;
                        padding-right: 15px;
                        width: 80%;
                        font-family: 'Roboto', sans-serif;
                    }

                    main h2 {
                        padding-top: 30px;
                        text-align: center;
                    }

                    main p {
                        color: #EDF5E1;
                        font-size: 18px;
                        line-height: 1.6;
                        text-align: justify;
                        margin-left: 100px;
                        margin-right: 100px;
                        margin-bottom: 14em;
                    }

                    header {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        flex-wrap: wrap;
                        background-color: #05386B;
                        padding: 20px 10px;
                        font-family: 'Roboto', sans-serif;
                    }

                    .wrap-logo {
                        display: flex;
                        align-items: center;
                        font-family: 'Roboto', sans-serif;
                    }

                    header a {
                        color: #EDF5E1;
                        padding: 12px;
                        text-decoration: none;
                        font-size: 18px;
                        border-radius: 30px;
                        border: 2px solid #05386B;
                    }

                    header a.logo {
                        font-size: 25px;
                        font-weight: bold;
                    }

                    header a:hover {
                        color: #5CDB95;
                        border: 2px solid #5CDB95;
                    }

                    nav {
                        display: flex;
                        align-items: center;
                    }

                    @media (max-width: 576px) {
                        main {
                            padding: 20px 50px;
                        }
                    }

                    main a {
                        color: #EDF5E1;
                        padding: 12px;
                        text-decoration: none;
                        font-size: 18px;
                        border-radius: 30px;
                        border: 2px solid #05386B;
                        margin-left: auto;
                        margin-right: auto;
                        display: block;
                        text-align: center;
                        justify-content: center;
                    }

                    footer {
                        background-color: #05386B;
                        color: #EDF5E1;
                        margin-top: 30px;
                        height: 10em;
                        text-align: center;
                        font-family: 'Roboto', sans-serif;
                        display: flex;
                        justify-content: center;
                    }

                    footer a {
                        color: #EDF5E1;
                        padding: 12px;
                        text-decoration: none;
                        font-size: 14px;
                        border-radius: 30px;
                        border: 2px solid #05386B;
                        margin-top: 10px;
                        margin-bottom: 10px;
                        margin-left: auto;
                        margin-right: auto;
                        display: block;
                    }

                    footer a.logo {
                        font-size: 16px;
                        font-weight: bold;
                    }

                    footer a:hover {
                        color: #5CDB95;
                        border: 2px solid #92c7aa;
                    }

                    .footer {
                        font-family: 'Roboto', sans-serif;
                        text-align: center;
                        color: white;
                        background-color: black;
                        padding-top: 1px;
                        padding-bottom: 1px;
                    }

                    .reg_log{
                        border: 2px solid #EDF5E1;
                        margin-left: 10px;
                    }

                    .reg_log:hover{
                        border: 2px solid #5CDB95;
                        color: #5CDB95;
                    }

                    main th, td{
                        color: #EDF5E1;
                        text-decoration: none;
                        padding: 5px;
                        font-size: 18px;
                        text-align: center;
                        padding-top: 30px;
                        border-bottom: 2px solid #EDF5E1; /* Линия внизу ячейки */
                    }

                    .table{
                        margin: auto;
                        width: 90%;
                        margin-bottom: 30px;
                    }

                </style>
            </head>
            <body>
                <header>
                    <div class="wrap-logo">
                        <a href="index.html" class="logo">CollDevSearch</a>
                    </div>
                    <nav>
                        <nav>
                            <a href="index.html">Главная</a>
                            <a href="acount.html">Личный кабинет</a>
                            <a href="reg_adv.html">Подать объявление</a>
                            <a href="information.html">Информация</a>
                            <a class="reg_log" href="login.html">Войти</a>
                            <a class="reg_log" href="logout">Выйти</a>
                            <a class="reg_log" href="register.html">Регистрация</a>
                        </nav>
                    </nav>
                </header>
                <main>
                    <h2>Подходящие объявления</h2>
                    <table class="table">
                        <thead>
                        <tr class="tr">
                            <th>Автор</th>
                            <th>Название работы</th>
                            <th>Описание</th>
                            <th>Telegram</th>
                            <th>Необходимые навыки</th>
                            <th>Вознаграждение</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${result.map((user) => `
                            <tr class="tr">
                                <td>${user.name}</td>
                                <td>${user.project_name}</td>
                                <td>${user.descrip}</td>
                                <td>${user.telegram}</td>
                                <td>${user.tags}</td>
                                <td>${user.money}</td>
                            </tr>
                            `).join('')
                            }
                        </tbody>
                    </table>

                </main>
                <footer>
                    <div class="wrap-logo">
                        <a href="index.html" class="logo">CollDevSearch</a>
                    </div>
                    <table>
                        <td>
                        <th>
                            <a href="index.html">Главная</a>
                            <a href="acount.html">Личный кабинет</a>
                        </th>
                        <th>
                            <a href="reg_adv.html">Подать объявление</a>
                            <a href="information.html">Информация</a>
                        </th>
                        </td>
                    </table>
                </footer>
                <div class="footer">
                    <h5>Круглеков Дмитрий ПИ-б-0-192(1) 2023</h5>
                </div>
            </body>
            </html>
        `);
    });
});
});

app.post("/index.html", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.get("/register.html", function (request, response) {
    response.sendFile(__dirname + "/register.html");
});



app.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/');
            console.log(user);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/acount.html');
        });
    })(req, res, next);
});

app.post('/register', function (req, res) {
    let name = req.body.name;
    let password = req.body.password;
    let telegram = req.body.telegram;
    let course = req.body.course;
    let tags = req.body.tags;
    connection.query("SELECT * FROM users WHERE Telegram = '" + telegram + "'", function (err, response) {
        if (response.length < 1) {
            connection.query("INSERT INTO users (Name,Course,Telegram,Password) VALUES('" + 
            name + "','" + course + "','" + telegram + "','" + password + "')", 
            function (err, res) {
                if (err) console.log(err);
                else {
                    console.log(name)
                }
            });
            connection.query("INSERT INTO tags (Name,Tags) VALUES('" + telegram + "','" + tags + "')", function (err, res) {
                if (err) console.log(err);
                else {
                    console.log(name)
                }
            });
        }
        else {
            console.log('user registered!');
        }
    });
    return res.redirect('/')
});

app.get('/register', logout, (req, res) => res.sendFile(__dirname + '/register.html'))

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        return res.redirect('/');
    }
}

app.get("/register.html", function (request, response) {
    response.sendFile(__dirname + "/register.html");
});

app.get("/login.html", function (request, response) {
    response.sendFile(__dirname + "/login.html");
});

app.get("/information.html", function (request, response) {
    response.sendFile(__dirname + "/information.html");
});

app.get("/reg_adv.html", function (req, response) {
    if (req.user > 0) 
    {
    response.sendFile(__dirname + "/reg_adv.html");
    }
    else
    {
    response.sendFile(__dirname + "/login.html");
    };
});

app.get("/acount.html", (req, response) => {
    if(req.user > 0){
    connection.query("SELECT Name, Course, Telegram FROM users", function (err_1, result) {
        connection.query("SELECT Name, Tags FROM tags", function (err_2, result_2) {
        console.log(result);
        console.log(result_2);
        console.log(req.user);
        response.render("acount.ejs", { name: result[req.user - 1].Name, 
            course: result[req.user - 1].Course, telegram: result[req.user - 1].Telegram, tags: result_2[req.user - 1].Tags });
        });
    });
}
else
{
        response.sendFile(__dirname + "/login.html");
}
});


app.post("/login.html", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    console.log(request.body);
});

app.post("/register.html", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    console.log(request.body);
});

app.post("/reg_adv.html", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    console.log(request.body);
});


app.post("/reg_adv", urlencodedParser, function (req, response) {
    if (req.user > 0) {
    connection.query("SELECT Name, Course, Telegram FROM users", function (err_1, result) {
    let project_name = req.body.adv_name;
    let description = req.body.adv_desc;
    let tags = req.body.tags;
    let money = req.body.money;
        connection.query("INSERT INTO job (name,project_name,descrip,tags,telegram,money) VALUES('" + 
        result[req.user - 1].Name + "','" + project_name + "','" + description + "','" + 
        tags + "','" + result[req.user - 1].Telegram + "','" + money + "')", 
        function (err, res) {
            });
        });
        response.render("acount.ejs");
    }
    else
    {
        response.sendFile(__dirname + "/login.html");
    }
});

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));