var WebDriver = require('wd');
var Future = require('fibers/future');
var element = require('wd/lib/element'); 
var EventEmitter = require('events').EventEmitter; 
var Fiber = require('fibers'); 
var $ = require('./auQuery');
var css = 'css selector';

//Creates a brand new browser
var resolveName = function(item, name){
	if(item.resolveName){
		return item.resolveName(name); 
	} else {
		if(item[name] && typeof item[name] === 'function' ){
			return item[name]($);
		}
	}
	return item[name];
}; 

var isNone = function(x){
	if(typeof x === 'undefined' || x === null )
	{
		return true; 
	}
	return false; 
};

var WebDriver = function(driver){  
	var exclusions = []; 
	for(key in EventEmitter.prototype){
		exclusions.push(key);
	}
	var that = this; 
	
	var underlyingDriver = driver || WebDriver.remote(); 
	this.getDriver = function(){
		return underlyingDriver; 
	};

	// call fn without waiting if necessary
	this.noWait = function noWait(fn, timeout) {
		// just check, do not wait
		this.setImplicitWaitTimeout(timeout || 1);
		// execute without waiting
		var res;
		try {
			res = fn();
		} finally {
			// reset waiting for elements
			this.setImplicitWaitTimeout(this.implicitWaitTimeout || 1);
		}
		return res;
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
			if((typeof src[key]) === 'function' &&
				key !== 'toString' && 
				exclusions.indexOf(key) < 0){
				dest[key] = makeSync(src, src[key]);
			}
		}
	};
	makeSyncObject(underlyingDriver, this);
}; 

var Browser = function(ud){
	this.driver = new WebDriver(ud);
	this.$ = $; 
	this.wait = this.sleep = function(ms) {
		var future = new Future;
		setTimeout(function() {
			future.return();
		}, ms);
		return future.wait();
	};
	this.drive = function(fn, cb){
		var that = this;  
		var driveFn = function($, browser){
			Fiber.current.browser = that.driver; 
			return fn.call(browser, $, that.driver);
		}.future();
		driveFn($,this).resolve(cb);
	};

	//Manage the current page
	var currentPage = null; 
	
	this.page = function(){
		if(arguments.length === 0){
			return currentPage; 
		}
		if(arguments.length === 1){ 
			currentPage = new arguments[0]();
			this.__proto__ = currentPage; 
			return currentPage; 
		}
	};
	
	//Manage the current context
	var currentContext = null; 
	this.context = function(){
		if(arguments.length === 0){
			return currentContext;
		}
		if(arguments.length === 1){
			currentContext = arguments[0];
		}
	};
	this.by = css; 
	this.resolve = function(name){
		var typeName = typeof name;
		if( typeName === 'object'){
			return name; 
		}; 
		if( typeName === 'function'){
			return name(); 
		};
		if( typeName === 'string'){
			var retval = null; 
			if(currentContext){
				retval = resolveName(currentContext, name); 
			}
			if(!retval && currentPage){
				retval = resolveName(currentPage, name); 
			}
			if(retval){
				return retval; 
			} else {
				return $(name, null, this.by);
			}				
		}
	}; 
	
	this.type = function(obj){
		for(var key in obj){
			var elem = this.resolve(key);
			elem.type(obj[key]); 
		}
	};
	
	this.click = function(name){
		var item = this.resolve(name);
		var clickResult = item.click($, this.driver, this.page(), this.context());
		if(clickResult && typeof clickResult === 'function'){
			this.page(clickResult);  
		}
	};
	
	this.to = function(page){
		if(typeof page['to'] === 'function'){
			page.to(); 
		}
		if(typeof page['to'] === 'string'){
			this.driver.get(page.to); 
		}
		return this.page(page); 
	};
	
	this.on = function(context, f){
		var previousContext = this.currentContext; 
		try{
			this.context(this.resolve(context));
			f.apply(this); 
		}
		finally{
			this.context(previousContext);
		}
	};
};

module.exports = Browser;
