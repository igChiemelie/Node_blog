const express = require("express");
// const mysql = require("mysql");
const app = express();
const session = require('express-session')
const http = require("http").Server(app);
// const path = require('path');
const connection = require('./demo_create_db');
const formidable = require('formidable');
const bodyParser = require('body-parser');
const port = 8050;
app.use(express.static(__dirname + "/public"));

const mustacheExpress = require('mustache-express');
const { request } = require("http");
const { query } = require("express");

app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index Page Section
app.get('/', function (req, res) {

    if (req.session.loggedIn) {
        uName = req.session.username;
        login = req.session.loggedIn;
        // userType = req.session.userType = 'Admin';


    } else {
        uName = "";

    }
    let sql = "SELECT articles.*, articles.id AS artId, categories.*,  users.* FROM articles, categories, users WHERE categories.id = articles.catId AND users.id = articles.userId";
    // let sql = "SELECT articles.*, articles.id AS artId, categories.*,  users.* FROM articles, categories, users WHERE categories.id = articles.catId AND users.id = articles.id";
    // let sql = "SELECT * FROM users";
    connection.query(sql, (err, results) => {
        if (err) throw err;
        let dataRows = JSON.parse(JSON.stringify(results));
        // console.log(dataRows);
        let newDate = new Date().getFullYear();

       
        if (req.session.login) {
            //  && req.session.userType == 'Admin'
            let user = req.session.uName;
            let login = req.session.login = true;

            res.render('index', {
                user: user,
                login: login,
                dbRows: dataRows,
                newDate: newDate

            });
        }else{
            res.render('index', {
                // uName: uName,
                dbRows: dataRows,
                newDate: newDate
                // login: login
            });
        }
    });
   
});

// app.get('/', function (req, res) {
//     // get data from DB
//     let blogTitles = [
//         { name: 'Buhari Again' },
//         { name: 'Shai Willie' },
//         { name: 'Herdsmen' }
//     ];
//     if (req.session.login) {
//         let user = req.session.uName;
//         let login = req.session.login = true;

//         res.render('index', {
//             'titles': blogTitles,
//             user: user,
//             login: login
//         });
//     }else{

//         // res.render('index', {
//         //     'titles': blogTitles
//         // });
//     }

//     let sql = "SELECT articles.*, articles.id AS artId, categories.*,  users.* FROM articles, categories, users WHERE categories.id = articles.catId AND users.id = articles.userId";
//     // let sql = "SELECT articles.*, articles.id AS artId, categories.*,  users.* FROM articles, categories, users WHERE categories.id = articles.catId AND users.id = articles.id";
//     connection.query(sql, (err, results) => {
//         if (err) throw err;
//         let dataRows = JSON.parse(JSON.stringify(results));
//         // console.log(dataRows);
//         let newDate = new Date().getFullYear();

//         res.render('index', {
//             // uName: uName,
//             dbRows: dataRows,
//             newDate: newDate
//         });
//     });
    
// });

// Single Article Post Section 
app.post('/singleArticlePost', (req, res) => {
    if (req.session.login) {
        user = req.session.uName;
        login = req.session.login = true;

    } else {
        user = "";

    }

    req.session.artId = req.body.artId;
    let artId = req.session.artId;
    // console.log(artId);
    let sql = `SELECT * FROM articles WHERE id = ${artId}`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        let dataRows = JSON.parse(JSON.stringify(results));
        // console.log(dataRows);

        res.render('singleArticle', {
            user: user,
            dbRows: dataRows
        });
    });
});

// Single Article Get Section
app.get('/singleArticleRead', (req, res) => {
    let artId = req.session.artId;
    let sql = `SELECT articles.*, categories.category, CONCAT(users.fName," ",users.lName) AS names FROM articles, categories, users WHERE articles.id = ${artId} AND articles.catId = categories.id AND articles.userId = users.id`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        let dataRows = JSON.parse(JSON.stringify(results));
        // console.log(dataRows);

        res.render('singleArticle', {
            user: user,
            dbRows: dataRows
        });
    });
});

app.get('/gateway', function (req, res) {
    // console.log(req.session.login);
    if (req.session.login == undefined) {
        res.render('gateway');
    } else {
        res.redirect('/');
    }
});

//LOGIN
app.post('/loginController', (request, res) => {
    var uName = request.body.uName;
    var password = request.body.password;
    // console.log(uName);
    // console.log(password);
    loginOperations(uName, password, res, request);

});

let loginOperations = (uName, password, res, request) => {
    // console.log(uName);
    if (uName && password) {
        connection.query('SELECT * FROM users WHERE uName = ? AND password = ?', [uName, password], function (error, results, fields) {

            if (results.length > 0) {
                // console.log(typeof(results));z
                let userRow = JSON.parse(JSON.stringify(results[0]));
                console.log(userRow);
                let login = request.session.login = true;
                // console.log(login);
                let user = request.session.uName = userRow.uName;
                // console.log(user);
                
                let userType = request.session.userType = userRow.userType;
                console.log(userType);
               
                // let userId2 = request.session.id;
                // console.log(userId2);
                let userId = request.session.userId = userRow.id;
                // console.log(userId);
                //    console.log(request.session);
                // let login = request.session.Auth ={
                //     user: logUser
                // }
               
                // res.render('dashboard', {
                //     uniqueId
                //     // login
                // });
                res.redirect('/dashboard');
            } else {
                res.render('gateway', {
                    message: 'Invalid Username/Password',
                    msgType: 'danger'
                });
            }
            // console.log("LOGGED IN AS: " + logUser.username); 
        });
    }
    // else {
    //     res.send('Please enter Username and Password!');
    //     res.end();
    // }
}

// SIGNUP
app.post('/signUpController', (request, res) => {
    var fName = request.body.fName;
    var lName = request.body.lName;
    var uName = request.body.uName;
    var email = request.body.email;
    var password = request.body.password;
    // console.log(password);
    var cpassword = request.body.cpassword;
    // console.log(cpassword);
    var telephone = request.body.telephone;
    var dob = request.body.dob;
    var addr = request.body.addr;
    var textarea1 = request.body.textarea1;
    var state = request.body.state;
    var gender = request.body.gender;
    // var checkbox = request.body.collect;
    // let collectArr = JSON.parse(JSON.stringify(collect));

    // console.log(collectArr);
    for (var collect in request.body.collect) {
        if(request.body.collect){
            items = request.body.collect;
            collect = JSON.stringify(items).replace(/]|[[]|"/g, '',);

            console.log(items);
        }
        console.log(collect);

    }
    console.log(fName, lName, uName, email, password, cpassword, telephone, dob, addr, textarea1, state, gender, collect);
    console.log(collect);
    // console.log(logUser);
    // signUpOperations(fName, lName, uName, email, password, cpassword, telephone, dob, addr, textarea1, state, gender,  res);

    if (password !== cpassword) {
        // err = 1;
        // res.send('unique password for the password and confirm password input-field');
        res.render('gateway', {
            message: 'Your Passwords does not match.',
            msgType: 'danger',
        });
        res.end();
    } else {
        connection.connect(function (err) {

            if (err) throw err;
            // console.log("Connected!");
            var sql = "INSERT INTO users (fName,lName,uName,email,password,cpassword,telephone,dob,addr,textarea1,state,gender,collect) VALUES ?";
            var values = [
                [fName, lName, uName, email, password, cpassword, telephone, dob, addr, textarea1, state, gender, collect],
            ];
            connection.query(sql, [values], function (err, results) {
                if (err) throw err;
                // console.log("Query runned!");


                let userRow = JSON.parse(JSON.stringify(results));
                // let userRow2 = JSON.parse(JSON.stringify(results[0]));

                // console.log(userRow2);
                let login = request.session.login = true;
                // console.log(login);
                let user = request.session.uName = uName;
                let userId = request.session.userId = userRow.insertId;

                console.log(user);
                console.log(userRow);
                console.log(userId);
                // res.render('dashboard', {
                //     user,
                //     login
                // });

                res.redirect('/dashboard');
                console.log("Number of records inserted: " + results.affectedRows);
            });
        });
    }
});

app.get('/dashboard', function (req, res) {
    if (req.session.login) {
        let userType = req.session.userType == 'Admin';
        // console.log(userType);
        let user = req.session.uName;
        // console.log(user);
        let login = req.session.login = true;
        let userId = req.session.userId;
        console.log(userId);
       

        // res.render('dashboard', { user: user, login: login });

        let sql = "SELECT * FROM categories";
        let query = connection.query(sql, (err, results) => {
            if(err) throw err;
            let catRow = JSON.parse(JSON.stringify(results));

            let sql2 = `SELECT * FROM users WHERE users.id = ${userId}`;

            connection.query(sql2, (err, results) => {
                if (err) throw err;
                // console.log(results);
                let userRow = JSON.parse(JSON.stringify(results));

                // let sql3 = `SELECT * FROM articles WHERE articles.userId = ${userId}`;
                let sql3 = `SELECT articles.id, articles.title, articles.post, articles.catId, articles.datePosted, categories.id AS artCatId, categories.category AS cate FROM categories, articles WHERE articles.catId = categories.id AND articles.userId = ${userId}`;

                connection.query(sql3, (err, results)=>{
                    if (err) throw err;
                    // console.log(results);
                    let articleRow = JSON.parse(JSON.stringify(results));
                    var sn = 0;
                    sn++;
                    var i = 0;
                    i++;
                    res.render('dashboard', {
                        login: login,
                        user: user,
                        cat: catRow,
                        userDetails: userRow,
                        art: articleRow,
                        userType: userType,
                        sn: function () {
                            return sn++;
                        },
                        i: function () {
                            return i++;
                        }
                    });
                });
                
            });
        });

    } else {
        res.redirect('/gateway');

    }

});

// Create Category Section
app.post('/category', (req, res)=>{
    let catName = req.body.catName;
    let post = { category: catName };
    let sql = "INSERT INTO categories SET ?";
    connection.query(sql, post, (err, results) => {
        if (err) throw err;
        // console.log(results);
        res.redirect('dashboard');
    });
});

// Category Edit Section
app.post('/editCategory', (req, res) => {
    let catInput = req.body.editCatInput;
    let catInputId = req.body.editCatInputId;
    let sql = `UPDATE categories SET category = '${catInput}' WHERE id = ${catInputId}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(result);
        res.redirect('dashboard');
    });
});

// Category Delete Section
app.post('/deleteCategory', (req, res) => {
    let delCatId = req.body.delCatId;
    let sql = `DELETE FROM categories WHERE id = ${delCatId}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.redirect('dashboard');
    });
});

// Article Insert Section
app.post('/article', (req, res) => {
    console.log(req.body);
   

    // var form = new formidable.IncomingForm();
    // form.parse(req);

    new formidable.IncomingForm().parse(req)

    .on('fileBegin', (name, file) => {
        // console.log('here1');
        file.path = 'public/media/img/' + file.name
    })
    .on('file', (name, file) => {
        let articleImg = file.name;
        // console.log(articleImg);
        console.log('uploaded file' + file.name);

    })
    .on('aborted', () => {
        console.error('Request aborted by the user');
    })
    .on('error', (err) => {
        console.error('Error', err);
        throw err;
    })
    // .on('end', () => {

       
      
    // });
    
    let artTitle = req.body.artTitle;
    let artCat = req.body.artCat;
    let textarea1 = req.body.textarea1;
    let imgName = req.body.imgName;
    let userId = req.session.userId;




    let post = { title: artTitle, post: textarea1, catId: artCat, userId: userId, articleImg: imgName };
    // console.log(post);
    let sql = 'INSERT INTO articles SET ?';
    connection.query(sql, post, (err, results) => {
        // if (err) throw err;
        // if (err) {
        //     console.[-og('error');
        // }
        console.log(results);

        res.redirect('dashboard');

    })
   

    
    // res.send('uploaded...');
});

// Article Edit Section
app.post('/editArticle', (req, res) => {
    let userId = req.session.userId;

    let editArtTitle = req.body.editArtTitle;
    let editArtCat = req.body.editArtCat;
    let editArtText = req.body.editArtText;
    let artCatId = req.body.artCatId;
    let sql = `UPDATE articles SET title = '${editArtTitle}', post = '${editArtText}', catId = ${editArtCat} WHERE id = ${artCatId} AND articles.userId = ${userId}`;
    connection.query(sql, (err, results) => {
        if (err) throw err;
        // console.log(results);
        res.redirect('dashboard');
    });
});

// Delete Article Section
app.post('/deleteArticle', (req, res) => {
    let delArtId = req.body.delArtId;
    let sql = `DELETE FROM articles WHERE id = ${delArtId}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.redirect('dashboard');
    });
});

// User's Edit section
app.post('/editUser', (req, res) => {
    let editUserId = req.body.editUserId;
    let editUserFname = req.body.editUserFname;
    let editUserLname = req.body.editUserLname;
    let editUserUname = req.body.editUserUname;
    let editUseremail = req.body.email;
    let editUserDob = req.body.dob;

    let sql = `UPDATE users SET fName = '${editUserFname}', lName = '${editUserLname}', uName = '${editUserUname}' ,email = '${editUseremail}', dob = '${editUserDob}' WHERE id = ${editUserId}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(result);
        res.redirect('dashboard');
    });
});


app.get('/contact', function (req, res) {
    let user = req.session.username;
    res.render('contact', { user: user });
    // res.render('contact');
});

// LOGOUT SESSION 
app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) throw err;
        // let user = req.session.username;  
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});

//Date
let newDate = new Date();
console.log(newDate);


http.listen(port, () => {
    console.log("Running on Port: " + port);
});