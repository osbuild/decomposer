# decomposer

A lightweight TypeScript HTTP server that acts as a shim for image-builder-cli. Built with Bun and Hono, it provides a Unix socket-based API with automatic OpenAPI type generation from the image-builder-crc repo.

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- Node.js >= 18 (for TypeScript compilation)

### Installing Bun

```bash
npm install -g bun
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd decomposer
```

2. Install dependencies:

```bash
bun install
```

3. Generate OpenAPI types:

```bash
bun generate
```

## Usage

### Development

Start the development server with hot reload:

```bash
bun dev
```

### Custom Configuration

You can specify a custom store path:

```bash
STORE_PATH=/custom/path/to/store bun start
```

Or pass it as a command-line argument:

```bash
bun start --store /custom/path/to/store
```

Or in a .env file:

```.env
STORE_PATH=/custom/path/to/store
```

### Endpoints

See the [list of supported endpoints](./src/api/README.md) and how to make requests from your terminal.

### Socket Location

The server listens on a Unix socket at `/run/decomposer-httpd.sock` with permissions set to `775` for multi-user access.

## Development Workflow

### Code Generation

The project includes tools to automatically generate TypeScript types from OpenAPI specifications:

1. **Filter OpenAPI spec**:

   ```bash
   bun api:filter
   ```

   This downloads the latest OpenAPI spec from image-builder-crc and filters it to include only relevant endpoints.

2. **Generate TypeScript types**:

   ```bash
   bun api:generate
   ```

   This generates TypeScript interfaces and Zod schemas from the filtered OpenAPI spec.

3. **Run both steps**:
   ```bash
   bun generate
   ```

### Document generation

Some of the endpoint documentation and example requests are generated. If you have added
new endpoints, ensure you add some `TSDocs` with the endpoint description. If the module
is new, you might have to add it to `tools/docs/markdown.ts`.

1. **Generate **:
   ```bash
   bun docs
   ```

### Code Quality

- **Linting**: `bun lint`
- **Formatting**: `bun format`
- **Format Check**: `bun format:check`
- **Testing**: `bun test`
- **Type Check**: `bun check`
- **Circular Dependency Check**: `bun circular`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the test suite: `bun test`
5. Ensure code quality: `bun lint && bun format:check`
6. Submit a pull request

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

## Related Projects

- [image-builder-cli](https://github.com/osbuild/image-builder-cli) - The command line tool used to build the images
- [image-builder-crc](https://github.com/osbuild/image-builder-crc) - The upstream image builder service
