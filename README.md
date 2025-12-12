# Carlos Portfolio — Cloud-Native API Engineering Platform

This repository contains a complete cloud-native microservices portfolio built to demonstrate senior-level API engineering, Kubernetes orchestration, Infrastructure-as-Code, observability, and modern DevOps practices.

The platform includes:

- A **Golang microservice** (REST + gRPC)
- A **Java Spring Boot microservice** (REST API w/ Actuator)
- A **React/Tailwind frontend** deployed through Kubernetes ingress
- A **PostgreSQL database** running as a StatefulSet
- A **local k3s Kubernetes cluster** running on a Raspberry Pi 4
- **CI/CD pipelines** using GitHub Actions with Docker + GHCR
- **Terraform-provisioned AWS infrastructure** (EC2, VPC, IAM)
- **Traefik or Kong API Gateway** routing into the cluster
- **Observability stack** (Prometheus + Grafana)

---

# 🏗 Architecture Overview

```
<architecture diagram placeholder>
```

---

# ⚙️ Tech Stack

### **Backend**
- Golang
- Java / Spring Boot 3
- REST, gRPC, Protobuf
- Postgres (StatefulSet)

### **Frontend**
- React (Vite)
- TailwindCSS
- Served via Kubernetes ingress

### **Containers & Orchestration**
- Docker
- k3s (Kubernetes)
- Deployments, Services, Ingress, ConfigMaps, Secrets

### **API Gateway**
- Traefik or Kong OSS

### **Infrastructure-as-Code**
- Terraform (AWS EC2, IAM, VPC, S3)

### **Observability**
- Prometheus
- Grafana

### **CI/CD**
- GitHub Actions
- GHCR registry

---

# 📊 Observability

Prometheus scrapes:
- Go metrics
- Spring Boot Actuator
- Node exporter

Grafana shows:
- Latency
- Error rate
- Throughput

---

# 📜 License
MIT

