#!/bin/bash

# Check the number of arguments provided
if [ "$#" -ne 2 ] && [ "$#" -ne 3 ]; then
    echo "Usage: $0 <github-username> <github-token> [namespace]"
    exit 1
fi

# Assign arguments to variables
USERNAME=$1
TOKEN=$2

# Set the namespace; default to "default" if not provided
NAMESPACE=${3:-default}

# Create the Kubernetes secret
kubectl create secret docker-registry ghcr-secret \
    --docker-server=ghcr.io \
    --docker-username=$USERNAME \
    --docker-password=$TOKEN \
    --namespace $NAMESPACE

echo "K8s: Secret created in namespace $NAMESPACE"
