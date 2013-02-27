var WebDriver = require('wd');
var Future = require('fibers/future');
var element = require('wd/lib/element'); 
var EventEmitter = require('events').EventEmitter; 
var Fiber = require('fibers'); 
var $ = require('./auQuery');
//Creates a brand new browser

function Browser(driver){  
	var exclusions = []; 
	for(key in EventEmitter.prototype){
		exclusions.push(key);
	}
	var that = this; 
	
	var underlyingDriver = driver || WebDriver.remote(); 
	this.getDriver = function(){
		return underlyingDriver; 
	};
	
	var syncIfElement = function(res){
		if(typeof res === 'object' && !!res.sendKeys){
			var newRes = {}; 
			makeSyncObject(res, newRes); 
			return newRes; 
		}
		return res; 
	};
	
	var makeSync = function(elem, fn){
        var idx = fn.length > 0 ? fn.length -1:0; 
		return function(){
			var args = Array.prototype.slice.call(arguments);
			var future = new Future; 
			args.push(future.resolver()); 
			fn.apply(elem, args);
			var res = future.wait();
			if(Object.prototype.toString.call( res ) === '[object Array]'){
				for(var index = 0; index < res.length; index++){
					res[index] = syncIfElement( res[index]); 
				}
			} else {
				res = syncIfElement(res); 
			}
			return res; 
		};
	};
	
	var makeSyncObject = function(src, dest){
		for(key in src){
			if((typeof src[key]) === 'function' && key !== 'toString' && exclusions.indexOf(key) < 0){
				dest[key] = makeSync(src, src[key]);
			}
		}
	};
	
	makeSyncObject(underlyingDriver, this);
	
	//Miscelaneaus functions
	this.on = function(proto){
		that.__proto__.__proto__ = proto; 
		console.log(({}).toString.call(that)); 
	};
	
	this.sleep = function(ms) {
		var future = new Future;
		setTimeout(function() {
			future.return();
		}, ms);
		return future.wait();
	};
}; 

//Method to run sync tests
Browser.prototype.drive = function(fn, cb){
	var that = this;  
	var driveFn = function($, browser){
		Fiber.current.browser = that; 
		return fn.call(browser, $, browser);
	}.future();
	driveFn($,this).resolve(cb); 
}

module.exports = Browser; 