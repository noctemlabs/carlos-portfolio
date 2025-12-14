package http

import (
	"encoding/json"
	"net/http"
	"os"
	"time"
)

type VersionResp struct {
	Service   string `json:"service"`
	Version   string `json:"version"`
	GitSHA    string `json:"gitSha"`
	BuiltAt   string `json:"builtAt"`
	Timestamp string `json:"timestamp"`
}

func VersionHandler(w http.ResponseWriter, r *http.Request) {
	resp := VersionResp{
		Service:   "profile-service",
		Version:   getenv("VERSION", "dev"),
		GitSHA:    getenv("GIT_SHA", "unknown"),
		BuiltAt:   getenv("BUILD_TIME", "unknown"),
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
