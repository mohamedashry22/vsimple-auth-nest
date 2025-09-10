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

<p align="center">
  <img src="https://github.com/user-attachments/assets/471e7745-4791-4d27-bf28-ed882d51d8f5" alt="Screenshot 1" width="100%" />
  <img src="https://github.com/user-attachments/assets/30e91ac6-a5a3-48f9-8bbb-ddfd606019a3" alt="Screenshot 2" width="100%" />
</p>
