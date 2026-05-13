#!/usr/bin/env bash
#
# Open Portfolio — double-click to open the Geordin Zolliecoffer portfolio
# in your default browser. The site runs as a Docker container on homelab
# 24/7; this script just opens the URL.
#
# If you need to manage the container, see "Container management" below.

set -euo pipefail

HOST="homelab"           # Tailscale MagicDNS name for the homelab box
PORT=8080
URL="http://${HOST}:${PORT}"

B="\033[1m"; D="\033[2m"; R="\033[0m"; G="\033[32m"; X="\033[36m"

printf "${B}Geordin Zolliecoffer — Portfolio${R}\n"
printf "${D}URL: ${X}%s${R}\n\n" "$URL"

# Pre-flight: is the container serving?
if curl --silent --fail --max-time 4 --output /dev/null "$URL/"; then
  printf "${G}✓ Container running. Opening browser.${R}\n\n"
  open "$URL"
else
  printf "Container is not responding. Attempting to start it…\n"
  ssh "$HOST" "cd ~/apps/geordin-portfolio && docker compose up -d" || {
    printf "Could not start the container. SSH into %s and run:\n" "$HOST"
    printf "    cd ~/apps/geordin-portfolio && docker compose up -d\n"
    read -r -p "Press return to close… " _
    exit 1
  }
  # Wait for it to come up.
  for _ in $(seq 1 30); do
    sleep 1
    if curl --silent --fail --max-time 2 --output /dev/null "$URL/"; then
      printf "${G}✓ Container started. Opening browser.${R}\n\n"
      open "$URL"
      break
    fi
  done
fi

# Container management quick-reference (run these via SSH to homelab):
#
#   docker logs -f geordin-portfolio              # tail nginx logs
#   docker compose restart                        # restart container
#   docker compose down                           # stop + remove container
#   docker compose up -d --build                  # rebuild after source change
#   docker compose pull && docker compose up -d   # pull new image + restart
#
# Or open a shell into the container:
#   docker exec -it geordin-portfolio sh
#
# To deploy code changes:
#   1. Edit locally
#   2. rsync src/ → homelab:apps/geordin-portfolio/src/
#   3. ssh homelab "cd ~/apps/geordin-portfolio && docker compose up -d --build"

printf "\n${D}Container managed on %s. See script header for commands.${R}\n" "$HOST"
read -r -p "Press return to close this window… " _
