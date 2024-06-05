# First stage - Install dependencies and build

ARG package_name

FROM node:20-slim AS nuvei.base

FROM nuvei.base AS builder

ARG package_name
ENV package_name=$package_name
ENV DEBIAN_FRONTEND=noninteractive
#RUN npm install -g pnpm

# if package name is not "dmn-api" or "extension-api", fail with a message
RUN if [ "$package_name" != "dmn-api" ] && [ "$package_name" != "extension-api" ]; then echo "Invalid package name: $package_name, allowed values are 'dmn-api' and 'extension-api'"; exit 1; fi

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY ./${package_name}/package.json ./${package_name}/
COPY ./packages ./packages
RUN yarn install && yarn cache clean

COPY ./${package_name}/ ./${package_name}

RUN yarn workspaces run build

#Second stage - Production
FROM nuvei.base AS production

ARG NODE_ENV
ARG package_name

ENV package_name=$package_name
ENV NODE_ENV=${NODE_ENV:-production}

WORKDIR /usr/src/app/

COPY --from=builder /usr/src/app/${package_name}/build ./${package_name}/build
COPY --from=builder /usr/src/app/${package_name}/package.json ./${package_name}

COPY --from=builder /usr/src/app/packages/commercetools-client/build ./packages/commercetools-client/build
COPY --from=builder /usr/src/app/packages/commercetools-client/package.json ./packages/commercetools-client

COPY --from=builder /usr/src/app/packages/nuvei-client/build ./packages/nuvei-client/build
COPY --from=builder /usr/src/app/packages/nuvei-client/package.json ./packages/nuvei-client

COPY --from=builder /usr/src/app/packages/util/build ./packages/util/build
COPY --from=builder /usr/src/app/packages/util/package.json ./packages/util

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/package.json ./

CMD yarn workspace @nuvei/${package_name} run start
