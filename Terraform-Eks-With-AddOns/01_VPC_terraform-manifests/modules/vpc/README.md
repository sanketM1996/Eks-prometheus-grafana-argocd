# Terraform VPC Module – Single NAT Gateway Setup



---

## Features

- Provisions a **custom VPC** with user-defined CIDR block
- Public & private subnets across **up to 3 Availability Zones**
- Creates **a single NAT Gateway** for private subnets (cost-effective)
- Manages route tables and subnet associations
- Exports clean outputs to integrate with EC2, RDS, EKS etc.

---

## File Structure

| File                        | Purpose |
|-----------------------------|---------|
| `main.tf`                   | Core resources: VPC, subnets, NAT gateway, routes |
| `variables.tf`              | Input variables for customization |
| `outputs.tf`                | Output values to expose module data |
| `datasources-and-locals.tf` | AZ lookups and subnet CIDR logic |
| `README.md`                 | Module usage and documentation |

---

## Usage

```hcl
module "vpc_single_nat" {
  source = "../modules/vpc" # or use your Git repo path

  environment_name = var.environment_name
  vpc_cidr         = var.vpc_cidr
  subnet_newbits   = var.subnet_newbits
  tags = var.tags
}

> ⚠️ This module auto-detects up to **3 availability zones** using `data.aws_availability_zones`.

---

## Outputs

| Output Name          | Description                       |
| -------------------- | --------------------------------- |
| `vpc_id`             | ID of the created VPC             |
| `public_subnet_ids`  | List of public subnet IDs         |
| `private_subnet_ids` | List of private subnet IDs        |
| `public_subnet_map`  | Map of public subnets by AZ name  |

> You can use these outputs to pass subnet IDs to other modules (e.g., EC2, RDS, ALB, EKS).

---

## Best Practices

* Create **one NAT Gateway** per region when cost savings matter.
* Use `terraform.tfvars` or environment-specific tfvars files to reuse this module across `dev`, `test`, `prod`.
* All **private subnets**, regardless of AZ, should route outbound traffic through the **single NAT Gateway**.
*  Only **public subnets** should route through the **Internet Gateway (IGW)**.
* Enable remote state backend for team collaboration.

---

# ⭐ PROJECT OWNER ⭐


**Sanket Mahajan**

DevOps Engineer | AWS | Kubernetes | Terraform | Jenkins

GitHub: https://github.com/sanketM1996

---

