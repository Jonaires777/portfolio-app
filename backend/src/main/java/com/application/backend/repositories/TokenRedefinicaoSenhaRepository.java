package com.application.backend.repositories;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.application.backend.model.TokenRedefinicaoSenha;

@Repository
public interface TokenRedefinicaoSenhaRepository extends MongoRepository<TokenRedefinicaoSenha, String> {

    Optional<TokenRedefinicaoSenha> findByTokenHash(String tokenHash);

    void deleteByUsuarioId(String usuarioId);
}
