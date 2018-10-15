#!/bin/bash

# Install kubernetes and set config
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

mkdir ~/.kube
cp ./config ~/.kube/config

# Fill out missing params in kubectl config file
kubectl config set clusters.gke_dav-ride-hailing_us-east1-c_staging.server "$KUBE_CLUSTER_SERVER"
kubectl config set clusters.gke_dav-ride-hailing_us-east1-c_staging.certificate-authority-data "$KUBE_CLUSTER_CERTIFICATE"
kubectl config set users.gke_dav-ride-hailing_us-east1-c_staging.client-certificate-data "$KUBE_CLIENT_CERTIFICATE"
kubectl config set users.gke_dav-ride-hailing_us-east1-c_staging.client-key-data "$KUBE_CLIENT_KEY"

# Install ksonnet
mkdir -p ~/tmp/ks
curl -L -o ~/tmp/ks.tar.gz https://github.com/ksonnet/ksonnet/releases/download/v0.13.0/ks_0.13.0_linux_amd64.tar.gz
tar xzf ~/tmp/ks.tar.gz -C ~/tmp/ks --strip-components=1
sudo cp ~/tmp/ks/ks /usr/local/bin
rm -rf ~/tmp/ks ~/tmp/ks.tar.gz

cat ~/.kube/config
kubectl version
