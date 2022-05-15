FROM mcr.microsoft.com/playwright:bionic

MAINTAINER Utkarsh Dixit "utkarsh@crusher.dev"

WORKDIR /crusher

# Args and Environments
ARG SSH_PUBLIC_KEY
ENV NVM_DIR /usr/local/nvm
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH
ENV NODE_VERSION v14.15.5
ENV CRUSHER_ENV production
ENV SSH_PUBLIC_KEY $SSH_PUBLIC_KEY

RUN mkdir -p /usr/local/nvm && mkdir -p /var/run/sshd
RUN apt-get update \
    && apt-get install -y openssh-server unzip

# Install NVM
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.37.2/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"

# Install node dependenices
# RUN npm install -g npm pm2 concurrently @ffmpeg-installer/ffmpeg https://github.com/crusherdev/playwright-video.git#f7dececde258b07bdec207e4bb6869d389655704
RUN npm install -g concurrently pm2 node-fetch
RUN npm init -y && npm install pm2 dotenv playwright@1.14.0 patch-package source-map-support

# Add and copy necessary files
ADD docker/ee/test-runner/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
ADD ./patches/playwright+1.14.0.patch ./patches/playwright+1.14.0.patch
ADD ./ecosystem.config.sample.js ecosystem.config.js
ADD ./.env.sample .env
ADD ./ecosystem ecosystem
ADD ./output/test-runner/ packages/test-runner

# Run patches over node-packages and update docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN npx patch-package

CMD ["concurrently", "sh /usr/local/bin/docker-entrypoint.sh", "pm2-runtime ecosystem.config.js --only test-runner"]