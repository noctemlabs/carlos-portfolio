package com.noctem.portfolio.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class ProfileClient {

    private final WebClient webClient;

    public ProfileClient(@Value("${profile.baseUrl}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
    }

    public Mono<String> version() {
        return webClient.get().uri("/v1/version").retrieve().bodyToMono(String.class);
    }

    public Mono<String> status() {
        return webClient.get().uri("/v1/status").retrieve().bodyToMono(String.class);
    }

    public Mono<String> projects() {
        return webClient.get().uri("/v1/projects").retrieve().bodyToMono(String.class);
    }

    public Mono<String> experience() {
        return webClient.get().uri("/v1/experience").retrieve().bodyToMono(String.class);
    }
}
