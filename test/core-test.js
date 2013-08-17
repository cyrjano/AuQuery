var assert = require('assert');
var lib = require('../lib/main');
var $ = lib.auQuery; 
var a = $([0,1,2,3]);
var singleItem = $(2);
describe('auQuery', function(){
	describe('#size()', function(){
		it("should have size to array", function(){
			assert.equal(4, a.size()); 
		}),
		it("should have size of 1", function(){
			assert.equal(1, singleItem.size()); 
		})
	}),
	describe('#get()', function(){
		it("should get item in position", function(){
			assert.equal(a.get(0),0);
		}),
		it("should get item in  from the end", function(){
			assert.equal(a.get(-1),3);
		}),
		it("should get single item at 0 position", function(){
			assert.equal(singleItem.get(0), 2);
		})
	}),
	describe('#eq()', function(){
		it("should get item in position", function(){
			assert.equal(a.eq(0)[0],0);
		}),
		it("should get item in  from the end", function(){
			assert.equal(a.eq(-1)[0],3);
		})
	}),
	describe('#first()', function(){
		it("should get  first item", function(){
			assert.equal(a.first()[0],0);
		})
	}),
	describe('#last()', function(){
		it("should get last item", function(){
			assert.equal(a.last()[0],3);
		})
	})
	describe('#head()', function(){
		it("should first item", function(){
			assert.equal(a.head()[0],0);
		})
	}),
	describe('#tail()', function(){
		it("should get last item", function(){
			assert.equal(a.tail()[0],3);
		})
	}),
	describe('#each()', function(){
		it("should be iterable", function(){
			a.each(function(index){assert.equal(this,index)}); 
		})
	}),
	describe('#toArray()', function(){
		it("should create a valid array", function(){
			 assert.deepEqual(a.toArray(), [0,1,2,3]); 
		})
	}),
	describe('#end()', function(){
		it("should go back to the parent", function(){
			 assert.equal(a.eq(0).end().size(),4); 
		})
	})
})