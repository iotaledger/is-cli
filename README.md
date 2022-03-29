# IS-CLI

The command line interface for the Integration Services.

## Prerequisite

-   min. Node v15.6.0

## Installation

1. Install packages: `npm i`
2. Build CLI: `npm run build` or run build in watch `npm run serve`
3. To use the CLI install it globally: `npm run start`
4. The CLI tool should now be available, try: `is --help`

## Usage

-   For local API access run: `is local-config -s http://localhost:3001 -a http://localhost:3002 -k <your-api-key>`.
-   Configure API environment: `is setup-node`.
-   For most of the channel and identity commands is a `identity.json` in the directory where the cli is executed needed.
-   View all command with `is help`.
