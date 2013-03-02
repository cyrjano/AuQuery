var assert = require('assert');
var lib = require('../lib/main');
var $ = lib.auQuery; 

var a = $([ new function(){
	this.calls = []; 
	this.pushCall = function(method, args){
		this.calls.push( {'method':method, 'args':Array.prototype.slice.call(args)});
	};
	this.type = function(){
		this.pushCall('type', arguments); 
	};
	this.clear = function(){
		this.pushCall('clear', arguments); 
	};
	this.getAttribute = function(){
		this.pushCall('getAttribute', arguments); 
		return 'a1 a2';
	};
	this.text = function(){
		this.pushCall('text', arguments); 
		return 'text';
	};
	this.getTagName = function(){
		this.pushCall('getTagName', arguments); 
		return 'tag';
	};
}()]); 

describe('auQuery', function(){
	beforeEach(function(){
		a.get(0).calls = []; 
	}),
	describe('#type()', function(){
		it("should call type", function(){ 
			a.type('hello world');
			assert.equal(a.get(0).calls[0].method,'type'); 
			assert.equal(a.get(0).calls[0].args[0],'hello world'); 
		})
	}),
	describe('#val()', function(){
		it("should get value", function(){ 
			var val = a.val();
			assert.equal(val, 'a1 a2'); 
			assert.equal(a.get(0).calls[0].method,'getAttribute'); 
			assert.equal(a.get(0).calls[0].args[0],'value'); 
		})
	}),
	describe('#is()', function(){
		it("should return true if tag", function(){ 
			var is = a.is('tag');
			assert.ok(is); 
			assert.equal(a.get(0).calls[0].method,'getTagName'); 
			assert.equal(a.get(0).calls[0].args.length,0); 
		}),
		it("should return true if not tag", function(){ 
			var is = a.is('not');
			assert.ok(!is); 
			assert.equal(a.get(0).calls[0].method,'getTagName'); 
			assert.equal(a.get(0).calls[0].args.length,0); 
		})
	}),
	describe('#hasClass()', function(){
		it("should return true if it has class a1", function(){ 
			var is = a.hasClass('a1');
			assert.ok(is); 
			assert.equal(a.get(0).calls[0].method,'getAttribute'); 
			assert.equal(a.get(0).calls[0].args[0],'class'); 
		})
	})
})
