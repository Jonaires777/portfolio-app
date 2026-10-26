package com.application.backend.services;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.application.backend.model.Usuario;

@Service
public class TokenService {

    @Autowired
    private JwtEncoder jwtEncoder;

    @Value("${app.jwt.expiration-hours}")
    private long expirationHours;

    public String generateToken(Usuario usuario) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("insight-hub")
                .issuedAt(now)
                .expiresAt(now.plus(Duration.ofHours(expirationHours)))
                .subject(usuario.getId())
                .claim("nome", usuario.getNome())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
