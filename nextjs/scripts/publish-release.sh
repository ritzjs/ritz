#!/bin/bash

git describe --exact-match

if [[ ! $? -eq 0 ]];then
  echo "Nothing to publish, exiting.."
  exit 0;
fi

if [[ -z "$NPM_TOKEN" ]];then
  echo "No NPM_TOKEN, exiting.."
  exit 0;
fi

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc

if [[ $(git describe --exact-match 2> /dev/null || :) =~ -main ]];
then
  echo "Publishing main"
  yarn run lerna publish from-git --npm-tag main --yes

  # Make sure to exit script with code 1 if publish failed
  if [[ ! $? -eq 0 ]];then
    exit 1;
  fi
else
  echo "Did not publish main"
fi

if [[ ! $(git describe --exact-match 2> /dev/null || :) =~ -main ]];then
  echo "Publishing stable"
  yarn run lerna publish from-git --yes

  # Make sure to exit script with code 1 if publish failed
  if [[ ! $? -eq 0 ]];then
    exit 1;
  fi
else
  echo "Did not publish stable"
fi
