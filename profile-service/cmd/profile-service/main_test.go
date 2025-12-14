package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"
)

// Minimal router builder for tests.
// Copy the routes from main() so we can test without starting a real server.
func newRouterForTest() http.Handler {
	r := chi.NewRouter()
	r.Get("/v1/status", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]any{"status": "ok"})
	})
	return r
}

func TestStatusEndpoint(t *testing.T) {
	handler := newRouterForTest()

	req := httptest.NewRequest(http.MethodGet, "/v1/status", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rec.Code)
	}

	ct := rec.Header().Get("Content-Type")
	if ct == "" {
		t.Fatalf("expected Content-Type header set")
	}
}
