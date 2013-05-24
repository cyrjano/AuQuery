lib = require 'auQuery' 
wd = require 'wd' 
Browser = lib.browser
$ = lib.auQuery
po = lib.pageObject

webDriver = wd.remote()
browser = new Browser(webDriver)

class googleResults
	links:->(link.text() for link in $('.r a'))

class google 
	searchButton:  po.button(selector:'button[name=btnG]', page:googleResults)
	q: po.elements('input[name=q]')
google.to = 'http://www.google.com'

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
