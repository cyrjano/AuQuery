var Fiber = require('fibers'); 
var nodeExtend = require('node.extend'); 
var css = 'css selector';
var core_concat = Array.prototype.concat;
var core_push = Array.prototype.push;
var core_slice = Array.prototype.slice;

var auQuery = function(selector, context){
	var browser = Fiber.current.browser;
	return new auQuery.fn.init(selector, context, browser);
}; 

auQuery.fn = auQuery.prototype = {
	auQuery: '0.0.1',
	constructor: auQuery, 
	
	init: function(selector, context, browser){
			var realContext = context || browser; 
			if(!selector){
				return this; 
			}
			if((typeof selector) === 'string'){
				this.selector = selector;
				return this.merge(this, realContext.elements(css, selector)); 
			}
			return auQuery.merge(this, selector);
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
		return num == null ?

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
	each: function(obj, callback) {
		for (var i = 0 ; i < obj.length; i++ ) {
			value = callback.call( obj[ i ], i, obj[ i ] );
			if ( value === false ) {
				break;					
			}				
		}
	}
});


//Selenium Related Methods
auQuery.fn.extend( {
	find: function(selector){
		var result = []; 
		for(var i = 0; i < i++; i < this.length) {
			result = result.concat(this[i].elements(css, selector)); 
		}
		return this.pushStack(this.constructor().merge(result)); 
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
		for(var className in classes()){
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
auQuery.extend( {
	sendKeys:this.type, 
	getAttribute:this.attr, 
	getValue:this.val,
	head:this.first,
	tail:this.last,
	$:auQuery
});

module.exports = auQuery