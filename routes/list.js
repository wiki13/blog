var express = require('express');
var router = express.Router();

/* GET lista artykułów */
router.get('/', function(req, res) {
  req.db.collection("article").find({}).toArray(function(err,articles){
    if(err){
      console.log(err);
    }else{
      var admin=false;
      if(req.session.user_id==1){
        admin=true;
      }
      if(req.query.category=="pasje_i_tworczosc"){
        req.db.collection("article").find({category: "pasje_i_tworczosc"}).toArray(function(err,tab){
          if(err){
            console.log(err);
          }else{
              if(req.session.user_id){
                res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles, "login":true, "category":1 ,"admin":admin });
              }else{
                res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles,"login":false, "category":1 ,"admin":admin });
              }
          }
        });
      }else{
        if(req.query.category=="kulinarne"){
          req.db.collection("article").find({category: "kulinarne"}).toArray(function(err,tab){
            if(err){
              console.log(err);
            }else{
              if(req.session.user_id){
                res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles, "login":true, "category":2 ,"admin":admin });
              }else{
                res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles,"login":false, "category":2 });
              }
            }
          });
        }else{
          if(req.query.category=="podroze"){
            req.db.collection("article").find({category: "podroze"}).toArray(function(err,tab){
              if(err){
                console.log(err);
              }else{
                if(req.session.user_id){
                  res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles, "login":true , "category":3 ,"admin":admin});
                }else{
                  res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles,"login":false, "category":3 });
                }
              }
            });
          }else {
            if(req.query.category=="inspiracje"){
              req.db.collection("article").find({category: "inspiracje"}).toArray(function(err,tab){
                if(err){
                  console.log(err);
                }else{
                  if(req.session.user_id){
                    res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles, "login":true, "category":4 ,"admin":admin });
                  }else{
                    res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles,"login":false, "category":4 });
                  }
                }
              });
            }else{
              if(req.query.category=="DIY"){
                req.db.collection("article").find({category: "DIY"}).toArray(function(err,tab){
                  if(err){
                    console.log(err);
                  }else{
                    if(req.session.user_id){
                      res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles, "login":true, "category":5 ,"admin":admin });
                    }else{
                      res.render('list', { "tab":tab, "title":"tytuł bloga", "articles":articles,"login":false, "category":5 });
                    }
                  }
                });
              }else{
                if(req.session.user_id){
                  res.render('list', { "tab":articles, "title":"tytuł bloga", "articles":articles, "login":true, "category":0 ,"admin":admin });
                }else{
                  res.render('list', { "tab":articles, "title":"tytuł bloga", "articles":articles,"login":false, "category":0 });
                }
              }
            }
          }
        }
      }
    }
  });
});

router.post('/', function(req,res){
    req.db.collection('user').find({},{},function(error,item){
      if(error){
        console.log(error);
      }else{
        item.toArray(function(err,tab){
          for(var i=0;i<tab.length;i++){
            if(req.body.login==tab[i].login&&req.body.password==tab[i].password){
              login=true;
              req.session.user_id=tab[i].id;
            }
          }
          res.redirect('list');
        });
      }
    });
});
module.exports = router;
