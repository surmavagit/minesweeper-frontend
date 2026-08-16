# Minesweeper Frontend

This is the frontend for Minesweeper project.

Since the user's browser is supposed to send requests to the backend server, the IP address of the latter must be included in the static javascript file. Two scripts are provided for this.

To run locally, run:
```bash
BACKENDIP=127.0.0.1
./update.sh "${BACKENDIP}:8080"
```
It will create a public directory and copy the relevant files there. It requires a command-line argument - backend server ip address and port 8080. It runs `sed` to inject this address into the first line of the javascrpit file.

Then you can either run a local development server in that directory (`npx http-server`), or simply open index.html in your browser (you'll need to use the DevTools for the site to work properly).

## Docker

The server is dockerized and available on DockerHub as surmava/minesweeper-frontend

The entrypoint to the Docker containers is a separate script - run.sh. It requires the same command-line argument as the update.sh script - backend server ip address and port 8080.
