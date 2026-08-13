#!/usr/bin/env sh

if [ $# -ne 1 ]; then
	echo IP address of the server has to be passed as one CLI argument
	exit 3
fi

mkdir -p ./public && rm -rf ./public && mkdir ./public && ln ./index.html ./style.css ./public

sed "1 s/SERVERIP/$1/" ./main.js > ./public/main.js

