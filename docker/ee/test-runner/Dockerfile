FROM mcr.microsoft.com/playwright:bionic

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

ARG SSH_PUBLIC_KEY

ADD ./ ./crusher

WORKDIR /crusher
RUN mkdir -p /usr/local/nvm
RUN mkdir -p /var/run/sshd
RUN apt-get update \
    && apt-get install -y openssh-server \
    && mkdir -p /var/run/sshd

COPY docker/test-runner/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN export SSH_PUBLIC_KEY="$SSH_PUBLIC_KEY"

ENV NVM_DIR /usr/local/nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.37.2/install.sh | bash
ENV NODE_VERSION v12.19.1
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

RUN npm install -g npm
RUN npm install pm2 -g
RUN npm install -g concurrently
RUN npm install -g playwright@^1.7.1 @ffmpeg-installer/ffmpeg https://github.com/crusherdev/playwright-video.git#f7dececde258b07bdec207e4bb6869d389655704

CMD ["concurrently", "sh /usr/local/bin/docker-entrypoint.sh", "pm2-runtime ecosystem.config.js --only test-runner"]
