#!/bin/bash

# Install kubernetes and set config
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
curl -o config https://$GITHUB_ACCESS_TOKEN@raw.githubusercontent.com/GithubOrganization/MySecretInfrastructureRepo/master/.kube/config

mkdir ${HOME}/.kube
cp ./config ${HOME}/.kube/config

# Fill out missing params in kubectl config file
kubectl config set clusters.kubernetes-kube-group-dav.server "$KUBE_CLUSTER_SERVER"
kubectl config set clusters.kubernetes-kube-group-dav.certificate-authority-data "$KUBE_CLUSTER_CERTIFICATE"
kubectl config set users.kubernetes-kube-group-dav-admin.client-certificate-data "$KUBE_CLIENT_CERTIFICATE"
kubectl config set users.kubernetes-kube-group-dav-admin.client-key-data "$KUBE_CLIENT_KEY"
