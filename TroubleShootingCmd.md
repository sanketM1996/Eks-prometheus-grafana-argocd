
## Troubleshooting

### Pods Not Starting / CrashLoopBackOff
```bash
# Check pod status and events
kubectl get pods -n three-tier
kubectl describe pod <pod-name> -n three-tier

# View live logs
kubectl logs <pod-name> -n three-tier

# View previous container logs (if pod restarted)
kubectl logs <pod-name> -n three-tier --previous

# Check resource limits (OOMKilled etc.)
kubectl top pods -n three-tier
```

---

#### ImagePullBackOff / ErrImagePull
```bash
# Confirm image name and tag in deployment manifest
kubectl describe pod <pod-name> -n three-tier | grep -i image

# Check if the node can reach the registry
kubectl exec -it <running-pod> -n three-tier -- curl -I https://registry-1.docker.io

# If using a private registry, verify the imagePullSecret exists
kubectl get secret -n three-tier
```

---

#### Service / Load Balancer Not Accessible
```bash
# Check service type and external IP
kubectl get svc -n three-tier

# Describe to see events and endpoint bindings
kubectl describe svc <service-name> -n three-tier

# Confirm endpoints are populated (means pods are matched)
kubectl get endpoints <service-name> -n three-tier

# Check ingress rules
kubectl get ingress -n three-tier
kubectl describe ingress <ingress-name> -n three-tier
```
*Note: AWS Load Balancer provisioning can take 3–5 minutes. If EXTERNAL-IP shows `<pending>`, wait and re-run `kubectl get svc`.*

---

#### Database Connection Issues
```bash
# Check database pod is running
kubectl get pods -n three-tier | grep -i db

# Test connectivity from backend pod
kubectl exec -it <backend-pod> -n three-tier -- /bin/sh
# Inside the shell: nc -zv <db-service-name> <port>

# Check database service DNS resolution
kubectl exec -it <backend-pod> -n three-tier -- nslookup <db-service-name>

# Inspect DB environment variables in backend pod
kubectl exec -it <backend-pod> -n three-tier -- env | grep -i db
```

---

#### Namespace / RBAC Issues
```bash
# Verify namespace exists
kubectl get ns

# Check service accounts
kubectl get serviceaccounts -n three-tier

# Check events for permission errors
kubectl get events -n three-tier --sort-by='.lastTimestamp'
```

---

#### Prometheus / Grafana Not Accessible
```bash
# Check all monitoring pods are running
kubectl get pods -n monitoring

# Check service types (should be LoadBalancer after edit)
kubectl get svc -n monitoring

# Restart Prometheus stack if pods are stuck
kubectl rollout restart deployment -n monitoring

# Re-fetch Grafana admin password
kubectl get secret stable-grafana -n monitoring -o jsonpath="{.data.admin-password}"
```

---

#### ArgoCD Application Sync Errors
```bash
# Check ArgoCD pods are healthy
kubectl get pods -n argocd

# Get app sync status
argocd app get <app-name>

# Force a manual sync
argocd app sync <app-name>

# Hard refresh (ignores cache)
argocd app get <app-name> --hard-refresh

# View recent ArgoCD events
kubectl get events -n argocd --sort-by='.lastTimestamp'
```

---

#### Terraform / EKS Issues
```bash
# Refresh kubeconfig if kubectl commands fail
aws eks update-kubeconfig --region us-east-1 --name <cluster-name>

# Verify cluster is active
aws eks describe-cluster --region us-east-1 --name <cluster-name> --query "cluster.status"

# List node groups and their status
aws eks list-nodegroups --cluster-name <cluster-name> --region us-east-1

# Check node readiness
kubectl get nodes
kubectl describe node <node-name>
```

---

#### General Debugging Commands
```bash
# Get all resources across all namespaces
kubectl get all -A

# Watch pods in real time
kubectl get pods -n three-tier -w

# Check cluster-wide events sorted by time
kubectl get events -A --sort-by='.lastTimestamp'

# Run a temporary debug pod (busybox)
kubectl run debug --image=busybox --restart=Never -n three-tier --rm -it -- /bin/sh

# Check node resource usage
kubectl top nodes
```
---
# Mysql
```bash
Step 1: Get the DB pod name
kubectl get pods -n three-tier | grep -i db

Step 2: Exec into the pod
kubectl exec -it <db-pod-name> -n three-tier -- /bin/bash

Step 3: Login to MySQL (inside the pod)
mysql -u root -p

Step 4: MySQL commands (inside MySQL shell)
SHOW DATABASES;
USE <database-name>;
SHOW TABLES;
SELECT * FROM <table-name>;

Step 5: Exit MySQL and pod
exit
exit

If you don't know the MySQL root password
Check env variables inside the pod
kubectl exec -it <db-pod-name> -n three-tier -- env | grep -i mysql

Or decode it from the Kubernetes secret
kubectl get secret <secret-name> -n three-tier -o jsonpath="{.data.MYSQL_ROOT_PASSWORD}" | base64 --decode
```