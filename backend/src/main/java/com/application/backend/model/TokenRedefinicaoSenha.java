package com.application.backend.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "tokens_redefinicao_senha")
public class TokenRedefinicaoSenha {

    @Id
    private String id;

    // Guardamos apenas o hash SHA-256; o token em si so existe no link do e-mail
    @Indexed(unique = true)
    private String tokenHash;

    private String usuarioId;

    // Indice TTL: o MongoDB remove o documento automaticamente apos expirar
    @Indexed(expireAfterSeconds = 0)
    private Instant expiraEm;
}
