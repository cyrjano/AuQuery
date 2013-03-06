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
}; 

var BrowserProto =  function(){
	this.sleep = function(ms) {
		var future = new Future;
		setTimeout(function() {
			future.return();
		}, ms);
		return future.wait();
	};
	this.drive = function(fn, cb){
		var that = this;  
		var driveFn = function($, browser){
			Fiber.current.browser = that; 
			return fn.call(browser, $, browser);
		}.future();
		driveFn($,this).resolve(cb); 
	};
	var currentPage = null; 
	
	this.page = function(){
		if(arguments.length === 0){
			return currentPage; 
		}
		if(arguments.length === 1){ 
			currentPage = new arguments[0]();
			protoParent.__proto__ = currentPage; 
			return currentPage; 
		}
	};
	
	this.resolveName = function(name){
		var typeName = typeof name;
		if( typeName === 'object'){
			return name; 
		}; 
		if( typeName === 'function'){
			 
			return name(); 
		};
		if( typeName === 'string'){
			if(currentPage){
				if(typeof currentPage[name] !== 'undefined'){
					if(typeof this[name] === 'function'){
						return this[name](); 
					}
					return this[name];
				}
			}
			return $(name); 
		}
	}; 
	this.type = function(obj){
		for(var key in obj){
			var elem = this.resolveName(key);
			elem.type(obj[key]); 
		}
	};
	this.click = function(name){
		var item = this.resolveName(name);
		var clickResult = new item.click();
		if(clickResult && typeof clickResult === 'function'){
			clickResult; 
		}
		return this.page(clickResult); 
	};
	
	this.to = function(page){
		if(typeof page['to'] === 'function'){
			page.to(); 
		}
		if(typeof page['to'] === 'string'){
			this.get(page.to); 
		}
		return this.page(page); 
	};
};
var protoParent = new BrowserProto();
Browser.prototype =  protoParent;
module.exports = Browser; 