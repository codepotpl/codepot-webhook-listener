#!/usr/bin/env bash

cd /home/codepot/codepot-backend-staging

git fetch -f;
git reset --hard origin/master;
git pull;
docker-compose build;
docker-compose up -d;

sh /home/codepot/codepot-nginx-staging/run.sh