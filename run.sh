#!/usr/bin/env sh

if [ $# -ne 1 ]; then
	echo IP address of the server has to be passed as one CLI argument
	exit 3
fi

sed -i "1 s/SERVERIP/$1/" /usr/share/nginx/html/main.js

nginx -g "daemon off;"
