FROM zenika/alpine-chrome:with-playwright

## install docker dependecy
#ENV CRYPTOGRAPHY_DONT_BUILD_RUST=1
#
#RUN apk add cmd:pip3
#
#RUN apk update && \
#    apk add --no-cache python3 && \
#    apk add --no-cache --virtual .docker-compose-deps python3-dev libffi-dev openssl-dev gcc libc-dev make && \
#    pip3 install wheel && \
#    pip3 install docker-compose && \
#    apk del .docker-compose-deps

RUN mkdir crusher && mkdir crusher/crusher-app && mkdir crusher/crusher-server && mkdir crusher/test-runner && mkdir crusher/video-processor
ADD ./packages/crusher-app/.next ./crusher/crusher-app/.next
ADD ./packages/crusher-server/dist ./crusher/crusher-server/dist
ADD ./packages/test-runner/dist ./crusher/test-runner/dist
ADD ./packages/test-runner/dist ./crusher/test-runner/dist

RUN echo npm root -g

WORKDIR "crusher"

CMD ["docker", "run", "hello-world"]