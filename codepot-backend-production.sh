#!/usr/bin/env bash

cd /home/codepot/codepot-backend-production

git fetch -f;
git reset --hard origin/production;
docker-compose build;
docker-compose up -d;

sh /home/codepot/codepot-nginx/run.sh