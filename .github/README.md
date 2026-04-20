# GitHub Actions

| Файл | Назначение |
|------|------------|
| [`workflows/ci.yml`](workflows/ci.yml) | CI (client lint/build, server, compose build), CD (push в GHCR), деплой на VPS по SSH. |

**Деплой:** переменные и секреты описаны в [`deploy/docs/GITHUB_ENVIRONMENT.md`](../deploy/docs/GITHUB_ENVIRONMENT.md).

**Префикс образов GHCR** вычисляется один раз в job `push-images` и передаётся в `deploy-vps` через `needs.push-images.outputs.ghcr_prefix`.
