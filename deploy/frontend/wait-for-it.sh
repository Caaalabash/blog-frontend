#!/bin/sh
while ! nc -z -v localhost 3000
do
  echo "wait backend"
  sleep 3
done
echo "done"
nginx -g "daemon off;"