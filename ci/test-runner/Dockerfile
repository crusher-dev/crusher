FROM mcr.microsoft.com/playwright:bionic

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

ADD ./ ./crusher

WORKDIR /crusher

# 2. Give permission to user to edit it
RUN chown -R pwuser:pwuser ./

# 3. Run everything after as non-privileged user.
USER pwuser

ENV NVM_DIR ~/.nvm
ENV NODE_VERSION 12.19.1
# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

RUN yarn

RUN npm install -g npm
RUN npm install pm2 -g

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "test-runner"]
