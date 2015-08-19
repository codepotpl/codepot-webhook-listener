#!/usr/bin/env bash

cd /home/codepot/codepot-backend-production

git fetch -f;
git reset --hard origin/production;
git pull;
docker-compose build;
docker-compose stop;
docker-compose up -d;

sh /home/codepot/codepot-nginx-production/run.sh
bash ~/codepot-metrics/run.sh

refresh_elasticsearch() {
    sleep 30
    django_container=`docker ps | grep django_ | sed 's/ \{2,\}/,/g' | cut -d ',' -f 7 | head -n 1`
    docker exec -it $django_container python manage.py rebuild_index -v2 --remove --noinput
}
refresh_elasticsearch &