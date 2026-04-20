# GitHub Actions: переменные и секреты для деплоя

Один источник правды для job **«CD — deploy on VPS»** в `.github/workflows/ci.yml`.

## Репозиторий (Variables)

| Имя | Назначение |
|-----|------------|
| **`VPS_GITHUB_ENVIRONMENT`** | Имя GitHub Environment (как в **Settings → Environments**). Пусто → деплой не запускается. |
| **`VITE_API_URL`**, **`VITE_WS_URL`** | URL для **сборки** фронта в CI/CD (браузер → API / WebSocket). |

## GitHub Environment (имя = значение `VPS_GITHUB_ENVIRONMENT`)

### Подключение и пути

| Имя | Тип | Пример |
|-----|-----|--------|
| `VPS_HOST` | Variable | `79.137.226.78` |
| `VPS_PORT` | Variable | `13882` |
| `VPS_USER` | Variable | `root` |
| `VPS_DEPLOY_PATH` | Variable | `/opt/cloud_storage/deploy` |
| `VPS_SSH_PRIVATE_KEY` | **Secret** | Приватный ключ SSH (BEGIN…END) |

### Приложение (те же имена, что в `deploy/docker-compose.yml` → `api.environment`)

| Имя | Тип | Примечание |
|-----|-----|------------|
| `CLIENT_URL` | Variable | URL фронта (CORS). |
| `API_URL` | Variable | Публичный URL API (письма, редиректы). |
| `DEPLOY_PORT` | Variable | По умолчанию в workflow: `4000`. |
| `ACCESS_TOKEN_SECRET` | **Secret** | JWT access. |
| `REFRESH_TOKEN_SECRET` | **Secret** | JWT refresh. |
| `MONGODB_URI` | **Secret** | Не задан → на сервере подставится `mongodb://mongo:27017/cloud_storage`. |
| `SKIP_MAIL` | Variable | По умолчанию в workflow: `true`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` | Variable | Можно пустыми. |
| `SMTP_PASSWORD` | **Secret** | |

### Docker Registry (опционально)

| Имя | Тип | Примечание |
|-----|-----|------------|
| `GHCR_READ_TOKEN` | **Secret** | PAT `read:packages`, если образы в GHCR **приватные**. |

## Ручной запуск на VPS без Actions

Используйте `deploy/env.example` → `.env` рядом с `deploy/docker-compose.yml` и команды из `deploy/README.md`.

## Связь с кодом workflow

- Список имён в **`envs`** job `deploy-vps` в `.github/workflows/ci.yml` должен совпадать с переменными, которые читает **`deploy/scripts/remote-docker-deploy.sh`** (сейчас: `GHCR_TOKEN`, `GHCR_USER`, `GHCR_PREFIX`, `PORT`, `API_URL`, `CLIENT_URL`, `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `SKIP_MAIL`, `SMTP_*`, `DEPLOY_PATH`).
- Префикс образов **`GHCR_PREFIX`** в деплое берётся из **`needs.push-images.outputs.ghcr_prefix`**, а не вычисляется второй раз в том же pipeline.
