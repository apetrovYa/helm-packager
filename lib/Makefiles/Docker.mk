SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

ifeq ($(origin .RECIPEPREFIX), undefined)
  $(error This Make does not support .RECIPEPREFIX. Please use GNU Make 4.0 or later)
endif
.RECIPEPREFIX = >

CONTAINER_IMAGE_REGISTRY=quay.io/andov_go
CONTAINER_IMAGE_NAME=helm-packager
CONTAINER_IMAGE_VERSION=v1.0.0-alpha.2
CONTAINER_IMAGE_FULL_NAME=${CONTAINER_IMAGE_REGISTRY}/${CONTAINER_IMAGE_NAME}:${CONTAINER_IMAGE_VERSION}
DOCKERFILE_PATH=${PWD}/Dockerfile

all: docker.image

docker.image:
> @docker buildx build --progress=plain --platform linux/amd64,linux/arm64 -f ${DOCKERFILE_PATH} -t ${CONTAINER_IMAGE_FULL_NAME} -t ${CONTAINER_IMAGE_REGISTRY}/${CONTAINER_IMAGE_NAME}:latest --push .

docker.image.local:
> @docker build --no-cache --progress=plain  --load -t ${CONTAINER_IMAGE_FULL_NAME} -f ${DOCKERFILE_PATH} .
