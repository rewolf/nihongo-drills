from rewolf.web_builder import WebApp
import sys
import os

VERSION = "1_0"

js_files = [
	"script/common.js", 
	"script/image.js", 
	"script/hiragana.js",
	"script/hiragana-module.js",
	"script/hiragana-char_htv.js"
]

css_files = [
	"style/common.css",
	"style/hiragana.css"
]


js_mods = {
	"hira-main" : [
		"script/common.js", 
		"script/image.js", 
		"script/hiragana.js",
		"script/hiragana-module.js"
	],
	"hira-char-htv" : [
		"script/hiragana-char_htv.js"
	]
}

css_mods = {
	"hira-main" : [
		"style/common.css",
		"style/hiragana.css"
	]
}

pages = {
	"hiragana.php" : {
		"js":	[
			"hira-main",
			"hira-char-htv"
		],
		"css":	[
			"hira-main"
		]
	},
	"index.php" : {
		"js":	[
		],
		"css":	[
		]
	}
}

res = [
	"res"
]

def main():
	minify	= "-m" in sys.argv or "--minify" in sys.argv

	app = WebApp("nihongo", VERSION, js_files, css_files, res)

	app.build(js_mods, css_mods, pages, minify)
	app.deploy("/var/www/nihongo")
	app.cleanup()




def print_usage():
	args = [
		("-m, --minify", "Code will be minified by removing all non-syntactic whitespace")
	]
	options = "\n".join([ "\t"+o.ljust(25) + e for o,e in args ])
	os.system( "echo \""+\
"""
Usage: python build.py [OPTION]...

$(tput bold)OPTIONS$(tput sgr0)
%s"
""" % options)


if __name__=="__main__":
	main()
