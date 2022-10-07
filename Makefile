GOLANGCI_LINT_VERSION := "v1.49.0"
GINKGO_IMAGE_NAME := "crypto-org-chain/cronos-jsonrpc-reverse-proxy/ginkgo"
APP_IMAGE_NAME := "crypto-org-chain/cronos-jsonrpc-reverse-proxy"
MIGRATE_IMAGE_NAME := "migrate/migrate:4"

# Use lazy assignment(`=`) such that command existence are evaluated when used
FORGE = $(shell command -v forge)
GOLANGCI_LINT = $(shell command -v golangci-lint)
GINKGO = $(shell command -v ginkgo)
DOCKER = $(shell command -v docker)
DOCKER_COMPOSE = $(shell command -v docker-compose)

.PHONY: has-forge
has-forge:
ifndef FORGE
	@echo "Golang not found. Please install go and try again."
	@exit 1
endif

.PHONY: install-forge
install-forge:
ifndef FORGE
	curl -L https://foundry.paradigm.xyz | bash
	foundryup
endif

.PHONY: build-contracts
build-contracts: install-forge has-forge
	cd contracts && forge build

.PHONY: dangerous-clean-ui
dangerous-clean-ui:
	rm -r ui/src/contracts

.PHONY: prepare-ui
prepare-ui: build-contracts
	mkdir ui/src/contracts
	cp -r contracts/out/ ui/src/contracts/

