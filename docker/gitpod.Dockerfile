FROM gitpod/workspace-full-vnc:latest

    # Install custom tools, runtime, etc.
RUN sudo apt-get update \
    # window manager
    && sudo apt-get install -y jwm \
    # electron
    && sudo apt-get install -y libgtk-3-0 libnss3 libasound2 libgbm1 \
    # native-keymap
    && sudo apt-get install -y libx11-dev libxkbfile-dev \
    # keytar
    && sudo apt-get install -y libsecret-1-dev \
    && sudo rm -rf /var/lib/apt/lists/*
    && sudo apt-get install -y mysql-server mysql-client
