var express = require('express');
var Busboy = require('busboy');
var router = express.Router();

/* GET strona dodania artykułu */
router.get('/', function(req, res) {
  if(req.session.user_id){
    var admin = false;
    if(req.session.user_id){
      admin=true;
    }
    req.db.collection("article").find({}).toArray(function(err,articles){
        res.render('add_edit',{"articles":articles, "title":"tytuł bloga", "login":true, "admin":admin});
    });
  }else{
    res.redirect('list');
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
      if(val!=""){ argum.push(val);}
  });

  busboy.on('finish', function () {
    req.db.collection("article").find({}).sort({id:-1}).limit(1).toArray(function(err,lastart){
      if(err){
        console.log(err);
      }else{
        var count= lastart[0].id;
        count++;
        var datenow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var texttab = argum[2].split(" ");
        var text="";
        for(var i=0; i<texttab.length; i++){
          if(i==15){
            break;
          }else{
            text=text+texttab[i]+" ";
          }
        }
        text=text+" ...";
        req.db.collection("article").insert({id:count,text:argum[2], title: argum[0], author:req.session.user_id, date: datenow, category: argum[1], photo:base64data, shorttext:text},
        {w:1}, function(err,result){
          if(err){
            console.log(err);
          }else{
            res.redirect("list");
          }
        });
      }
    });
  });
  req.pipe(busboy);
});
module.exports = router;
