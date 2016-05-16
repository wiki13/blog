var express = require('express');
var router = express.Router();

/* GET pokazuje dany artykuł */
router.get('/', function(req, res) {
  if(req.query.id){
    req.db.collection("article").find({}).toArray(function(err,articles){
      req.db.collection("article").find({id: parseInt(req.query.id)}).toArray(function(err,tab){
        if(err){
          console.log(err);
        }else{
          req.db.collection("user").find({id:tab[0].author}).toArray(function(err,tab2){
            if(err){
              console.log(err);
            }else{
              if(req.session.user_id){
                var admin=false;
                if(req.session.user_id==1){
                  admin=true;
                }
                res.render('show', {"title":"tytuł bloga", "art": tab[0] , "nick": tab2[0].nick, "articles":articles, "login": true, "admin":admin});
              }else {
                res.render('show', {"title":"tytuł bloga", "art": tab[0] , "nick": tab2[0].nick, "articles":articles, "login": false});
              }
            }
          })
        }
      });
    });
  }else{
    res.redirect('list');
  }
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
          res.redirect('show?id='+req.query.id);
        });
      }
    });
});

module.exports = router;
