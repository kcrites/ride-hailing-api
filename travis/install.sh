#!/bin/bash

set -e

# Install kubernetes and set config

if [ ! -d "~/google-cloud-sdk/bin" ]
then
    rm -rf ~/google-cloud-sdk
    export CLOUDSDK_CORE_DISABLE_PROMPTS=1
    curl https://sdk.cloud.google.com | bash >/dev/null
fi
source ~/google-cloud-sdk/path.bash.inc
gcloud --quiet version
gcloud --quiet components update
gcloud --quiet components update kubectl

echo $GCLOUD_SERVICE_KEY | base64 --decode -i > ~/gcloud-service-key.json
cat ~/gcloud-service-key.json
gcloud auth activate-service-account --key-file ~/gcloud-service-key.json

gcloud --quiet container clusters get-credentials staging --zone us-east1-c --project dav-ride-hailing

kubectl config view
kubectl config current-context

# Install ksonnet
mkdir -p ~/tmp/ks
curl -L -o ~/tmp/ks.tar.gz https://github.com/ksonnet/ksonnet/releases/download/v0.13.0/ks_0.13.0_linux_amd64.tar.gz
tar xzf ~/tmp/ks.tar.gz -C ~/tmp/ks --strip-components=1
sudo cp ~/tmp/ks/ks /usr/local/bin
rm -rf ~/tmp/ks ~/tmp/ks.tar.gz

cat ~/.kube/config
kubectl version
