package com.application.backend.services;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.HtmlUtils;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final RestClient restClient = RestClient.create("https://api.resend.com");

    @Value("${app.mail.resend-api-key}")
    private String resendApiKey;

    @Value("${app.mail.from}")
    private String from;

    public void sendPasswordResetEmail(String to, String nome, String link) {
        String html = "<p>Ola, " + HtmlUtils.htmlEscape(nome) + "!</p>"
                + "<p>Recebemos um pedido para redefinir a sua senha no Insight Hub.</p>"
                + "<p><a href=\"" + link + "\">Clique aqui para criar uma nova senha</a></p>"
                + "<p>O link expira em 30 minutos. Se voce nao fez este pedido, ignore este e-mail.</p>";

        if (resendApiKey == null || resendApiKey.isBlank()) {
            // Ambiente local sem RESEND_API_KEY: mostra o link no log para permitir testar o fluxo
            log.warn("RESEND_API_KEY nao configurada. Link de redefinicao para {}: {}", to, link);
            return;
        }

        try {
            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + resendApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "from", from,
                            "to", List.of(to),
                            "subject", "Redefinicao de senha - Insight Hub",
                            "html", html))
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            log.error("Falha ao enviar e-mail de redefinicao para {}", to, e);
        }
    }
}
