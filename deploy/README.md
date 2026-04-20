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

## 8. Автодеплой с GitHub Actions

После **push в `main`** (или **Run workflow**) CI публикует образы в GHCR, затем job **«CD — deploy on VPS»** по SSH выполняет скрипт [`deploy/scripts/remote-docker-deploy.sh`](scripts/remote-docker-deploy.sh) (pull, up, prune).

**Полный список переменных и секретов** — в **[`deploy/docs/GITHUB_ENVIRONMENT.md`](docs/GITHUB_ENVIRONMENT.md)** (один источник правды; список имён для `appleboy envs` в workflow должен с ним совпадать).

Кратко: в **Variables репозитория** задайте **`VPS_GITHUB_ENVIRONMENT`** — точное имя [GitHub Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) (пока пусто — деплой не запускается: условие `if` у job не видит переменные только внутри Environment). В этом окружении — `VPS_HOST`, `VPS_USER`, `VPS_PORT`, `VPS_DEPLOY_PATH`, URL-ы приложения, секрет SSH и JWT и т.д. Репозиторные **`VITE_API_URL`** / **`VITE_WS_URL`** нужны для сборки фронта.

### 8.1. SSH-ключ только для деплоя

```bash
ssh-keygen -t ed25519 -f ~/.ssh/gh_actions_deploy -N ""
ssh-copy-id -i ~/.ssh/gh_actions_deploy.pub -p ВАШ_SSH_ПОРТ root@ВАШ_IP
```

Приватный ключ (файл без `.pub`) → секрет **`VPS_SSH_PRIVATE_KEY`** в том же Environment.

### 8.2. Проверка

Push в `main` или **Actions → CI → Run workflow**. В логах деплоя — успешный `docker compose pull` / `up`.

**Безопасность:** отдельный ключ для деплоя, не тот же, что для личного SSH; при желании ограничьте ключ в `authorized_keys` (`command=`).
