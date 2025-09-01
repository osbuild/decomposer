SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request PUT "http://localhost/api/image-builder-composer/v2/blueprints/${1}" \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "decomposer-test-blueprint",
  "description": "Blueprint to test the decomposer shim",
  "distribution": "fedora-41",
  "image_requests": [
    {
      "architecture": "x86_64",
      "image_type": "guest-image",
      "upload_request": {
        "type": "aws.s3",
        "options": {}
      }
    }
  ],
  "customizations": {
    "users": [
      {
        "name": "test",
        "password": "password42",
        "groups": [
          "wheel"
        ],
        "hasPassword": true
      }
    ]
  }
}'
