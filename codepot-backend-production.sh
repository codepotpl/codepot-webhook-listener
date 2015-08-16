#!/usr/bin/env bash

cd /home/codepot/codepot-backend-production

git fetch -f;
git reset --hard origin/production;
git pull;
docker-compose build;
docker-compose up -d;

sh /home/codepot/codepot-nginx-production/run.sh
bash ~/codepot-metrics/run.sh
