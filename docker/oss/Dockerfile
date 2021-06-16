FROM docker:dind

# install docker dependecy
ENV CRYPTOGRAPHY_DONT_BUILD_RUST=1

RUN apk add cmd:pip3
RUN apk update && \
    apk add --no-cache python3 && \
    apk add --no-cache --virtual .docker-compose-deps python3-dev libffi-dev openssl-dev gcc libc-dev make && \
    pip3 install wheel && \
    pip3 install docker-compose && \
    apk del .docker-compose-deps

ADD ../../docker/opensource ./crusher

WORKDIR "crusher"

CMD ["docker", "run", "hello-world"]