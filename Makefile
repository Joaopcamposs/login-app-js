export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

# docker_pull:
# 	docker pull joaopcamposs/sistema_blanca:blanca_frontend

# docker_stop:
# 	docker rm -f blanca_frontend || true

# docker_clean:
# 	docker system prune -f

# build:
# 	docker build -t joaopcamposs/sistema_blanca:blanca_frontend .

# run:
# 	docker run --name blanca_frontend -p 3000:3000 -d --restart always joaopcamposs/sistema_blanca:blanca_frontend

# stop:
# 	docker rm -f blanca_frontend

# logs:
# 	docker logs blanca_frontend

format:
	npm run lint --fix
