from rewolf.web_builder import WebApp
import sys
import os

VERSION = "1_0"

js_files = [
	"script/common.js", 
	"script/image.js", 
	"script/hiragana.js",
	"script/hiragana-module.js",
	"script/hiragana-char_htv.js",
	"script/hiragana-char_vth.js",
	"script/hiragana-char_vtw.js"
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
	"hira-char" : [
		"script/hiragana-char_htv.js",
		"script/hiragana-char_vth.js",
		"script/hiragana-char_vtw.js"
	]
}

css_mods = {
	"hira-main" : [
		"style/common.css",
		"style/hiragana.css"
	]
}

pages = {
	"index.php" : {
		"js":	[
			"hira-main",
			"hira-char"
		],
		"css":	[
			"hira-main"
		]
	},
	"log_usage.php" : {
		"js":	[],
		"css":	[]
	},
	"get_audio.php" : {
		"js":	[],
		"css":	[]
	}
	
}

res = [
	"res"
]

def main():
	minify	= "-m" in sys.argv or "--minify" in sys.argv

	app = WebApp("nihongo", VERSION, js_files, css_files, res)

	app.build(js_mods, css_mods, pages, minify)
	if "-d" in sys.argv or "--deploy" in sys.argv:
		app.deploy_remote("angry4dminbn", "angrytortoise.com", "~/html/nd/", not ("--nores" in sys.argv or "-n" in sys.argv))
	else:
		app.deploy("/var/www/nihongo")
	app.cleanup()




def print_usage():
	args = [
		("-m, --minify", "Code will be minified by removing all non-syntactic whitespace"),
		("-d, --deploy", "Code will be uploaded to the nihongodrills.com web server"),
		("-n, --nores", "Don't copy resources")
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
