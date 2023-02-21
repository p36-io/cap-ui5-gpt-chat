# A ChatGPT-like chat app built with SAP CAP and SAPUI5

This is a full working chat application built with SAP CAP and SAPUI5. It uses a selectable GPT-3 model the [OpenAI API](https://openai.com/blog/openai-api/) to generate responses to the user's prompts. More details can be found in the related blog posts in the SAP Community:

TBD

![alt text](https://raw.githubusercontent.com/p36-io/cap-ui5-gpt-chat/main/docs/chat_btp.gif "Title")

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

Put a new file in the folder `packages/backend` called `default-env.json` with the following content and add your OpenAI API key:

```json
{
  "app_openai": {
    "apiKey": "YOUR-API-KEY",
    "completionAttributes": {
      "max_tokens": 1200,
      "temperature": 0.8,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0.6
    }
  },
  "VCAP_SERVICES": {}
}
```

### Start the app in development mode

The following command will start the app in development mode. Backend and frontend will be started in parallel.

```bash
pnpm --parallel start:dev
```

### Open the app in the browser

Open the following URL in your browser and start chatting: [http://localhost:8080](http://localhost:8080)

You need to login with one of the following credentials:

| username    | password     |
| ----------- | ------------ |
| _developer_ | _helloworld_ |
| _pirate_    | _ahoy_       |

There a no internal roles attached to either role, so feel free to choose.

## Deploy the app to the SAP BTP Cloud Foundry environment

The project is already prepared to be deployed to the SAP BTP Cloud Foundry environment. The following diagram shows the architecture of the app:

![alt text](https://raw.githubusercontent.com/p36-io/cap-ui5-gpt-chat/main/docs/diagram.jpg "Title")

The full application can be deployed to SAP BTP without any cost, using a Trial or Free Tier acccount.

### Prerequisites

- You have an OpenAI Account and requested an [OpenAI API key](https://platform.openai.com/account/api-keys)
- You have a SAP BTP Trial [SAP BTP Trial](https://developers.sap.com/tutorials/hcp-create-trial-account.html) or [Free Tier Account](https://developers.sap.com/tutorials/btp-free-tier-account.html)
- You have created an [SAP HANA Cloud Service instance](https://developers.sap.com/tutorials/btp-app-hana-cloud-setup.html#08480ec0-ac70-4d47-a759-dc5cb0eb1d58)
- You have installed the [Cloud Foundry CLI](https://developers.sap.com/tutorials/cp-cf-download-cli.html)
- You have installed the [MultiApps CF CLI Plugin](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin)

### Add your OpenAI API key

Edit the file `dev.mtaext` and add your OpenAI API key to the `app_openai` property:

```yaml
modules:
  - name: capui5gptchat-srv
    properties:
      app_openai: >
        {
          "apiKey": "YOUR-API-KEY",
          "completionAttributes": {
            "max_tokens": 1200,
            "temperature": 0.8,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0.6
          }
        }
```

By the way, it's also possible to tweak the OpenAI API parameters for the completion request. For more details, see the [OpenAI API documentation](https://beta.openai.com/docs/api-reference/completions/create).

### Login to the SAP BTP Cloud Foundry environment

```bash
cf login
```

### Deploy the MTA

All parts of the application can be deployed with a single command:

```yaml
pnpm deploy:dev
```

The `mta.yaml` file contains all relevant services and modules:

- The `capui5gptchat-router` module for a standalone approuter
- The `capui5gptchat-backend` module including the CAP backend
- The `capui5gptchat-frontend` module including the SAPUI5 frontend

The app will be accessible via managed approuter as well as via the standalone approuter.

## How to obtain Support

This content is provided "as-is" without warranties or conditions of any kind.

## License

Copyright (c) 2023 p36 GmbH. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
