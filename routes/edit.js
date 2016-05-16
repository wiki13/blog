
/* GET strona edycji artykułu */
var express = require('express');
var Busboy = require('busboy');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.query.id){
    if(req.session.user_id){
      req.db.collection("article").find({}).toArray(function(err,articles){
          var article="";
          for(var i = 0; i<articles.length;i++){
            if(articles[i].id==parseInt(req.query.id)){
              article=articles[i];
              break;
            }
          }

          res.render('add_edit',{"articles":articles, "title":"tytuł bloga", "article":article });
      });
    }else{
      res.redirect('list')
    }
  }else{
    res.redirect('list')
  }
});

router.post('/', function(req,res){
  var busboy = new Busboy({ headers: req.headers });
  var base64data="";
  var filetype="";
  var argum=[];

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      var buffer="";
      filetype=mimetype;
      file.setEncoding('base64');

      file.on('data', function (data) {
        buffer+=data;
      });
      file.on('end', function () {
        base64data=buffer;
      });
  });


  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
      argum.push(val);
  });

  busboy.on('finish', function () {
    req.db.collection("article").find({id: parseInt(req.query.id)}).toArray(function(err,tab){
      if(err){
        console.log(err);
      }else{
        if(argum[0]=="" || argum[0]==null){
          argum[0]=tab[0].text;
        }
        var texttab = argum[0].split(" ");
        var text="";
        for(var i=0; i<texttab.length; i++){
          if(i==15){
            break;
          }else{
            text=text+texttab[i]+" ";
          }
        }
        text=text+" ...";
        req.db.collection("article").update({id: parseInt(req.query.id)},
        {id:tab[0].id,text:argum[0], title: tab[0].title, author: tab[0].author, date: tab[0].date, category: tab[0].category, photo:base64data, shorttext:text},
        function(err,result){
          if(err){
            console.log(err);
          }else{
            res.redirect('list')
          }
        });
      }
    });
  });
  req.pipe(busboy);
});
module.exports = router;
