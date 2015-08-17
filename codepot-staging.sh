#!/usr/bin/env bash

cd /home/codepot/codepot-staging

git fetch -f;
git reset --hard origin/master;
git pull;
docker build --tag codepot-staging .;
docker rm -f codepot-staging;
docker run -d --name codepot-staging -e CDPT_HOST="https://codepot.pl:8080/" codepot-staging;

sh /home/codepot/codepot-nginx-aws/run.sh