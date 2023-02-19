# A ChatGPT-like chat app built with SAP CAP and SAPUI5

**Important**: Currently WIP.

This is a full working sample chat application built with SAP CAP and SAPUI5. It uses the [OpenAI API](https://openai.com/blog/openai-api/) to generate responses to the user's messages. More details can be found in the related blog posts in the SAP Community:

TBD

## Run the app locally in development mode

### Prerequisites

- [Node.js](https://nodejs.org/en/) (at least version 16)
- [An OpenAI Account and an OpenAI API key](https://platform.openai.com/account/api-keys)
- [SQLite](https://www.sqlite.org/index.html)

### Install pnpm

If you haven't `pnpm` already installed, you can globally install it via the following command:

```bash
npm i -g pnpm
```

### Install dependencies

Install all dependencies using the following command:

```bash
pnpm i
```

### Deploy the cds entities from the CAP backend to the SQLite database

```bash
pnpm -r deploy:local
```

### Add your OpenAI API key

Put a new file in the folder `packages/backend` called `.env` with the following content:

```bash
app_openai-api-token = <your API key>
```

### Start the app in development mode

The following command will start the app in development mode. It will start the backend and the frontend in parallel.

```bash
pnpm --parallel start:dev
```

### Open the app in the browser

Open the following URL in your browser and start chatting: [http://localhost:8080](http://localhost:8080)

## Deploy the app to the SAP BTP Cloud Foundry environment

### Prerequisites

- [An OpenAI Account and an OpenAI API key](https://platform.openai.com/account/api-keys)
- [The Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

### Add your OpenAI API key

There are two ways to add your OpenAI API key to the app:

You can either add it to the `dev.mtaext` file:

```yaml
TBD
```
