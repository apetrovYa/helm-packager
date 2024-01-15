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

ci: test lint prettier build

.PHONY: test
test:
> @npm run test

.PHONY: lint
lint:
> @npm run lint

.PHONY: prettier
prettier:
> @npm run prettier

.PHONY: changelog
changelog:
> @docker run -v "${PWD}":/workdir quay.io/git-chglog/git-chglog -o CHANGELOG.md
