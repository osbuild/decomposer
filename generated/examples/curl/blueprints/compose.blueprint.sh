SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request POST "http://localhost/api/image-builder-composer/v2/blueprints/${1}/compose" \
  --header 'Content-Type: application/json' \
  --data '{
  "image_types": [
    "guest-image"
  ]
}'
