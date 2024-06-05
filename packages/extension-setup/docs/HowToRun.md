# How to run
The Extension Setup project is dedicated to seamlessly integrating the api-extension module with the commercetools api-extensions platform. Its primary responsibility lies in attaching and registering the api-extension module to ensure smooth functionality within the commercetools environment.

- [How to run](#how-to-run)
  - [Environment variables](#environment-variables)
    - [Required environment variables](#required-environment-variables)
  - [Running](#running)
    - [Locally](#locally)

## Environment variables

```console
CTP_PROJECT_KEY=
CTP_CLIENT_SECRET=
CTP_CLIENT_ID=
CTP_AUTH_URL=
CTP_API_URL=

CT_EXTENSION_URL={EXTENSION_URL}/ct-nuvei/open-order
CT_EXTENSION_AUTH_USER=
CT_EXTENSION_AUTH_PASSWORD=
```

### Required environment variables

| Group           | Name                         | Content                                                            |
| --------------- | ---------------------------- | ------------------------------------------------------------------ |
| `commercetools` | `CTP_PROJECT_KEY`            | The project key in commercetools                                   |
| `commercetools` | `CTP_CLIENT_SECRET`          | OAuth 2.0 `client_secret` and can be used to obtain a token.       |
| `commercetools` | `CTP_CLIENT_ID`              | OAuth 2.0 `client_id` and can be used to obtain a token.           |
| `commercetools` | `CTP_AUTH_URL`               | The commercetools OAuth 2.0 service is hosted at that URL.         |
| `commercetools` | `CT_EXTENSION_URL`           | The public URL of the extension api module.                        |
| `commercetools` | `CT_EXTENSION_AUTH_USER`     | The commercetools auth user.                                       |
| `commercetools` | `CT_EXTENSION_AUTH_PASSWORD` | The commercetools auth password.                                   |

> **_NOTE:_** The environment variables should be written as key-value pairs in a `.env` file. Have a look at the `.env.example` file in the root of the module for example.

## Running

### Locally

From the repository root, run the following command:

```bash
yarn workspace @nuvei/extension-setup start
```

Or you can run the following command from the `packages/extension-setup` directory:

```bash
yarn start
```
