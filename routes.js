module.exports = function(app, passport, db, ObjectId) {

  // pages ===============================================================
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    var listings = db.collection('listings').find().toArray((err, result) => {
      if (err) return console.log(err)
      console.log("listings", result)
      return result
    })
    var bids = db.collection('bids').find({user: req.user.email}).toArray((err, result) => {
      if (err) return console.log(err)
      console.log("bids", result)
      return
    })
    res.render('profile.ejs', {
      user : req.user,
      listings: listings,
      bids: bids
    })
  });

  app.get('/listing/:listing', isLoggedIn, function(req, res) {
    var listingId = ObjectId(req.params.listing)
    var listing = db.collection('listings').findOne({_id: listingId}).toArray((err, result) => {
      if (err) return console.log(err)
      return result
    })
    var bids = db.collection('bids').find({listingId: listingId}).toArray((err, result) => {
      if (err) return console.log(err)
      return result
    })
    res.render('profile.ejs', {
      user : req.user,
      listing: listing,
      bids: bids
    })
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // api ===============================================================

  // app.post('/api/bids', (req, res) => {
  //   db.collection('bids').save({amount: req.body.amount, user: req.body.user, listingId: ObjectId(req.body.listingId) }, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //   }), {
  //     sort: {amount: -1}
  //   }
  // })

  //rewrite
  app.post('/api/bids', (req, res) => {
    var listingId = ObjectId(req.params.listing)
    db.collection('users').save({listings[req.body.listingId: [req.body.amount]] , amount: req.body.amount, user: req.body.user}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/listing')

    })

  })

  app.put('/api/bids', (req, res) => {
    db.collection('users').findOneAndUpdate({_id: ObjectId(req.body._id)}, {
      $set: {
        listings[req.body.listingId: [req.body.amount]]
      }
    }, {
      sort: {amount: -1}
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  // app.put('/api/bids', (req, res) => {
  //   db.collection('bids').findOneAndUpdate({_id: ObjectId(req.body._id)}, {
  //     $set: {
  //       amount: req.body.amount
  //     }
  //   }, {
  //     sort: {amount: -1}
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  app.delete('/api/bids', (req, res) => {
    db.collection('bids').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
      if (err) return res.send(500, err)
    })
  })

  // =============================================================================
  // login/signup ================================================================
  // =============================================================================

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });
  const passportConfig = {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }
  app.post('/login', passport.authenticate('local-login', passportConfig));

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
