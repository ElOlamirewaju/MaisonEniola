#!/bin/sh
# Dump every review (pending and approved) from the REVIEWS KV namespace to reviews-export.json.
# Usage: sh scripts/export-reviews.sh   (needs a wrangler login on this account)
NS=1e11c2d197a542749480984f94108422
echo "[" > reviews-export.json
first=1
for key in $(npx --yes wrangler@latest kv key list --namespace-id "$NS" 2>/dev/null | python3 -c 'import sys,json; [print(k["name"]) for k in json.load(sys.stdin)]' | grep -E '^(pending|approved):'); do
  [ $first = 1 ] || echo "," >> reviews-export.json; first=0
  npx --yes wrangler@latest kv key get --namespace-id "$NS" "$key" 2>/dev/null >> reviews-export.json
done
echo "]" >> reviews-export.json
echo "written reviews-export.json"
