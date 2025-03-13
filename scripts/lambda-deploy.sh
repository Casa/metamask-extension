#!/usr/bin/env bash

# NOTE: This script runs with yarn scripts to populate environment variables

set -ex

app_env="${APP_ENV:-dev}"

aws lambda update-function-code --zip-file fileb://build/lambda.zip --function-name casa-$app_env-$npm_package_name
