# API Endpoints

The server exposes the following endpoints on `/api/image-builder-composer/v2`:

## Meta Endpoints

-- `GET /api/image-builder-composer/v2/ready - Health check endpoint`
-- `GET /api/image-builder-composer/v2/openapi.json - OpenAPI specification`

### Health check endpoint

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request GET "http://localhost/api/image-builder-composer/v2/ready"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

GET /api/image-builder-composer/v2/ready HTTP/1.1
```

### OpenAPI specification

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request GET "http://localhost/api/image-builder-composer/v2/openapi.json"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

GET /api/image-builder-composer/v2/openapi.json HTTP/1.1
```

## Compose Endpoints

-- `GET /api/image-builder-composer/v2/composes - List composes`
-- `POST /api/image-builder-composer/v2/compose - Create compose`
-- `GET /api/image-builder-composer/v2/composes/:id - Get compose status`
-- `DELETE /api/image-builder-composer/v2/composes/:id - Delete compose`

### List composes

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request GET "http://localhost/api/image-builder-composer/v2/composes"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

GET /api/image-builder-composer/v2/composes HTTP/1.1
```

### Create compose

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request POST "http://localhost/api/image-builder-composer/v2/compose" \
  --header 'Content-Type: application/json' \
  --data '{
  "distribution": "centos-9",
  "client_id": "api",
  "image_requests": [
    {
      "image_type": "guest-image",
      "architecture": "x86_64",
      "upload_request": {
        "type": "aws.s3",
        "options": {}
      }
    }
  ]
}'
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

POST /api/image-builder-composer/v2/compose HTTP/1.1
Content-Type: application/json

{
  "distribution": "centos-9",
  "client_id": "api",
  "image_requests": [
    {
      "image_type": "guest-image",
      "architecture": "x86_64",
      "upload_request": {
        "type": "aws.s3",
        "options": {}
      }
    }
  ]
}
```

### Get compose status

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request GET "http://localhost/api/image-builder-composer/v2/composes/${1}"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

GET /api/image-builder-composer/v2/composes/{{id}} HTTP/1.1
```

### Delete compose

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request DELETE "http://localhost/api/image-builder-composer/v2/composes/${1}"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

DELETE /api/image-builder-composer/v2/composes/{{id}} HTTP/1.1
```

## Blueprint Endpoints

-- `GET /api/image-builder-composer/v2/blueprints - List blueprints`
-- `POST /api/image-builder-composer/v2/blueprints - Create blueprint`
-- `GET /api/image-builder-composer/v2/blueprints/:id - Get blueprint`
-- `PUT /api/image-builder-composer/v2/blueprints/:id - Edit blueprint`
-- `DELETE /api/image-builder-composer/v2/blueprints/:id - Delete blueprint`
-- `GET /api/image-builder-composer/v2/blueprints/:id/composes - List blueprint composes`

### List blueprints

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request GET "http://localhost/api/image-builder-composer/v2/blueprints"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

GET /api/image-builder-composer/v2/blueprints HTTP/1.1
```

### Create blueprint

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request POST "http://localhost/api/image-builder-composer/v2/blueprints" \
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
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

POST /api/image-builder-composer/v2/blueprints HTTP/1.1
Content-Type: application/json

{
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
}
```

### Get blueprint

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request GET "http://localhost/api/image-builder-composer/v2/blueprints/${1}"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

GET /api/image-builder-composer/v2/blueprints/{{id}} HTTP/1.1
```

### Edit blueprint

Example curl request:

```bash
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
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

PUT /api/image-builder-composer/v2/blueprints/{{id}} HTTP/1.1
Content-Type: application/json

{
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
}
```

### Delete blueprint

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request DELETE "http://localhost/api/image-builder-composer/v2/blueprints/${1}"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

DELETE /api/image-builder-composer/v2/blueprints/{{id}} HTTP/1.1
```

### List blueprint composes

Example curl request:

```bash
SOCKET="${SOCKET_PATH:-'/run/decomposer-httpd.sock'}"

curl --silent --unix-socket $SOCKET \
  --request GET "http://localhost/api/image-builder-composer/v2/blueprints/${1}/composes"
```

Example HTTP request:

```http
# use .env SOCKET_PATH or fallback to default
@socket={{SOCKET_PATH ?? '/run/decomposer-httpd.sock' }}
@host=http://unix{{ socket }}:

GET /api/image-builder-composer/v2/blueprints/{{id}}/composes HTTP/1.1
```
