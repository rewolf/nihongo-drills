from rewolf.web_builder import WebApp
import sys
import os

VERSION 		= "1_1_1"
LOCAL_SERVER	= "/var/www/nihongo"
REMOTE_USER		= "angry4dminbn"
REMOTE_SERVER	= "angrytortoise.com"
REMOTE_PATH		= "~/html/nd/"
TEST_PATH		= "~/html/nd/ndalpha/"

js_files = [
	"script/common.js", 
	"script/image.js", 
	"script/page.js",
	"script/abstract-modules.js",
	"script/modules.js",
	"script/resource-modules.js",
	"script/page-manager.js",
	"script/main.js"
]

css_files = [
	"style/common.css",
	"style/basic/main.css",
	"style/basic/menu.css",
	"style/basic/drills.css",
	"style/basic/resources.css",
	"style/desktop/main.css",
	"style/desktop/menu.css",
	"style/desktop/drills.css",
	"style/desktop/resources.css",
	"style/name-tags.css",
	"style/name-tags-print.css"
]


js_mods = {
	"nd-main" : [
		"script/common.js", 
		"script/image.js", 
		"script/page.js",
		"script/abstract-modules.js",
		"script/modules.js",
		"script/resource-modules.js",
		"script/page-manager.js",
		"script/main.js",
	]
}

css_mods = {
	"basic" 	: [
		"style/common.css",
		"style/basic/main.css",
		"style/basic/menu.css",
		"style/basic/drills.css",
		"style/basic/resources.css",
	],
	"desktop"	: [
		"style/desktop/main.css",
		"style/desktop/menu.css",
		"style/desktop/drills.css",
		"style/desktop/resources.css",
	],
	"name-tags" : [
		"style/name-tags.css"
	],
	"name-tags-print" : [
		"style/name-tags-print.css"
	]
}

pages = {
	"index.php" : {
		"js":	[
			"nd-main"
		],
		"css":	[
			("basic", 		""),
			("desktop",		"screen and (min-width: 1024px)")
		]
	},
	"name-tag-example.php" : {
		"js":	[
		],
		"css":	[
			("basic", 		""),
			("desktop",		"screen and (min-width: 1024px)")
		]
	},
	"make-tags.php" : {
		"js": [],
		"css": [
			("name-tags", ""),
			("name-tags-print", "print")
		]
	}
}

res = [
	"res/images",
	"res/fonts",
	"res/audio",
	"includes",
	"ajax",
	"pages",
	"sitemap.xml",
	"page-meta.json",
	"name-tags.json",
]

rename_js = [
	"settings",
	"addEvent",
	"maxCharLine",
	"minCharLine",
	"contentNode",
	"showNextChar",
	"difficulty",
	"removeClass",
	"addClass",
	"Module",
	"currentModule",
	"createElem",
	"currentPage",
	"Char_fromVoice",
	"Char_toVoice",
	"Char_writeTest",
	"currentCharIndex"
]
rename_css = [
]

def main():
	minify	= "-m" in sys.argv or "--minify" in sys.argv
	if "-n" in sys.argv or "--nores" in sys.argv:
		for r in res:
			if r.startswith("res/"):
					res.remove(r)
	if "-a" in sys.argv or "--noaudio" in sys.argv:
		res.remove("res/audio")

	app = WebApp("nihongo", VERSION, js_files, css_files, res)

	app.rename("js", rename_js)
	app.rename("css", rename_css)

	app.build(js_mods, css_mods, pages, minify)

	if "-d" in sys.argv or "--deploy" in sys.argv:
		if raw_input("Are you sure you wish to deploy to the remote server? ").lower()=="y":
			app.deploy_remote(REMOTE_USER, REMOTE_SERVER, REMOTE_PATH)
		else:
			print "Deployment aborted"
	elif "-t" in sys.argv or "--test" in sys.argv:
		if raw_input("Are you sure you wish to deploy to the testing path on teh remote server? ").lower()=="y":
			app.deploy_remote(REMOTE_USER, REMOTE_SERVER, TEST_PATH)
		else:
			print "Deployment aborted"
	else:
		app.deploy(LOCAL_SERVER)
	app.cleanup()




def print_usage():
	args = [
		("-a, --noaudio", "Don't copy audio resources"),
		("-d, --deploy", "Code will be uploaded to the nihongodrills.com web server"),
		("-m, --minify", "Code will be minified by removing all non-syntactic whitespace"),
		("-n, --nores", "Don't copy resources"),
		("-t, --nores", "Deploy to test path on server")
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
