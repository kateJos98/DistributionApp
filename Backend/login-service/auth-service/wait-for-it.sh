#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

host="$1"
port="$2"

shift 2

timeout=15

echo "Waiting for $host:$port to become available..."

for i in $(seq $timeout); do
    nc -z "$host" "$port" > /dev/null 2>&1
    result=$?
    if [ $result -eq 0 ]; then
        echo "$host:$port is available after $i seconds."
        exec "$@"
        exit 0
    fi
    sleep 1
done

echo "Timeout waiting for $host:$port"
exit 1
