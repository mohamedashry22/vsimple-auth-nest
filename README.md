# Monorepo (Nest Backend + React Frontend)

apps/
  backend/
  frontend-react/

ops/ - Prometheus/Grafana

-username : admin
-password: admin

# Run with Docker Compose:
  docker compose up --build

# Remove cache
  docker-compose build --no-cache

# macOS Troubleshooting

run: macos
export DOCKER_BUILDKIT_PROGRESS=plain
export BUILDKIT_PROGRESS=plain
docker-compose build --no-cache