var lib = require('auQuery');
var wd = require('wd'); 
var assert = require('assert'); 
var Browser = lib.browser; 
var AuQuery = lib.auQuery; 

var webDriver = wd.remote(); 

var browser = new Browser(webDriver); 

browser.drive(function($, browser){
	browser.init(); 
	browser.get('http://www.google.com'); 
	$('input[name=q]').type('Hello World'); 
	console.log( browser.title() ); 
	browser.quit();
}
, function(err, res){
	if(err){
		console.log(err); 
	}
});