# Deploy Three-Tier DevSecOps Kubernetes Project on AWS EKS with ArgoCD, Prometheus, Grafana.

---
### Pre-requisite
```bash
-  region :    us-east-1  
-  create s3 bucket  :   <Bucket-Name>
- install helm use powershell
```
```bash
choco install kubernetes-helm -y
helm version
```
---

**after creating bucket update the bucket name in files**
```bash
- cd .\Terraform-Eks-With-AddOns\01_VPC_terraform-manifests\c1-versions.tf
- cd .\Terraform-Eks-With-AddOns\02_EKS_terraform-manifests_with_addons\c1-versions.tf
- cd .\Terraform-Eks-With-AddOns\02_EKS_terraform-manifests_with_addons\c3_remote-state.tf
```


---
### Step-1 (Clone the repo)
```bash
git clone https://github.com/sanketM1996/Eks-prometheus-grafana-argocd.git
```
---

### Step-2 (Terraform Cmd)
- cd .\Terraform-Eks-With-AddOns\02_EKS_terraform-manifests_with_addons\
- cd .\Terraform-Eks-With-AddOns\01_VPC_terraform-manifests\

```bash
terraform init
terraform plan
terraform apply
```
---
### Step-3 (kube-context)
```bash
set the context
```
---

### Step-4 (Apply-Manifest )

```bash
kubectl appy -f .\namespace.yaml
kubectl appy -f .\database\
kubectl appy -f .\backend\
kubectl appy -f .\backend-ingress\
kubectl appy -f .\frontend\
kubectl appy -f .\frontend-ingress\
```
**to check svc and pods and troublshoot cmd**
```bash
kubectl get ns
kubectl get all -n three-tier
kubectl get pods -n three-tier
kubectl get pods -n three-tier -o wide
kubectl get svc -n three-tier
kubectl describe svc <service-name> -n three-tier
kubectl logs <pod-name> -n three-tier 
kubectl logs deployment/<deployment-name> -n three-tier
kubectl describe pod <pod-name> -n three-tier
kubectl exec -it <pod-name> -n three-tier -- /bin/sh
```
*note:-apply in sequence wait for 3-4 min the Lode Balancer is Created*


---
### Step-5 (setup Prometheus and Grafana)
- Add Helm Stable Chart Repository
```bash
helm repo add stable https://charts.helm.sh/stable
```
- Add Prometheus Community Helm Repository
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```
- Create a Namespace for monitoring
```bash
kubectl create namespace monitoring
```
- Install Prometheus with Grafana using Helm
```bash
helm install stable prometheus-community/kube-prometheus-stack -n monitoring
```
- Check the Prometheus pods:
```bash
kubectl get pods -n monitoring
```
- Check the Prometheus services:
```bash
kubectl get svc -n monitoring
```
 **Grafana is deployed along with Prometheus, there is no need for separate Grafana installation**

- Expose Prometheus and Grafana to External Access
```bash
kubectl edit svc stable-kube-prometheus-sta-prometheus -n monitoring
```
**see cluster ip change it with LoadBalancer use :9090 port after LB**
- Similarly, edit the Grafana service
```bash
kubectl edit svc stable-grafana -n monitoring
```
*Save the changes and use the load balancer IP in your browser to access Grafana*


---
- Accessing Grafana
```bash
to get grafahana password 
kubectl get secret stable-grafana -n monitoring -o jsonpath="{.data.admin-password}"

This will return a Base64-encoded string, for example:

YWRtaW4xMjM0NQ==

Copy that value and decode it using PowerShell:

[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("c1drMGVPREViajRBOVc1VVpEWDY0N2V3V3ZnR1BMWmoybjR3eGtLRA=="))
```

### Grafana Setup and Import Kubernetes Dashboard

1. Open the Grafana URL in your browser.

2. On the Welcome screen, click **"Complete setup"** or **"Add your first data source"**.

3. Select **Prometheus** as the data source.

4. In the **Connection** section, enter the Prometheus URL:

   http://<PROMETHEUS-LOAD-BALANCER-DNS>:9090

   Example:
   http://a1b2c3d4e5f6.us-east-1.elb.amazonaws.com:9090

5. Click **Save & Test** (or **Test and Connect**) to verify the connection.

6. After the data source is successfully configured, navigate to:

   Dashboards → New → Import

7. Enter the Dashboard ID:

   15661

   (Kubernetes / Compute Resources / Cluster)

8. Click **Load**.

9. Select your **Prometheus** data source from the dropdown.

10. Click **Import**.

11. The Kubernetes Cluster Monitoring Dashboard will be imported and start displaying metrics from your cluster.
---
### Step-5 (ArgoCD Installation & Application Deployment)

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.4.7/manifests/install.yaml
kubectl get pods -n argocd
kubectl get svc -n argocd

```
**expose the argoCD server as LoadBalancer**
```bash
kubectl patch svc argocd-server -n argocd -p "{\"spec\":{\"type\":\"LoadBalancer\"}}"
```
*You can validate whether the Load Balancer is created by going to the AWS Console load balancers.*
Get the Argo CD Admin Password

For Windows PowerShell:

```bash
$encoded = kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}"
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($encoded))
```
or
```bash
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String((kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}")))
```
## Deploy Database Application Using ArgoCD

### Add Git Repository

1. Navigate to **Repositories**.
2. Click **Create Repository Using HTTPS**.
3. Enter the following details:

```text
Type           : Git
Project        : default
Repository URL : <git-repository-url>
Username       : <github-username>
Password       : <github-PAT>
```

4. Click **Connect** and then **Save**.

### Create ArgoCD Application
### for Db 1
1. Navigate to **Applications**.
2. Click **New App**.
3. Configure the application:

```text
Application Name : database
Project Name     : default
Sync Policy      : Automatic

Source:
  Repository URL : <git-repository-url>
  Path           : Kubernetes-Manifest/database/

Destination:
  Cluster URL    : https://kubernetes.default.svc
  Namespace      : three-tier
```

4. Click **Create**.

### Verify Deployment

```bash
kubectl get pods -n three-tier
kubectl get svc -n three-tier
argocd app get database
```

Expected Result:

```text
Sync Status   : Synced
Health Status : Healthy
```
### for backend
1. Navigate to **Applications**.
2. Click **New App**.
3. Configure the application:

```text
Application Name : backend
Project Name     : default
Sync Policy      : Automatic

Source:
  Repository URL : <git-repository-url>
  Path           : Kubernetes-Manifest/backend/

Destination:
  Cluster URL    : https://kubernetes.default.svc
  Namespace      : three-tier
```

4. Click **Create**.

### for backend-ingress
1. Navigate to **Applications**.
2. Click **New App**.
3. Configure the application:

```text
Application Name : backend-ingress
Project Name     : default
Sync Policy      : Automatic

Source:
  Repository URL : <git-repository-url>
  Path           : Kubernetes-Manifest/backend-ingress/

Destination:
  Cluster URL    : https://kubernetes.default.svc
  Namespace      : three-tier
```

4. Click **Create**.

### Same for frontend and frontend-ingress
```bash
Application Name : backend-ingress
Path           : Kubernetes-Manifest/backend-ingress/
change only this file
```
---

4. Click **Create**.

### Same for frontend and frontend-ingress
```bash
Application Name : backend-ingress
Path           : Kubernetes-Manifest/backend-ingress/
change only this file
```
---

### Images Version for frontend
```bash
sanketmahajan/todoapp_frontend:4.0.1
sanketmahajan/todoapp_frontend:6.0.0
```
---
### Once done delete the all resources

```bash
kubectl delete ns three-tier
kubectl delete ns argocd
kubectl delete ns monitoring
delete terraform resources
terraform destroy (vpc & eks)


```
---
### 📄 See also: [Troubleshooting Guide](./TroubleShootingCmd.md)
---

# ⭐ PROJECT OWNER ⭐


**Sanket Mahajan**

DevOps Engineer | AWS | Kubernetes | Terraform | Jenkins

GitHub: https://github.com/sanketM1996


---








