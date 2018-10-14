VERSION=$(shell ./getVersion.js)
MINIKUBE_IP=$(shell minikube ip)

FORCE:

build: TIMESTAMP=$(shell date +%y%m%d-%H%M -u)
build: FORCE
	@echo Building with timestamp $(TIMESTAMP)
	docker build ../. -f Dockerfile -t ridehailing/api:$(TIMESTAMP)
	docker tag ridehailing/api:$(TIMESTAMP) ridehailing/api:latest
	docker push ridehailing/api:$(TIMESTAMP)

deploy-dev: FORCE
	ks env set dev --server=https://$(MINIKUBE_IP):8443 && ks apply dev --ext-str IMAGE_VERSION=$(VERSION)

deploy-prod: FORCE
	ks apply prod --ext-str IMAGE_VERSION=$(VERSION)

remove-dev: FORCE
	ks env set dev --server=https://$(MINIKUBE_IP):8443 && ks delete dev --ext-str IMAGE_VERSION=latest

remove-prod: FORCE
	ks delete prod --ext-str IMAGE_VERSION=latest
