FROM mcr.microsoft.com/playwright:bionic

MAINTAINER Utkarsh Dixit "utkarshdix02@gmail.com"

RUN npm install -g npm
RUN npm install pm2 -g

ADD ./ ./crusher

WORKDIR /crusher

# 2. Give permission to user to edit it
RUN chown -R pwuser:pwuser ./

# 3. Run everything after as non-privileged user.
USER pwuser

RUN yarn

CMD ["pm2-runtime", "ecosystem.config.js", "--only", "test-runner"]
