var Fiber = require('fibers'); 
var nodeExtend = require('node.extend'); 
var css = 'css selector';
var core_concat = Array.prototype.concat;
var core_push = Array.prototype.push;
var core_slice = Array.prototype.slice;
var core_toString = Object.prototype.toString;

function isString(obj){
	return core_toString.call(obj) === '[object String]';
}

function isArrayLike( obj ) {
	var length = obj.length;
	return Array.isArray(obj) || typeof obj !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

var auQuery = function(selector, context, by){
	var browser = (!!Fiber.current)? Fiber.current.browser : null;
	return new auQuery.fn.init(selector, context, by, browser);
}; 

auQuery.fn = auQuery.prototype = {
	auquery: '0.2.4',
	constructor: auQuery, 
	
	init: function(selector, context, by,  browser){
			var realContext = context || browser; 
			var byType = by || css; 

			// keep the 'by' in the auQuery instance itself for extensibility
			this.by = byType;

			if(!selector){
				return this; 
			}
			if((typeof selector) === 'string'){
				this.selector = selector;
				return auQuery.merge(this, realContext.elements( byType, selector)); 
			}
			if(isArrayLike(selector)){
				return auQuery.merge(this, selector);
			}
			this[0] = selector;
			this.length = 1;
	},
	
	// Start with an empty selector	
	selector: "",	
	// The default length of a auQuery object is 0	
	length: 0,	
	// The number of elements contained in the matched element set	
	size: function() {
		return this.length;	
	},	
	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num === null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},
	
	toArray: function() {
		return core_slice.call( this );	
	},
	
	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return auQuery.each( this, callback, args );
	},
	
	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},
	
	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new auQuery matched element set
		var ret = auQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},
	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a auQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice, 
};
// Give the init function the auQuery prototype for later instantiation
auQuery.fn.init.prototype = auQuery.fn;

auQuery.extend = auQuery.fn.extend = function(args){
	nodeExtend(this,args);  
}; 

auQuery.extend({
	merge: function( first, second ) {
		var l = second.length,			
		i = first.length,			
		j = 0;		
		if ( typeof l === "number" ) {			
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}		
		} else {			
			while ( second[j] !== undefined ) {				
				first[ i++ ] = second[ j++ ];
			}		
		}		
		first.length = i;
		return first;	
	},
	each: function(obj, callback) {
		for (var i = 0 ; i < obj.length; i++ ) {
			var value = callback.call( obj[ i ], i, obj[ i ] );
			if ( value === false ) {
				break;					
			}				
		}
	},
	// static $.exists('body') - reuses fn.exists() implementation
	exists: function existsStatic(selector, context, by) {
		return auQuery.fn
				.exists.call({ context: context || browser }, selector, by);
	}
});

//Selenium Related Methods
auQuery.fn.extend( {
	find: function(selector, by){
		var result = []; 
		var byType = by || css; 
		for(var i = 0, l = this.length; i < l; i++) {
			result = result.concat(this[i].elements(byType, selector));
		}
		var res = this.pushStack(result);
		res.selector = selector;
		res.by = byType;
		return res;
	},
	// Checks an element for existence, without waiting for it to appear
	// e.g. $('html').exists('body')
	exists: function exists(selector, by) {
		var context = this.context || browser;
		return browser.noWait(function() {
			return selector && !!context.elementIfExists(by, selector);
		});
	},
	type: function(text){
		this.each(function() { this.type(text);});
		return this; 
	},
	clear:function(){
		this.each(function(){this.clear();});
		return this; 
	},
	click:function() {
		this.first().each(function() {this.click();});
		return this; 
	},
	css:function(property){
		return this[0].getComputedCss(property); 
	},
	attr:function(attr){
		return this[0].getAttribute(attr); 
	},
	val:function(){
		return this.attr('value');
	},
	text:function(){
		return this[0].text(); 
	},
	tag:function(){
		return this[0].getTagName(); 
	},
	classes:function(){
		var classes = this.attr('class') || ''; 
		return classes.split(' ');
	},
	hasClass:function(clazz){
		var classes = this.classes();
		for(var i = 0; i < classes.length; i++ ){
			var className = classes[i]; 
			if(className === clazz){
				return true; 
			}			
		}
		return false; 
	},
	is:function(tag){
		return this.tag() == tag;
	}
});

//Aliases
auQuery.fn.extend( {
	sendKeys:auQuery.fn.type, 
	getAttribute:auQuery.fn.attr, 
	getValue:auQuery.fn.val,
	head:auQuery.fn.first,
	tail:auQuery.fn.last
});

//Context method
auQuery.fn.extend({
	by :css, 
	resolveName: function(name){
		return this.find(name, this.by); 
	}
});
auQuery.extend({
	$:auQuery
});

module.exports = auQuery
