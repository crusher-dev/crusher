FROM mcr.microsoft.com/playwright:bionic

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

ADD ./ ./crusher

WORKDIR /crusher

# 2. Give permission to user to edit it
RUN chown -R pwuser:pwuser ./

# 3. Run everything after as non-privileged user.
USER pwuser

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
RUN export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

RUN nvm install 12.19.1
RUN nvm use 12.19.1
RUN yarn

RUN npm install -g npm
RUN npm install pm2 -g

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "test-runner"]
