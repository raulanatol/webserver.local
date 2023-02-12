#!/usr/bin/env bash

set -eu

function error() {
  echo "🚨 Error: $1"
  exit 1
}

if [[ $# != 1 ]]; then
  error "Please specify the version number: npm run finish-release 10.0.1"
fi

yarn test

VERSION_PARAM=$1
BRANCH=$(git rev-parse --abbrev-ref HEAD)

function change_version() {
  npm version "$VERSION_PARAM"
}

function verify_main_branch() {
  if [[ ${BRANCH} == 'main' ]]; then
    echo "Main branch"
  else
    error "Invalid branch name ${BRANCH}"
  fi
}

function verify_uncommitted_changes() {
  if [[ $(git status --porcelain) ]]; then
    error "There are uncommitted changes in the working tree."
  fi
}

function test() {
  yarn test
}

function publish() {
  npm publish --access public
}

verify_uncommitted_changes
verify_main_branch
change_version
test
publish
git push --tags
