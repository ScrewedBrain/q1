// app/routes.js
module.exports = function(app, passport, connection) {

    var moment = require('moment');

	app.get('/', function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/orders');
		} else {
			res.redirect('/login');
		}

	});


	app.get('/login', function(req, res) {

		if (req.isAuthenticated()) {
			res.redirect('/orders');
		} else {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		}

		
	});


	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/orders', 
            failureRedirect : '/login',
            failureFlash : true 
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });


	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
		console.log(req.user);
	});


	app.get('/add', isLoggedIn, function(req, res) {
		res.render('add.ejs', {
			user : req.user // get the user out of session and pass to template
		});
		console.log(req.user);
	});


	app.get('/orders', isLoggedIn, function(req, res) {
		var users;
		var status;
		connection.query("SELECT * FROM users", function (err, result, fields) {
			if (err) throw err;
				users = result;
				connection.query("SELECT * FROM status", function (err, result, fields) {
					if (err) throw err;
						status = result;
							connection.query("SELECT * FROM clients INNER JOIN orders ON clients.id = orders.id", function (err, result, fields) {
											if (err) throw err;
											data = result;
											res.render('orders.ejs', {
												user : req.user,
												data : data,
												status : status,
												users : users,
												moment : moment
											});
	  						});
	  					});
	  		});

	});

    app.get('/orders', isLoggedIn, function(req, res) {
        var users;
        var status;
        connection.query("SELECT * FROM users", function (err, result, fields) {
            if (err) throw err;
                users = result;
                connection.query("SELECT * FROM status", function (err, result, fields) {
                    if (err) throw err;
                        status = result;
                            connection.query("SELECT * FROM clients INNER JOIN orders ON clients.id = orders.id", function (err, result, fields) {
                                            if (err) throw err;
                                            data = result;
                                            res.render('orders.ejs', {
                                                user : req.user,
                                                data : data,
                                                status : status,
                                                users : users,
                                                moment : moment
                                            });
                            });
                        });
            });

    });

    app.get('/goods', isLoggedIn, function(req, res) {
        connection.query("SELECT * FROM goods", function (err, result, fields) {
            if (err) throw err;
            res.render('goods.ejs', {
                user : req.user,
                data : result,
                moment : moment
            });

        });
    }); 


    app.post('/orders', isLoggedIn, function(req,res){
      var data = req.body;
      var id = req.user.id
      console.log(data);
      var sql = "INSERT INTO orders (user) VALUES (?)";
      connection.query(sql, [id], function (err, result, fields) {
        if (err) throw err;
        res.redirect('/');
      });
    })

    app.put('/orders/:id', isLoggedIn, function (req, res) {

      var id = req.params.id;
      var data = req.body;

      console.log(id);
      console.log(data);

      var sql = "UPDATE orders SET " + data.key + "=" + parseInt(data.value) + " WHERE id=" + id;

      connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      });
    });


    app.get('/logout', function(req, res) {
    		req.logout();
    		res.redirect('/');
    	});
    };


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

function isAdmin(req, res, next) {
    return 1;
}