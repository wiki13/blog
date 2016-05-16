var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('list')
});

router.get('/logout', function(req,res){
  req.session =null;
  res.redirect('list');
});

router.get('/remove', function(req,res){
  if(req.session.user_id){
    if(req.query.id){
      req.db.collection('article').remove({id:parseInt(req.query.id)},function(err,result){
        if(err){
          console.log(err);
        }else{
          res.redirect('list');
        }
      });
    }else{
      res.redirect('list')
    }
  }else{
    res.redirect('list');
  }
});


router.get('/newuser', function(req,res){
    if(req.session.user_id==1){
      req.db.collection("article").find({}).toArray(function(err,articles){
          res.render('newuser',{"articles":articles, "title":"tytuł bloga", "login":true, "admin":true});
      });
    }else{
      res.redirect('list');
    }
});

router.post('/newuser', function(req,res){
  if(req.session.user_id==1){
    req.db.collection('user').find({},{},function(error,item){
      if(error){
        console.log(error);
      }else{
        var login = false;
        item.toArray(function(err,tab){
          for(var i=0;i<tab.length;i++){
            if(req.body.login==tab[i].login||req.body.nick==tab[i].nick){
              login=true;
            }
          }
          if(login){
            res.redirect('list');
          }else{
            req.db.collection('user').insert({id:(tab.length+1), login: req.body.login, password: req.body.password, nick: req.body.nick},
            function(err,result){
              if(err){
                console.log(err);
              }else{
                res.redirect('list')
              }
            });
          }
        });
      }
    });
  }else{
    res.redirect('list')
  }
});

module.exports = router;
