#!/usr/bin/env bash

# NOTE: This script runs with yarn scripts to populate environment variables

set -ex

app_env="${APP_ENV:-dev}"

aws lambda invoke --cli-binary-format raw-in-base64-out --payload "{\"path\":\"/api/application/status\",\"httpMethod\":\"GET\"}" --function-name casa-$app_env-$npm_package_name build/response.json

cat build/response.json | jq .
