[![Build Status](https://travis-ci.org/cyrjano/AuQuery.png)](https://travis-ci.org/cyrjano/AuQuery)

#auQuery#
jQuery-like browser automation library.

##Why auQuery?##
auQuery offer several advantages over other browser automation tools that works with selenium: 

1. __auQuery syntax is synchronous__. This is easier to model for procedural code like automation, plus Selenium is synchronous, and 
cannot handle several request at the same time. auQuery also plays nice with existing asynchronous interfaces. 

2. __auQuery syntax is similar to jQuery__. JQuery is a familiar web syntax, and that knowledges and even libraries 
can be reused on auQuery

3. __auQuery wraps the wd interface__. Internally, auQuery uses ```wd``` to access the browsers, it also exposes all of ```wd```
methods syncrhonously for easy consumption. On the drive method the second parameter is a browser method. 

4. __auQuery allows page object__. Selenium Webdriver includes a way to develop based on page object. AuQuery supports
a similar methodology to maintain large projects using coffee. 

###Example###
Google search example: 

```javascript
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
```

##Installation##
1. Install ```node.js```
2. run ```npm install auQuery```
3. auQuery, can run against Selenium, Selenium Grid or SauceLabs. See ```wd``` configuration for usage. 

##auQuery Methods##

###Query###
Supported JQuery-like Methods: 

On auQuery: 

* extend - extends the auQuery or auQuery.fn (prototype) object
* each - iterates through an array like object 

On elements: 

* css - get computed css property
* attr - brings the first value of selected items
* val - brings the value attribute
* text - brings the inner text 
* tag - the tag for the first element
* classes - an array with the css classes for the first element
* hasClass - boolean if the first element has a particular class
* is - if the element has a particular tag
* find -find descendant elements to the auQuery object through a css Selector
* each - iterates through each element 
* slice - similar to array slice
* eq - select a single element in the position
* first
* last
* get
* size
* toArray
* each 
* push
* sort 
* splice
* end
* merge
* pushStack

###Actions###

Selenium Related methods: 

* type - write a text into each element selected (alias:sendKeys)
* clear - clear a input area
* click - click on the first item of the navigator

###Alias###

* sendKeys - Aliases type
* getAttribute - aliases attr
* getValue - aliases val
* head - aliases first
* tail - aliases last
* $ - aliases auQuery

###Page Objects###
Page objects allow you to better manage large projects. PageObjects work by modifying the prototype of the currently
running object so that the methods become available. The current page object can be changed using the page() method and
passing the constructor of the class. However a common thing to do is clicking and changing page PageObject.button allow
you to define this process. Po.Elements allow you to bring elements jit for a selector. 

Example on Coffee Script of Page Objects: 
```coffeescript
lib = require 'auQuery' 
wd = require 'wd' 
Browser = lib.browser
po = lib.pageObject

class googleResults
  links: ->(link.text() for link in @$('.r a'))

class google 
	searchButton:  po.button(selector:'button[name=btnG]', page:googleResults)
	q: po.elements('input[name=q]')
google.to = 'http://www.google.com'

webDriver = wd.remote()
browser = new Browser(webDriver)

browser.drive(
	($, browser)->
		browser.init()
		@to google
		@type q:'auQuery'
		@wait 3000
		@click 'searchButton'
		@wait 1000
		links = @links()
		browser.quit()
		links
	(err, res)->
		console.log(err);
		console.log(res); 
)
```
###Limits###

* This library is not feature-complete compared with Selenium Webdriver. 
* This library does not implement (or plan to implement) all of jQuery features. 
* This library depends on fibers, and is not portable to run on the browser (node.js only) 
