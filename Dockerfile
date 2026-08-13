FROM nginx:alpine
COPY index.html style.css main.js /usr/share/nginx/html
COPY run.sh /usr/local/bin
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/run.sh"]

