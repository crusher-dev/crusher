FROM golang:1.14

ENV CGO_ENABLED 0
ENV REPO github.com/awslabs/amazon-ecr-credential-helper/ecr-login/cli/docker-credential-ecr-login

RUN go get -u $REPO

RUN rm /go/bin/docker-credential-ecr-login

RUN go build \
  -o /go/bin/docker-credential-ecr-login \
  /go/src/$REPO

WORKDIR /go/bin/
