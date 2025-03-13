#!/usr/bin/env bash

# NOTE: This script runs with yarn scripts to populate environment variables

set -ex

package_name=$(echo $npm_package_name | tr '-' '_')
user=dev_$package_name

export PGPORT=5678

# Create the root user
psql -U postgres -c "CREATE USER $user WITH password 'development'"

# Create the database
psql -U postgres -c "CREATE DATABASE $package_name WITH owner $user"
