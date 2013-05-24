var $ = require('./auQuery');

var button = function(item){
	return {
		click: function(){
			$(item.selector).click(); 
			return item.page; 
		}
	};
};

var elements = function(selector){
	return function(){
		return $(selector); 
	};
};

module.exports = {
	'button':button, 
	'elements':elements 
}; 