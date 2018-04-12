var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

app.get('/', function(req, res, next) {
  res.render('signup');
});
app.post('/',function(req,res){
  var film={name:'',actor:[],director:'',producer:'',abstract:'Movie Not Found'};

    editor(req);
  querybuilder(req,res,film);
  
});
app.post('/submit',function(req,res){
  var film={name:'',actor:[],director:'',producer:'',abstract:'Movie Not Found'};
queryfilmbyname(req.body.param1,res,film);
})
function querybuilder(req,res,film){
  const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;

if(req.body.Movie!=''){
queryfilmbyname(req.body.Movie,res,film);

}
else{
  var build='';
  if(req.body.Actor1){
    build=build+' ?film dbO:starring dbpedia:' +req.body.Actor1+  ' .'
  }
  if(req.body.Actor2){
    build=build+' ?film dbO:starring dbpedia:'+req.body.Actor2 + ' .'
  }
  if(req.body.Actress1){
    build=build+' ?film dbO:starring dbpedia:'+req.body.Actress1+' .'
  }
  if(req.body.Director){
    build=build+' ?film dbO:director dbpedia:'+req.body.Director+' .'
  }
   build='PREFIX dbO: <http://dbpedia.org/ontology/> PREFIX dbpedia: <http://dbpedia.org/resource/> SELECT ?film WHERE{ '+build+'}';
 
queryfilmbyperson(build,res,film);
}
};

function editor(req){
  
  if(req.body.Actor1!=''){
  req.body.Actor1=change(req.body.Actor1);
    }
    if(req.body.Actor2!=''){
  req.body.Actor2=change(req.body.Actor2);
    }
    if(req.body.Actress1!=''){
  req.body.Actress1=change(req.body.Actress1);
    }
    if(req.body.Director!=''){
  req.body.Director=change(req.body.Director);
    }
    
  if(req.body.Movie!=''){
  req.body.Movie=change(req.body.Movie);
    }
    }
function change(value){
  var str='';
    var arr=value.split(" ");
    for(var i in arr){
      var code=arr[i].charCodeAt(0);
      
      if(code>96&&code<123){
code=code-32;
      }
      var rep=String.fromCharCode(code);
      console.log(code);
      arr[i]=arr[i].replaceAt(0,rep);
      if(i!=arr.length-1){
        str=str+arr[i]+"_";
        
      }else{
        str=str+arr[i];
        return str;
      }
    }
  
}
function queryfilmbyname(name,res,film){
  
  var resource='<http://dbpedia.org/resource/'+name+'>';
  console.log(resource);
var starring='SELECT DISTINCT ?starring WHERE{' +resource+ ' dbo:starring ?starring }';
var director='SELECT DISTINCT ?director WHERE{' +resource+ ' dbo:director ?director }';
var producer='SELECT DISTINCT ?producer WHERE{' +resource+ ' dbo:producer ?producer }';
var abstract='SELECT DISTINCT ?abstract WHERE{' +resource+ ' dbo:abstract ?abstract }';
 queryexecuter(starring,film,function(res,film){
   for( i in res){
film.actor[i]=res[i].starring.value.substring(28,res[i].starring.value.length);
console.log(film.actor[i]);
}
 });
 queryexecuter(director,film,function(res,film){
   for( i in res){
film.director=res[i].director.value.substring(28,res[i].director.value.length);
console.log(film.director);
}
 });
 queryexecuter(producer,film,function(res,film){
   for( i in res){
film.producer=res[i].producer.value.substring(28,res[i].producer.value.length);
console.log(film.producer);
}});
 queryexecuter(abstract,film,function(res,film){
   
   for( i in res){
     if(res[i].abstract['xml:lang']=='en'){
film.abstract=res[i].abstract.value;}

}
console.log(film.abstract);
film.name=name;


 });
setTimeout(function () {
  res.render('finalpage',{filmdata:film});
}, 1000);
}
function queryfilmbyperson(query,res,film){
queryexecuter(query,film,function(res1,film){
  var filmdata=[];
  for(var i=0;i<res1.length;i++){
    filmdata[i]=res1[i].film.value.substring(28,res1[i].film.value.length);
  }
  res.render('films',{films:filmdata});
})

}
function queryexecuter(query,film,callback){
  
  const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const endpoint = 'http://dbpedia.org/sparql';
const client = new SparqlClient(endpoint)
  .register({dbo: 'http://dbpedia.org/ontology/'})
 .register({dbpedia: 'http://dbpedia.org/resource/'}).register({dbpedia: 'http://www.w3.org/2000/01/rdf-schema#'});
 //var query1='SELECT DISTINCT ?starring WHERE{ <http://dbpedia.org/resource/Mujhse_Shaadi_Karogi> dbo:starring ?starring }';
 var finaldata='';

 client.query(query)
  .execute()
  .then(function (results) {
   // console.log(results);
   //console.dir(results.results.bindings, {depth: null});
   finaldata= results.results.bindings;
   return callback(finaldata,film);
   //console.log(finaldata);
  })
  .catch(function (error) {
    console.log(error);
  }); 
  




}
  module.exports = app;
app.listen('500');