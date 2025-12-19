package com.noctem.portfolio.api;
// This BFF does orchestration only.
// Business logic lives downstream to avoid tight coupling.

import com.noctem.portfolio.client.ProfileClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class BffController {

    private final ProfileClient profileClient;

    public BffController(ProfileClient profileClient) {
        this.profileClient = profileClient;
    }

    @GetMapping("/version")
    public Mono<ResponseEntity<String>> version() {
        return profileClient.version().map(ResponseEntity::ok);
    }

    @GetMapping("/status")
    public Mono<ResponseEntity<String>> status() {
        return profileClient.status().map(ResponseEntity::ok);
    }

    @GetMapping("/projects")
    public Mono<ResponseEntity<String>> projects() {
        return profileClient.projects().map(ResponseEntity::ok);
    }

    @GetMapping("/experience")
    public Mono<ResponseEntity<String>> experience() {
        return profileClient.experience().map(ResponseEntity::ok);
    }
}
