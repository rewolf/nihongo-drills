

normal:
	python build/build.py

full:
	python build/build.py --minify

deploy:
	python build/build.py --minify --deploy --nores

deploynoaudio:
	python build/build.py --minify --deploy --noaudio

deployall:
	python build/build.py --minify --deploy

test:
	python build/build.py --minify --test --nores

testnoaudio:
	python build/build.py --minify --test --noaudio

testall:
	python build/build.py --minify --test

run:
	google-chrome localhost/nihongo

clean:
	rm -Rf /var/www/nihongo/*
