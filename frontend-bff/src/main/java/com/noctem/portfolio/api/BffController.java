package com.noctem.portfolio.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class BffController {

    private final WebClient profile;

    public BffController(@Value("${profile.baseUrl}") String baseUrl) {
        this.profile = WebClient.builder().baseUrl(baseUrl).build();
    }

    @GetMapping("/status")
    public Mono<ResponseEntity<String>> status() {
        return profile.get().uri("/v1/status")
                .retrieve().bodyToMono(String.class)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/projects")
    public Mono<ResponseEntity<String>> projects() {
        return profile.get().uri("/v1/projects")
                .retrieve().bodyToMono(String.class)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/experience")
    public Mono<ResponseEntity<String>> experience() {
        return profile.get().uri("/v1/experience")
                .retrieve().bodyToMono(String.class)
                .map(ResponseEntity::ok);
    }
}
