SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request DELETE "http://localhost/api/image-builder-composer/v2/blueprints/${1}"
