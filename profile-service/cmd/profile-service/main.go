package main

// NOTE: This service intentionally avoids framework-heavy abstractions.
// The goal is predictable behavior, fast cold starts, and debuggability.

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type VersionResp struct {
	Service   string `json:"service"`
	Version   string `json:"version"`
	GitSHA    string `json:"gitSha"`
	BuiltAt   string `json:"builtAt"`
	Timestamp string `json:"timestamp"`
}

type Project struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	TechStack   []string `json:"techStack"`
	Link        string   `json:"link,omitempty"`
}

type Experience struct {
	Company string   `json:"company"`
	Role    string   `json:"role"`
	Period  string   `json:"period"`
	Bullets []string `json:"bullets"`
}

const serviceName = "profile-service"

func main() {
	port := getenv("PORT", "8081")

	r := chi.NewRouter()
	r.Use(requestLogger)

	r.Get("/metrics", func(w http.ResponseWriter, r *http.Request) {
		promhttp.Handler().ServeHTTP(w, r)
	})

	r.Get("/v1/version", versionHandler)

	r.Get("/v1/status", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]any{
			"service":   serviceName,
			"status":    "ok",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	r.Get("/v1/projects", func(w http.ResponseWriter, r *http.Request) {
		projects := []Project{
			{
				ID:          "noctem-portfolio-platform",
				Name:        "@noctem/carlos-portfolio",
				Description: "Polyglot portfolio platform demo: Go API + Spring Boot BFF + React/TS/Tailwind, deployed on k8s (k3s/EKS).",
				TechStack:   []string{"Go", "Spring Boot", "React + TS + Tailwind", "Kubernetes", "Terraform", "AWS"},
			},
		}
		writeJSON(w, http.StatusOK, projects)
	})

	r.Get("/v1/experience", func(w http.ResponseWriter, r *http.Request) {
		exp := []Experience{
			{
				Company: "HealthTrust",
				Role:    "Developer III (Contract)",
				Period:  "Feb 2024 - Jun 2024",
				Bullets: []string{
					"Analyzed ~26 services to identify fragmentation and duplication.",
					"Standardized API boundaries and proposed modular REST/GraphQL services.",
				},
			},
			{
				Company: "Ulta Beauty",
				Role:    "Lead Sr. Developer",
				Period:  "Jul 2022 - Mar 2023",
				Bullets: []string{
					"Modernized monolith into semantically versioned microservices.",
					"Improved deployment workflow and engineering practices.",
				},
			},
		}
		writeJSON(w, http.StatusOK, exp)
	})

	addr := ":" + port
	log.Printf("%s listening on %s", serviceName, addr)
	log.Fatal(http.ListenAndServe(addr, r))
}

func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func versionHandler(w http.ResponseWriter, r *http.Request) {
	resp := VersionResp{
		Service:   serviceName,
		Version:   getenv("VERSION", "dev"),
		GitSHA:    getenv("GIT_SHA", "unknown"),
		BuiltAt:   getenv("BUILD_TIME", "unknown"),
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
	w.Header().Set("Content-Type", "application/json")
	writeJSON(w, http.StatusOK, resp)
}
