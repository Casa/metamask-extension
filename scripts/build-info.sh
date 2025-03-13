#!/usr/bin/env bash

set -ex

commit=$(git log -1 | grep ^commit | awk '{print $2}')
branch=$(git name-rev $commit | grep "^$commit" | awk '{print $2}')

echo "{\"commit\": \"$commit\", \"branch\": \"$branch\"}" > build/info.json
