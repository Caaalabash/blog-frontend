#!/bin/sh
while ! nc -v -z localhost 3000; echo "wait backend"; do sleep 3; done
nginx -g "daemon off;"