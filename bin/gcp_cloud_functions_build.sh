#!/bin/bash
set -e
# Check if at least one argument is provided
if [ $# -lt 1 ]; then
  echo "Usage: $0 <PACKAGE_NAME> [INSTALL_AND_BUILD] [RUN_BUILD]"
  echo "--- PACKAGE_NAME: 'dmn-api' or 'extension-api'"
  echo "--- INSTALL_AND_BUILD: 'true' or 'false' (optional) - runs install and build if true"
  echo "--- RUN_BUILD: 'true' or 'false' (optional) - runs the package on build if true"
  exit 1
fi

# Validate PACKAGE_NAME
PACKAGE_NAME=$1
if [ "$PACKAGE_NAME" != "dmn-api" ] && [ "$PACKAGE_NAME" != "extension-api" ]; then
  echo "Error: PACKAGE_NAME must be either 'dmn-api' or 'extension-api'."
  exit 1
fi

# Check for INSTALL_AND_BUILD argument
INSTALL_AND_BUILD=${2:-false}
RUN_BUILD=${3:-false}

echo "Deploying package $PACKAGE_NAME..."
echo "Install and build: $INSTALL_AND_BUILD"
echo "Run on build: $RUN_BUILD"
echo "-----------------------------"
# Define the temporary directory
BUILD_DIR="./gcp_deploy_build"
echo "----> Cleaning up build directory..."
rm -rf $BUILD_DIR

# Step 1: Optionally install dependencies and build the package
if [ "$INSTALL_AND_BUILD" = "true" ]; then
  echo "----> Installing and building packages..."
  rm -rf **/node_modules
  yarn install
  yarn workspaces run build
fi

# Step 2: Setup temporary directory
mkdir -p $BUILD_DIR/$PACKAGE_NAME
mkdir -p $BUILD_DIR/packages/commercetools-client
mkdir -p $BUILD_DIR/packages/nuvei-client
mkdir -p $BUILD_DIR/packages/util
mkdir -p $BUILD_DIR/packages/ts-config # do this only because GCP does not run "yarn install --production"

echo "----> Copying package files to temporary directory..."
rsync -a $PACKAGE_NAME/package.json $BUILD_DIR/$PACKAGE_NAME/
rsync -a $PACKAGE_NAME/build/ $BUILD_DIR/$PACKAGE_NAME/build

echo "----> Copying dependencies files to temporary directory..."
rsync -a ./packages/commercetools-client/build/ $BUILD_DIR/packages/commercetools-client/build
rsync -a ./packages/commercetools-client/package.json $BUILD_DIR/packages/commercetools-client/
rsync -a ./packages/nuvei-client/build/ $BUILD_DIR/packages/nuvei-client/build
rsync -a ./packages/nuvei-client/package.json $BUILD_DIR/packages/nuvei-client/
rsync -a ./packages/util/build/ $BUILD_DIR/packages/util/build
rsync -a ./packages/util/package.json $BUILD_DIR/packages/util/
rsync -a ./packages/ts-config/ $BUILD_DIR/packages/ts-config
rsync -a ./yarn.lock $BUILD_DIR/
rsync -a ./package.json $BUILD_DIR/

touch $BUILD_DIR/index.js
echo "export * from './$PACKAGE_NAME/build/index.js';" > $BUILD_DIR/index.js

# Step 3: Change directory to BUILD_DIR for any further operations
cd $BUILD_DIR

  echo "----> Testing package $PACKAGE_NAME install..."
  yarn install --non-interactive --prefer-offline
  echo "----> Running 'node --check index.js'..."
  node --check index.js

if [ "$RUN_BUILD" = "true" ]; then
  echo "----> Running 'node index.js'..."
  node index.js
fi

echo "----> Package $PACKAGE_NAME is ready for deployment."
