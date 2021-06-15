FROM mcr.microsoft.com/playwright:focal

MAINTAINER Utkarsh Dixit "utkarsh@crusher.dev"

# === INSTALL NVM ====
ENV NVM_DIR /usr/local/nvm
RUN mkdir -p "$NVM_DIR"
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.37.2/install.sh | bash
ENV NODE_VERSION v12.19.1
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

# === INSTALL pm2 ===
RUN npm install -g npm
RUN npm install -g yarn
RUN npm install pm2 -g
RUN npm install -g concurrently

# === INSTALL mongodb ===
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get update && apt-get install -y mongodb-org
RUN service mongod status
RUN service mongod start
RUN mongo --eval 'db.runCommand({ connectionStatus: 1 })'

# === INSTALL redis ===
RUN apt install redis-server

# === ADD crusher ===
ADD . ./crusher
WORKDIR /crusher

# === INSTALL node_modules ===
RUN yarn install