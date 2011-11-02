

normal:
	python build/build.py

full:
	python build/build.py --minify

deploy:
	python build/build.py --minify --deploy --nores

deployall:
	python build/build.py --minify --deploy

run:
	google-chrome localhost/nihongo
