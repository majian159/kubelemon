# Get the currently used golang install path (in GOPATH/bin, unless GOBIN is set)
ifeq (,$(shell go env GOBIN))
GOBIN=$(shell go env GOPATH)/bin
else
GOBIN=$(shell go env GOBIN)
endif

build-apiserver: swagger-gen
	go build -o _bin/apiserver ./cmd/apiserver/main.go

swagger-gen:
	$(GOBIN)/swag init -g pkg/apiserver/router.go

air:
	$(GOBIN)/air -c .air.linux.conf

run-apiserver:
	go run cmd/apiserver/main.go

run-dashboard:
	cd dashboard && yarn && yarn start
