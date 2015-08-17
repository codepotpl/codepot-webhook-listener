#!/usr/bin/env bash

cd /home/codepot/codepot-production

git fetch -f;
git reset --hard origin/production;
git pull;
docker build --tag codepot-production .;
docker rm -f codepot-production;
docker run -d --name codepot-production -e CDPT_HOST="https://codepot.pl/" codepot-production;

sh /home/codepot/codepot-nginx-aws/run.sh
