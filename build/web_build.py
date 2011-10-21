import subprocess, shlex, os, re

TEMP_DIR	= "build_tmp"

linkPat	= re.compile("<link.*?>")
scriptPat= re.compile("<script.*?></script>")

def get_source (path):
	f = open(path)
	code = "".join(f.readlines())
	f.close()
	return code


def minify (path):
	cmd 	= "java -jar /home/rewolf/devTools/yui/yui.jar --preserve-semi %s" % path
	proc 	= subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE)

	result = ""
	try:
		while (True):
			result += proc.communicate()[0]
	except:
		# end of output
		pass
	
	if proc.returncode != 0:
		return None
	else:
		return result
		
def createTempDir ():
	os.system("rm -Rf %s" % TEMP_DIR)
	os.mkdir(TEMP_DIR)
	os.mkdir(os.path.join(TEMP_DIR, "script"))
	os.mkdir(os.path.join(TEMP_DIR, "style"))

def cleanTemp ():
	os.system("rm -Rf %s" % TEMP_DIR)


def makeStyleTag (path):
	return "\t<link rel=\"stylesheet\" href=\"%s\" />\n" % path


def makeScriptTag (path):
	return "\t<script type=\"text/javascript\" src=\"%s\"></script>\n" % path


def deploy_app (version, jfiles, cfiles, jmods, cmods, pages, do_minify=False):
	js_file_map 	= {}
	css_file_map 	= {}
	js_mod_map		= {}
	css_mod_map		= {}

	# minify if necessary
	for js in jfiles:
		source = (minify if do_minify else get_source)(js)
		js_file_map[js] = source
	for css in cfiles:
		source = (minify if do_minify else get_source)(css)
		css_file_map[css] = source

	# merge into modules
	for name, files in jmods.items():
		source = ""
		for f in files:
			source += js_file_map[f]
		js_mod_map[name] = source

	for name, files in cmods.items():
		source = ""
		for f in files:
			source += css_file_map[f]
		css_mod_map[name] = source

	createTempDir()

	# put into the pages
	for page, head in pages.items():
		source = get_source(page)
		
		head_loc = source.lower().find("</head>")
		if head_loc==-1:
			print "ERROR: no </head> in %s"%page
			return

		out_src = source[:head_loc]
		# first remove existing stylesheets and scripts
		out_src = scriptPat.sub("", linkPat.sub("", out_src))
		# now add our new modules in
		for css in head["css"]:
			out_src+= makeStyleTag("style/"+version+"_"+css+".css")
		for js in head["js"]:
			out_src+= makeScriptTag("script/"+version+"_"+js+".js")
		out_src+= source[head_loc:]

		f = open(os.path.join(TEMP_DIR, page), "w")
		f.write(out_src)
		f.close()

	# write the script/style files
	for js, code in js_mod_map.items():
		f = open(os.path.join(TEMP_DIR, "script", version+"_"+js+".js"), "w")
		f.write(code)
		f.close()
	for css, code in css_mod_map.items():
		f = open(os.path.join(TEMP_DIR, "style", version+"_"+css+".css"), "w")
		f.write(code)
		f.close()

	# copy to the webserver

	# clean temp stuff
	cleanTemp()
	
	
