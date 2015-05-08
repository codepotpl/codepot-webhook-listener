#!/usr/bin/env bash

cd /home/codepot/codepot-webclient-staging

git fetch -f;
git reset --hard origin/master;
docker build --tag codepot-webclient-staging .;
docker rm -f codepot-webclient-staging;
docker run -v `pwd`/dist:/app/dist --name codepot-webclient-staging -e API_HOST=http://api.codepot.pl:8080 codepot-webclient-staging;