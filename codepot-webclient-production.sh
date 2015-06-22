#!/usr/bin/env bash

cd /home/codepot/codepot-webclient-production

git fetch -f;
git reset --hard origin/master;
docker build --tag codepot-webclient-production .;
docker rm -f codepot-webclient-production;
docker run -v `pwd`/dist:/app/dist --name codepot-webclient-production -e API_HOST="https://backend.codepot.pl/" -e BASE_URL="https://registration.codepot.pl/" codepot-webclient-production;