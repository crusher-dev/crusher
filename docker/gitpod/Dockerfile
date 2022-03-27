FROM ./Dockerfile.base

ENV TRIGGER_REBUILD=5

# Install Redis.
RUN sudo apt-get update  && sudo apt-get install -y  redis-server redis-tools  && sudo rm -rf /var/lib/apt/lists/*

RUN npm install -g pm2