var express = require('express');
var router = express.Router();
var fs=require('fs');

//var fd=fs.openSync('/file/index.txt','r');
var arr=[];
var data=fs.readFile('index.txt','utf8',function(err,buffer){

    console.log(buffer);

});
console.log(data);