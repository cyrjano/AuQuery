var lib = require('auQuery');
var wd = require('wd');
var assert = require('assert');
var Browser = lib.browser;
var AuQuery = lib.auQuery;

var webDriver = wd.remote();

var browser = new Browser(webDriver);

browser.drive(function($, browser){
        browser.init();
        browser.get('http://www.bing.com');
        var searchBox = browser.elementById('sb_form_q');
        searchBox.type('GoodData');
		this.sleep(3000);
        var searchButton = browser.elementById('sb_form_go');
		console.log(searchButton); 
        console.log(searchButton.value);
        browser.moveTo(searchButton, 5, 5);
        browser.click();
    }
    , function(err, res){
        if(err){
            console.log(err); 
        }
    });
