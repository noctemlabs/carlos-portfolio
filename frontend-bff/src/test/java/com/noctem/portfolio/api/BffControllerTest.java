package com.noctem.portfolio.api;

import com.noctem.portfolio.client.ProfileClient;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

@WebFluxTest(controllers = BffController.class)
class BffControllerTest {

    @Autowired
    WebTestClient webTestClient;

    @MockBean
    ProfileClient profileClient;

    @Test
    void status_returnsDownstreamPayload() {
        Mockito.when(profileClient.status())
                .thenReturn(Mono.just("{\"status\":\"ok\"}"));

        webTestClient.get()
                .uri("/api/status")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectHeader().contentTypeCompatibleWith(MediaType.APPLICATION_JSON)
                .expectBody(String.class)
                .isEqualTo("{\"status\":\"ok\"}");
    }

    @Test
    void projects_returnsDownstreamPayload() {
        Mockito.when(profileClient.projects())
                .thenReturn(Mono.just("[{\"id\":\"1\"}]"));

        webTestClient.get()
                .uri("/api/projects")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .isEqualTo("[{\"id\":\"1\"}]");
    }
}
