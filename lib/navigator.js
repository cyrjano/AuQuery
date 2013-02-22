var Fiber = require('fibers'); 

//Class that works as a navigator 
var Navigator = function(elements){
	var that = this; 
	this.elements = elements;
	
	//Actions
	this.find = function(selector){
		var resultSet = []; 
		that.each(function() {
						resultSet = resultSet.concat(this.elements('css selector', selector));
					});  
		return new Navigator(resultSet); 
	};
	
	this.type = function(text){
		that.each(function(){ this.type(text);});
		return that; 
	};
	
	this.clear = function(){
		that.each(function(){this.clear();});
		return that; 
	};
	
	this.click = function() {
		that.first().each(function() {this.click();});
		return that; 
	};
	
	this.css = function(property){
		return that.element[0].getComputedCss(); 
	};
	
	this.attr = function(){
		return that.elements[0].getAttribute(att);
	};
	
	this.val = function(){
		return that.elements[0].getAttribute('value');
	};
	
	this.text = function(){
		return that.elements[0].text(); 
	};
	
	this.tag = function(){
		return that.elements[0].getTagName(); 
	};
	
	this.classes = function(){
		 var classes = that.getAttribute('class') || ''; 
		 return classes.split(' ');
	};
	
	this.hasClass = function(clazz){
		for(var className in classes){
			if(className === clazz){
				return true; 
			}			
		}
		return false; 
	};
	
	this.is = function(tag){
		return that.tag() === tag; 
	};
	
	//Filtering 
	this.first = function(){
		return new Navigatable([that.elements[0]]); 
	};
	
	this.last = function(){
		return new Navigatable([that.elements[that.elements.length - 1]]); 
	};
	
	this.get = function(index){
		return that.elements[index]; 
	};
	
	this.size = function(){
		return that.elements.length; 
	};
	
	this.toArray = function(){
		return Array.prototype.slice.call(arguments, 0);
	}
	
	//Collection Management
	this.each = function(fn){
		for(var index = 0; index < that.elements.length; index++){
			fn.call(that.elements[index], index); 
		}
	};
	
	//Aliases
	this.sendKeys = this.type;
	this.getAttribute = this.attr;
	this.getValue = this.val; 
	this.head = this.first; 
	this.tail = this.last; 
	this.$ = Navigatable; 
};

//JQuery like structure 
function Navigatable(){
	var args = Array.prototype.slice.call(arguments, 0); 
	//If single arguments
	if(args.length === 1 )
	{	
		if((typeof args[0]) === 'string'){
			var browser = Fiber.current.browser;
			var elements = browser.elements('css selector', args[0]);
			return new Navigator(elements); 
		}
		else {
			return new Navigator(args[0]); 
		}
	}
}

module.exports = {
	'Navigator' :  Navigator,
	'Navigatable' : Navigatable
}