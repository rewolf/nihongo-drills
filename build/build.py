from web_build import *

VERSION = "1_0"

js_files = [
	"script/common.js", 
	"script/jap-hiragana.js"
]

css_files = [
	"style/jap-hiragana.css"
]


js_mods = {
	"hira-main" : [
		"script/common.js", 
		"script/jap-hiragana.js"
	]
}

css_mods = {
	"hira-main" : [
		"style/jap-hiragana.css"
	]
}

pages = {
	"jap-hiragana.php" : {
		"js":	[
			"hira-main"
		],
		"css":	[
			"hira-main"
		]
	}
}

deploy_app(VERSION, js_files, css_files, js_mods, css_mods, pages, True)
