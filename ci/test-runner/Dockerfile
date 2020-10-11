################################################
# Compile with:
#     sudo docker build -t microsoft/playwright:bionic -f Dockerfile.bionic .
#
# Run with:
#     sudo docker run -d -p --rm --name playwright microsoft/playwright:bionic
#
#################################################

FROM ubuntu:bionic

# 1. Install node12
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs

# 1.01 . Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update && apt install yarn

# 2. Install WebKit dependencies
RUN apt-get install -y libwoff1 \
                       libopus0 \
                       libwebp6 \
                       libwebpdemux2 \
                       libenchant1c2a \
                       libgudev-1.0-0 \
                       libsecret-1-0 \
                       libhyphen0 \
                       libgdk-pixbuf2.0-0 \
                       libegl1 \
                       libnotify4 \
                       libxslt1.1 \
                       libevent-2.1-6 \
                       libgles2 \
                       libvpx5

#RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo

RUN apt-get update

# 3. Install Chromium dependencies

RUN apt-get install -y libnss3 \
                       libxss1 \
                       libasound2 \
                       fonts-noto-color-emoji

RUN apt-get update

RUN apt-get install -y fonts-indic \
                       fonts-noto \
                       fonts-noto-cjk

RUN apt-get update

RUN apt-get install -y git

# 4. Install Firefox dependencies
RUN apt-get install -y libdbus-glib-1-2 \
                       libxt6

RUN apt-get install -y libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev

RUN apt-get install -y libgstreamer1.0-0 gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav gstreamer1.0-doc gstreamer1.0-tools gstreamer1.0-x gstreamer1.0-alsa gstreamer1.0-gl gstreamer1.0-gtk3 gstreamer1.0-qt5 gstreamer1.0-pulseaudio

# 5. Install ffmpeg to bring in audio and video codecs necessary for playing videos in Firefox.
RUN apt-get install -y ffmpeg

# 6. Add user so we don't need --no-sandbox in Chromium
RUN groupadd -r pwuser && useradd -r -g pwuser -G audio,video pwuser \
    && mkdir -p /home/pwuser/Downloads \
    && chown -R pwuser:pwuser /home/pwuser

# 7. (Optional) Install XVFB if there's a need to run browsers in headful mode
RUN apt-get install -y xvfb

# 8. Add codebase
ADD ../../packages/test-runner/ /code/

WORKDIR /code

# Give permission to user to edit it
RUN chown -R pwuser:pwuser ./

RUN sysctl -w kernel.unprivileged_userns_clone=1

# Run everything after as non-privileged user.
USER pwuser

RUN yarn install

EXPOSE 80

ENTRYPOINT ["npm"]
CMD ["run", "-s", "start"]
