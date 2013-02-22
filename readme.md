﻿#auQuery#
auQuery is a tool built on top of two node libraries: wd and fibers. It uses wd to access selenium webdriver, and fibers to make the calls to selenium synchronous. auQuery also provide a jQuery like interface to access the browser that allow using javascript developers skillset back in user acceptance automation.  

##Installation##
Install node.js
do npm install wd 
install npm install auQuery
Download the selenium standalone server. 
Run the standalone server (java -jar selenium-server-standalone.jar) 
##Creating the Environment##
auQuery cannot be ran directly from the main function in node.js (as it needs to create a fiber). To run auQuery queries do the following in your code: 

* Create a wd object
* Create a auQuery Browser and init it with a wd process. 
* Call the method drive on the browser that receives a function with two parameters. The first paremeter will be a synchronous version of the wd object passed, with a sleep method, the second parameter will be the auQuery object. 

##auQuery Methods##

###Actions###

* find - find child elements to the selected navigator through a css selector
* type - write a text into each element selected (alias:sendKeys)
* clear - clear a input area
* click - click on the first item of the navigator

###Query###

* css - get computed css property
* attr - brings the first value of selected items
* val - brings the value attribute
* text - brings the inner text 
* tag - the tag for the first element
* classes - an array with the css classes for the first element
* hasClass - boolean if the first element has a particular class
* is - if the element has a particular tag

###Filtering###

* first
* last
* get
* size
* toArray

###Collection Management###

* each

###Limits###
This library is not feature-complete compared with Selenium Webdriver. Another limitation is that it does not implement (or plant to implement) all of jQuery features. 
