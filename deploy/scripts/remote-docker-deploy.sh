#!/usr/bin/env bash
# Выполняется на VPS через appleboy/ssh-action (script_path).
# Переменные задаются в .github/workflows/ci.yml (job deploy-vps → env / envs).
#
# Обязательно снаружи: GHCR_PREFIX, PORT, API_URL, CLIENT_URL,
# ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SKIP_MAIL,
# SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, GHCR_USER.
# Опционально: GHCR_TOKEN (docker login), MONGODB_URI, DEPLOY_PATH.

set -eo pipefail

export GHCR_PREFIX PORT API_URL CLIENT_URL ACCESS_TOKEN_SECRET REFRESH_TOKEN_SECRET
export SKIP_MAIL SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASSWORD
export MONGODB_URI="${MONGODB_URI:-mongodb://mongo:27017/cloud_storage}"

DEPLOY_PATH="${DEPLOY_PATH:-/opt/cloud_storage/deploy}"

if [[ -n "${GHCR_TOKEN:-}" ]]; then
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
fi

cd "$DEPLOY_PATH"
docker compose pull
docker compose up -d --remove-orphans
docker image prune -f
