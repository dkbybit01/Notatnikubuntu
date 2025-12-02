#!/usr/bin/env bash
set -euo pipefail

# Skrypt: buduje obrazy, tworzy klaster kind (jeśli potrzeba), ładuje obrazy do klastra i aplikuje manifesty.


CLUSTER_NAME=${CLUSTER_NAME:-notatnik}
BACKEND_IMAGE="notatnik_backend:ci"
FRONTEND_IMAGE="notatnik_frontend:ci"

echo "1) Sprawdzam czy kind jest zainstalowany..."
if ! command -v kind >/dev/null 2>&1; then
  echo "kind nie znaleziony. Zainstaluj kind: https://kind.sigs.k8s.io/"
  exit 1
fi

echo "2) Tworzę klaster kind jeśli nie istnieje..."
if ! kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
  kind create cluster --name "${CLUSTER_NAME}"
else
  echo "Klaster ${CLUSTER_NAME} już istnieje."
fi

echo "3) Buduję obrazy Docker lokalnie..."
docker build -t "${BACKEND_IMAGE}" ./backend
docker build -t "${FRONTEND_IMAGE}" ./frontend

echo "4) Ładuję obrazy do klastra kind..."
kind load docker-image "${BACKEND_IMAGE}" --name "${CLUSTER_NAME}"
kind load docker-image "${FRONTEND_IMAGE}" --name "${CLUSTER_NAME}"

echo "5) Aplikuję manifesty Kubernetes (katalog k8s/)..."
kubectl apply -f k8s/

echo "6) Czekam na rollout deploymentów..."
kubectl rollout status deployment/backend-deployment --timeout=120s
kubectl rollout status deployment/frontend-deployment --timeout=120s

echo "Usługi i pody:"
kubectl get deployments,svc,pods -o wide

echo "Dostęp do frontendu (NodePort): http://<NODE_IP>:30080"
echo "Jeśli używasz localnego Dockera + kind, node IP zwykle to localhost (użyj curl http://localhost:30080)"

echo "Gotowe."