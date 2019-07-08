while ! nc -z 127.0.0.1 3000; echo "wait backend"; do sleep 3; done
nginx -g daemon off;