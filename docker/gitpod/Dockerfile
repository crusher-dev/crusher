FROM gitpod/workspace-full-vnc:latest

# Dazzle does not rebuild a layer until one of its lines are changed. Increase this counter to rebuild this layer.
ENV TRIGGER_REBUILD=5
ENV PGWORKSPACE="/workspace/.pgsql"
ENV PGDATA="$PGWORKSPACE/data"

# Install PostgreSQL
RUN sudo install-packages postgresql-12 postgresql-contrib-12

# Setup PostgreSQL server for user gitpod
ENV PATH="/usr/lib/postgresql/12/bin:$PATH"

SHELL ["/usr/bin/bash", "-c"]
RUN PGDATA="${PGDATA//\/workspace/$HOME}" \
 && mkdir -p ~/.pg_ctl/bin ~/.pg_ctl/sockets $PGDATA \
 && initdb -D $PGDATA \
 && printf '#!/bin/bash\npg_ctl -D $PGDATA -l ~/.pg_ctl/log -o "-k ~/.pg_ctl/sockets" start\n' > ~/.pg_ctl/bin/pg_start \
 && printf '#!/bin/bash\npg_ctl -D $PGDATA -l ~/.pg_ctl/log -o "-k ~/.pg_ctl/sockets" stop\n' > ~/.pg_ctl/bin/pg_stop \
 && chmod +x ~/.pg_ctl/bin/* \
 && printf '%s\n' '# Auto-start PostgreSQL server' \
                  "test ! -e \$PGWORKSPACE && test -e ${PGDATA%/data} && mv ${PGDATA%/data} /workspace" \
                  # Making the /workspace dir just to make sure it doesnt fail in docker env in case
                  '[[ $(pg_ctl status | grep PID) ]] || pg_start > /dev/null' > ~/.bashrc.d/200-postgresql-launch \
 # Just to emulate the workspace-session behavior within docker-build env
 && sudo bash -c 'mkdir -p /workspace && chown -hR gitpod:gitpod /workspace'
ENV PATH="$HOME/.pg_ctl/bin:$PATH"
ENV DATABASE_URL="postgresql://gitpod@localhost"
ENV PGHOSTADDR="127.0.0.1"
ENV PGDATABASE="postgres"

# Install custom tools, redis, runtime, etc.
RUN sudo apt-get update \
    # window manager
    && sudo apt-get install -y jwm \
    # electron
    && sudo apt-get install -y libgtk-3-0 libnss3 libasound2 libgbm1 \
    # native-keymap
    && sudo apt-get install -y libx11-dev libxkbfile-dev \
    # keytar
    && sudo apt-get install -y libsecret-1-dev
 
USER gitpod

# Install Redis.
RUN sudo apt-get update  && sudo apt-get install -y  redis-server redis-tools  && sudo rm -rf /var/lib/apt/lists/*

RUN npm install -g pm2