# Запуск облачного хранилища на VPS

## 1. Подготовка GitHub (до деплоя)

1. В репозитории включены **Actions**; образы публикуются в **GHCR** при push в `main`.
2. Задайте переменные репозитория (**Settings → Secrets and variables → Actions → Variables**), чтобы фронт знал публичные URL (после появления домена или IP):

   - `VITE_API_URL` — например `http://ВАШ_IP:4000/api` или `https://домен.ru/api`
   - `VITE_WS_URL` — `ws://ВАШ_IP:4000` или `wss://домен.ru`

3. Снова запустите workflow (push или **Actions → CI → Run workflow**), чтобы пересобрался образ **cloud-client**.

## 2. ОС и Docker (Ubuntu 22.04/24.04)

Подключитесь по SSH и выполните:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${VERSION_CODENAME:-stable}") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

Выйдите из SSH и зайдите снова (или `newgrp docker`), чтобы группа `docker` применилась.

## 3. Firewall

Сначала разрешите **порт SSH**, иначе после `ufw enable` можно потерять доступ. Если SSH на **22**:

```bash
sudo ufw allow OpenSSH
```

Если SSH на **другом порту** (например `13882`):

```bash
sudo ufw allow 13882/tcp
```

Затем HTTP/HTTPS и API:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 4000/tcp
sudo ufw enable
```

Позже за **Nginx/Caddy** можно оставить только 80/443 и пробросить API на `127.0.0.1:4000` внутри сервера без публикации 4000 в интернет.

## 4. Вход в GHCR

Создайте [Personal Access Token (classic)](https://github.com/settings/tokens): права **read:packages** (и **write:packages**, если пушите не с CI).

```bash
echo ВАШ_TOKEN | docker login ghcr.io -u ВАШ_GITHUB_USERNAME --password-stdin
```

## 5. Каталог deploy на сервере

С репозитория скопируйте папку `deploy` на VPS (или клонируйте репозиторий и перейдите в `deploy`).

```bash
cd deploy
cp env.example .env
nano .env
```

Заполните `GHCR_PREFIX`, `CLIENT_URL`, `API_URL`, секреты JWT, почту.

Запуск:

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs -f --tail=50 api
```

Откройте в браузере: `http://IP_СЕРВЕРА` или ваш домен.

## 6. Домен и HTTPS (по желанию)

- В DNS у регистратора: запись **A** на IP VPS.
- Поставьте **Caddy** или **Nginx** + **Certbot**, проксируйте на `127.0.0.1:80` и при необходимости на API; обновите `CLIENT_URL`, `VITE_*`, пересоберите образ web в CI.

## 7. Резервное копирование

- Том **mongo_data** — данные MongoDB.
- Том **uploads_data** — загруженные файлы.

Команды бэкапа томов — в документации Docker (`docker run` с `--volumes-from` или бэкап каталога данных через volume inspect).

## 8. Автодеплой с GitHub Actions (пересборка образов + обновление на VPS)

После каждого **push в `main`** (или ручного **Run workflow** на `main`) CI публикует образы в GHCR, затем job **«CD — deploy on VPS»** подключается к серверу по SSH и выполняет `docker compose pull && up -d`.

**Важно:** условие `if` у job видит только **переменные репозитория**, а не переменные, заданные **только** внутри GitHub Environment. Поэтому имя окружения задаётся **репозиторной** переменной **`VPS_GITHUB_ENVIRONMENT`** (см. ниже), а `VPS_HOST`, порт и т.д. можно держать в [GitHub Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) — они подставятся в шаги job после привязки `environment:`.

### 8.1. SSH-ключ только для деплоя (на Mac или ПК)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/gh_actions_deploy -N ""
```

Публичный ключ добавьте на сервер:

```bash
ssh-copy-id -i ~/.ssh/gh_actions_deploy.pub -p ВАШ_SSH_ПОРТ root@ВАШ_IP
```

Либо вручную: содержимое `.pub` в файл `/root/.ssh/authorized_keys` на VPS.

**Приватный ключ** (`~/.ssh/gh_actions_deploy` без `.pub`) целиком скопируйте в буфер — он пойдёт в секрет GitHub.

### 8.2. Обязательная переменная репозитория (имя GitHub Environment)

**Settings → Secrets and variables → Actions → Variables** (уровень **репозитория**):

| Имя | Пример | Назначение |
|-----|--------|------------|
| **`VPS_GITHUB_ENVIRONMENT`** | см. ниже | **Точное** имя окружения из **Settings → Environments** (как в списке). Пока пусто — job деплоя **skipped**. |

Имя должно **совпадать** с тем, что отображается в списке окружений (например `production`, `github-pages` или своё имя при создании).

### 8.3. Переменные и секреты внутри GitHub Environment

В окружении с именем из **`VPS_GITHUB_ENVIRONMENT`** задайте:

| Имя | Пример |
|-----|--------|
| `VPS_HOST` | `79.137.226.78` |
| `VPS_PORT` | `13882` |
| `VPS_USER` | `root` |
| `VPS_DEPLOY_PATH` | `/opt/cloud_storage/deploy` |
| **`CLIENT_URL`** | Публичный URL фронта (например `http://IP` или `https://домен`) — **обязательно** для деплоя: workflow передаёт его на сервер перед `docker compose`, иначе в логах предупреждения и неверная подстановка образов. |

**Секреты в этом же Environment:**

| Имя | Назначение |
|-----|------------|
| `VPS_SSH_PRIVATE_KEY` | Полный приватный ключ SSH. |
| `GHCR_READ_TOKEN` | Опционально: PAT с **`read:packages`**, если образы в GHCR **приватные**. |

**Без GitHub Environment:** продублируйте `VPS_HOST`, порт, путь и секрет ключа в **Variables / Secrets репозитория** и удалите у job `deploy-vps` строку `environment:` в `.github/workflows/ci.yml` (или попросите подстроить workflow под ваш вариант).

Репозиторные **`VITE_API_URL`** и **`VITE_WS_URL`** по-прежнему нужны для сборки фронта.

### 8.4. Проверка

Сделайте пустой коммит и push в `main` или **Actions → CI → Run workflow** (ветка `main`). В логах job **«CD — deploy on VPS»** должны быть `docker compose pull` и успешный перезапуск контейнеров.

**Безопасность:** не используйте для деплоя тот же ключ, что и для личного входа; ограничьте ключ одной командой в `authorized_keys` (опция `command=` в `authorized_keys`) при желании — это уже настройка на стороне сервера.
