#!/usr/bin/env bash
# Original script: https://github.com/vishnubob/wait-for-it

hostport="$1"
shift

timeout="${WAITFORIT_TIMEOUT:-15}"
strict=0

while [[ "$1" != "" ]]; do
  case $1 in
    --timeout ) shift
                timeout=$1
                ;;
    --strict ) strict=1
               ;;
    -- )       shift
               break
               ;;
  esac
  shift
done

IFS=':' read -r host port <<< "$hostport"

echo "⏳ Esperando a $host:$port por $timeout segundos..."

for i in $(seq $timeout); do
  if nc -z "$host" "$port"; then
    echo "✅ Servicio $host:$port está disponible"
    exec "$@"
    exit 0
  fi
  sleep 1
done

echo "❌ Timeout esperando a $host:$port"
if [[ $strict -eq 1 ]]; then
  exit 1
fi

exec "$@"
