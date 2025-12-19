

> **Purpose**: A pragmatic, production‑minded portfolio demonstrating API engineering, Kubernetes operations, observability, and infrastructure-as-code — optimized for clarity, maintainability, and real-world tradeoffs rather than novelty.

---

## High-Level Architecture

This project intentionally favors **simplicity first, extensibility second**. Everything runs on a single-node Kubernetes cluster (k3s on Raspberry Pi) with a clear migration path to AWS EC2 and beyond.

### Core Components
- **frontend-bff (Spring Boot, WebFlux)**
  - API gateway / BFF pattern
  - Aggregates downstream services
  - Exposes `/api/*` and `/actuator/*`
- **profile-service (Go)**
  - Simple, fast, single-responsibility service
  - Exposes `/v1/*` domain endpoints + `/metrics`
- **Kubernetes (k3s)**
  - Single-node cluster (edge-friendly)
  - Declarative manifests committed to Git
- **Observability**
  - Prometheus (scraping via ServiceMonitors)
  - Grafana dashboards (JVM, Go, cluster)
- **CI/CD**
  - GitHub Actions
  - GHCR images
  - Self-hosted runner on the Pi
- **Future**
  - Terraform → AWS EC2
  - Optional Postgres

---

## System Diagram

```mermaid
flowchart LR
  U[User Browser] -->|HTTP| I[Traefik Ingress]
  I -->|/ (UI + API)| B[frontend-bff\nSpring Boot (WebFlux)]

  B -->|REST /v1/*| P[profile-service\nGo]

  subgraph K8S[k3s / Kubernetes]
    I
    B
    P
  end

  B -->|/actuator/prometheus| PR[(Prometheus)]
  P -->|/metrics| PR
  PR --> G[Grafana]

  PR --- SM[ServiceMonitors]
```

---

## Design Philosophy

This project is guided by **practical engineering principles** rather than framework maximalism.

### Uncle Bob (Clean Architecture)
- Clear separation of concerns
- Services have **one reason to change**
- Infrastructure details are *outside* core logic

> "Good architecture allows major decisions to be deferred."

Applied here:
- Go service is framework-light
- Spring Boot BFF handles orchestration, not business rules

---

### Pragmatic Programmer
- Prefer **working software** over perfect abstractions
- Avoid speculative complexity
- Make tradeoffs explicit

> "You aren’t paid to write code, you’re paid to solve problems."

Applied here:
- Vanilla JS acceptable when Angular adds no immediate value
- Single-node k8s instead of premature EKS
- Focus on observability early

---

### How to Be an Awesome Architect (Key ideas, not dogma)
- Optimize for **change**, not initial perfection
- Systems should be explainable on a whiteboard
- Make constraints visible

Applied here:
- One EC2 / one k3s node is a *deliberate constraint*
- Clear upgrade path to multi-node / cloud

---

### Linus Torvalds (Pragmatism & Simplicity)
- Simple solutions scale better
- Debuggability matters
- Avoid cleverness

Applied here:
- Go for services that must be boring and fast
- Explicit health + metrics endpoints
- Minimal magic in CI/CD

---

## Observability & Operations

### Metrics Endpoints
- **frontend-bff**: `/actuator/prometheus`
- **profile-service**: `/metrics`

### Prometheus
- Installed via `kube-prometheus-stack`
- Discovers services via `ServiceMonitor`

### Grafana Access (Local / Secure)

**SSH Tunnel:**
```bash
ssh -L 3000:127.0.0.1:3000 -L 9090:127.0.0.1:9090 actions@rpi-server.local
```

Then access locally:
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090

---

### Kubernetes Port-Forward

```bash
kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
kubectl -n monitoring port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090
```

---

## Repo Structure

```bash
.github/workflows/     # CI/CD pipelines
k8s/
  base/                # Namespace, shared config
  frontend-bff/        # Deployment, Service, Ingress
  profile-service/     # Deployment, Service
  monitoring/          # Prometheus, ServiceMonitors
frontend-bff/          # Spring Boot BFF
profile-service/       # Go microservice
```

---

## CI/CD Summary

- **PRs**: build + test
- **Main / Tags**:
  - Build multi-arch images (amd64 / arm64)
  - Push to GHCR
  - Deploy to k3s via self-hosted runner

No hidden state. Git is the source of truth.

---

## Final Notes

This portfolio intentionally demonstrates:
- Engineering judgment under constraints
- Clean separation between application and infrastructure
- Comfort across Go, Java, Kubernetes, CI/CD, and observability

> *"Make it work. Make it right. Make it fast."* — Kent Beck


## Roadmap & TODO

> This section documents intentional next steps. Many items are *deliberately deferred* to keep the initial implementation simple and explainable.

---

### 🏗 Infrastructure (Terraform / AWS)

- [ ] Terraform: Provision single EC2 (Ubuntu LTS)
  - [ ] Security Group (SSH restricted, HTTP/HTTPS open)
  - [ ] User data bootstrap (Docker, k3s, Helm)
  - [ ] Attach IAM Role (least privilege)
- [ ] Terraform remote state (S3 + DynamoDB lock)
- [ ] Parameterize environment (staging / prod)
- [ ] Optional: split into Terraform modules (`network`, `compute`, `k8s`)
- [ ] Document migration path to multi-node / EKS

---

### ☁️ Kubernetes / Platform

- [ ] Migrate k3s manifests to cloud-ready equivalents
- [ ] Add resource limits & requests to all pods
- [ ] PodDisruptionBudgets
- [ ] NetworkPolicies (namespace isolation)
- [ ] Secrets management strategy (SOPS / AWS Secrets Manager)
- [ ] Blue/Green or Canary deployment strategy
- [ ] Liveness/readiness tuning under load

---

### 🔐 Security & Compliance (SOC 2–oriented)

- [ ] Enforce HTTPS (ALB / Traefik + cert-manager)
- [ ] Rotate credentials (GHCR, DB, tokens)
- [ ] Principle of Least Privilege for IAM
- [ ] Audit logging (API, auth, infra changes)
- [ ] Image scanning (Trivy / Grype)
- [ ] Dependency vulnerability scanning
- [ ] Define security controls mapping (SOC 2 CC series)
- [ ] Threat modeling (STRIDE-lite)

---

### 🗄 Database (PostgreSQL)

- [ ] Provision Postgres (Docker → RDS migration path)
- [ ] Schema versioning (Flyway / Liquibase)
- [ ] Read/write separation strategy (future)
- [ ] Backup & restore automation
- [ ] Connection pooling
- [ ] DB metrics in Grafana
- [ ] Data access abstraction boundaries

---

### 🎨 Frontend

- [ ] Replace vanilla JS with Angular app
- [ ] Typed API client generation
- [ ] State management strategy
- [ ] Build → static assets → CDN (S3 + CloudFront)
- [ ] Frontend performance budgets
- [ ] Error boundaries & observability hooks

---

### LLM / Personality Project (Exploratory)

> Experimental project for documentation, human context, and AI-assisted systems thinking.

- [ ] Define personality dimensions:
  - Sour (skeptical / adversarial)
  - Sweet (empathetic / cooperative)
  - Umami (balanced / systems thinker)
  - Bitter (critical / risk-aware)
  - Savory (execution-focused)
- [ ] Collect structured prompts & responses
- [ ] LLM-based assessment & synthesis
- [ ] Contextualize results for:
  - Team dynamics
  - Architecture decisions
  - Communication styles
- [ ] Ethics & bias documentation
- [ ] Optional UI for visualization

---

### 📊 Observability & Reliability

- [ ] SLO / SLA definitions
- [ ] Error budget tracking
- [ ] Alerting rules (Prometheus / Alertmanager)
- [ ] Log aggregation & tracing
- [ ] Chaos testing (failure injection)
- [ ] Runbooks for common incidents

---

### 🔄 CI/CD Enhancements

- [ ] Branch protection & required checks
- [ ] Preview environments for PRs
- [ ] Automated rollback on failed deploy
- [ ] Supply chain security (provenance, signing)
- [ ] Release notes automation
- [ ] GitOps alignment (optional)

---

### 📚 Documentation & Communication

- [ ] Architecture Decision Records (ADRs)
- [ ] Threat model & trust boundaries
- [ ] Onboarding guide (new engineer < 1 hour)
- [ ] Operational runbooks
- [ ] Cost awareness & optimization notes
- [ ] “Why this architecture” narrative

---

### 🧠 Meta / Engineering Excellence

- [ ] Explicit tradeoff documentation
- [ ] Complexity budget tracking
- [ ] Periodic design reviews (self-imposed)
- [ ] Measure change failure rate
- [ ] Evaluate long-term maintainability
- [ ] Refactor only when justified by data

---

> **Design Principle**  
> _Simple systems that can evolve beat complex systems that impress._  
> Everything here is optional — but intentional.

