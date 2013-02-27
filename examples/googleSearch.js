var lib = require('auQuery');
var wd = require('wd'); 
var assert = require('assert'); 
var Browser = lib.browser; 
var AuQuery = lib.auQuery; 

var webDriver = wd.remote(); 

var browser = new Browser(webDriver); 

browser.drive(function($){
	this.init(); 
	this.get('http://www.google.com'); 
	$('input[name=q]').type('Hello World'); 
	console.log( this.title() ); 
	this.quit();
}
, function(err, res){
	if(err){
		console.log(err); 
	}
});