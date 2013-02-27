#auQuery#
jQuery-like browser automation library.

##Why auQuery?##
auQuery offer several advantages over other browser automation tools that works with selenium: 

1. __auQuery syntax is synchronous__. This is easier to model for procedural code like automation, plus Selenium is synchronous, and 
cannot handle several request at the same time. auQuery also plays nice with existing asynchronous interfaces. 

2. __auQuery syntax is similar to jQuery__. JQuery is a familiar web syntax, and that knowledges and even libraries can be reused 
on auQuery

3. __auQuery wraps the wd interface__. Internally, auQuery uses ```wd``` to access the browsers, it also exposes all of ```wd```
methods syncrhonously for easy consumption. 

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

browser.drive(function($){
  this.init(); 
  this.get('http://www.google.com'); 
  $('input[name=q]').type('Hello World');
  this.sleep(1000 /*ms*/); 
  console.log( this.title() ); 
  this.quit();
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


###Limits###

* This library is not feature-complete compared with Selenium Webdriver. 
* This library does not implement (or plan to implement) all of jQuery features. 
* This library depends on fibers, and is not portable to run on the browser (node.js only) 
