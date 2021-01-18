FROM mcr.microsoft.com/playwright:bionic

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

ADD ./ ./crusher

WORKDIR /crusher

# 2. Give permission to user to edit it
RUN chown -R pwuser:pwuser ./

# 3. Run everything after as non-privileged user.
USER pwuser

RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.37.2/install.sh | bash
ENV NODE_VERSION v12.19.1
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

RUN yarn

RUN npm install -g npm
RUN npm install pm2 -g

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "test-runner"]
