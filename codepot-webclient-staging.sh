#!/usr/bin/env bash

cd /home/codepot/codepot-webclient-staging

git fetch -f;
git reset --hard origin/master;
docker build --tag codepot-webclient-staging .;
docker rm -f codepot-webclient-staging;
docker run -v `pwd`/dist:/app/dist --name codepot-webclient-staging -e API_HOST="https://backend.codepot.pl:8443" -e BASE_URL="https://registration.codepot.pl:8443" codepot-webclient-staging;