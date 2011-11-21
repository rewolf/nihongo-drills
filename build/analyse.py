import os, re
from rewolf.web_builder import minify
import sys

tokens 		= {}
tok_files	= []
pat			= re.compile("(?<![a-zA-Z_])[a-zA-Z_][a-zA-Z0-9\-_]*(?![a-zA-Z0-9\-_])")
ignore		= [
	"constructor",
	"innerHTML",
	"innerHtml",
	"return",
	"window",
	"value",
	"length",
	"else",
	"true",
	"false",
	"class",
	"function",
	"prototype",
	"document",
	"this",
	"px",
	"JAP",
	"if",
	"div",
	"var",
	"width",
	"height",
	"top",
	"left",
	"bottom",
	"right",
	"createElement",
	"appendChild",
	"id",
	"className",
	"for"
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

def incrTok (tok, amount=1):
	global tokens
	if len(tok) < 2 or tok in ignore:
		return
	if tok in rename_js:
		return
	if tok in tokens:
		tokens[tok] += amount
	else:
		tokens[tok] = amount

exts = [
	".php",
	".js",
	".css",
	".json"
]

# locate files
for path, dirs, files in os.walk("."):
	parts = os.path.split(path)
	for f in files:
		ext = os.path.splitext(f)[1]
		if ext in exts:
			tok_files.append(os.path.join(path,f))

# count tokens
for f in tok_files:
	l 	= minify(f)
	if not l:
		print "####",f
		fh 	= open(f)
		l 	= "".join(fh.readlines()).replace("\n"," ")
		fh.close()
		
	r = pat.findall(l)
	for q in r:
		incrTok(q)

# sort
tmap   = tokens
tokens = sorted(tokens.items(), key=lambda x:x[1], reverse=True)

for i,t in enumerate(tokens):
	tokens[i] = (t[0], t[1], t[1] * len(t[0]))

# display
#print "token".ljust(20), "count".ljust(5), "len".ljust(3), "total"
#for t, c1, c2 in tokens[:20]:
#	print t.ljust(20), `c1`.ljust(5),`len(t)`.ljust(3), c2

# sort by second count
print "\ntoken".ljust(20), "count".ljust(5), "len".ljust(3), "total"
tokens = sorted(tokens, key=lambda x:x[2], reverse=True)

for t, c1, c2 in tokens[:40]:
	print t.ljust(20), `c1`.ljust(5),`len(t)`.ljust(3), c2

if len(sys.argv) > 1:
	print "\tREQUESTS:"
	for r in sys.argv[1:]:
			print r.ljust(20), `tmap[r]`.ljust(5),`len(r)`.ljust(3), len(r)*tmap[r]


