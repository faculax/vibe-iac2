#!/bin/sh

# Replace placeholder in env.js with actual value
envsubst < /usr/share/nginx/html/env.js > /usr/share/nginx/html/env.temp.js
mv /usr/share/nginx/html/env.temp.js /usr/share/nginx/html/env.js

exec "$@"
