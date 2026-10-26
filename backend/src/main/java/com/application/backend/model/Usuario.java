package com.application.backend.model;

import java.io.Serializable;
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
@Document(collection = "usuarios")
public class Usuario implements Serializable {

    @Id
    private String id;
    private String nome;

    @Indexed(unique = true, sparse = true)
    private String email;

    // Hash BCrypt; nulo para quem so entrou via GitHub e nunca definiu senha
    private String senha;

    @Indexed(unique = true, sparse = true)
    private String githubId;

    private String avatarUrl;
    private Instant dataCadastro;
}
