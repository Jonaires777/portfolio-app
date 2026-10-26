package com.application.backend.services;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.application.backend.exceptions.ApiException;
import com.application.backend.model.TokenRedefinicaoSenha;
import com.application.backend.model.Usuario;
import com.application.backend.model.DTOs.AuthResponseDTO;
import com.application.backend.model.DTOs.LoginDTO;
import com.application.backend.model.DTOs.RegisterDTO;
import com.application.backend.model.DTOs.ResetPasswordDTO;
import com.application.backend.model.DTOs.UsuarioDTO;
import com.application.backend.repositories.TokenRedefinicaoSenhaRepository;
import com.application.backend.repositories.UsuarioRepository;

@Service
public class AuthService {

    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final String INVALID_RESET_LINK = "Link invalido ou expirado. Solicite um novo.";

    private final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenRedefinicaoSenhaRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.password-reset.expiration-minutes}")
    private long resetExpirationMinutes;

    public AuthResponseDTO register(RegisterDTO registerDTO) {
        String nome = registerDTO.getNome() == null ? "" : registerDTO.getNome().trim();
        String email = normalizeEmail(registerDTO.getEmail());

        if (nome.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Informe o seu nome");
        }
        if (email == null || !email.contains("@")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Informe um e-mail valido");
        }
        validatePassword(registerDTO.getSenha());
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "Ja existe uma conta com este e-mail");
        }

        Usuario usuario = Usuario.builder()
                .nome(nome)
                .email(email)
                .senha(passwordEncoder.encode(registerDTO.getSenha()))
                .dataCadastro(Instant.now())
                .build();
        usuarioRepository.save(usuario);

        return buildAuthResponse(usuario);
    }

    public AuthResponseDTO login(LoginDTO loginDTO) {
        String email = normalizeEmail(loginDTO.getEmail());
        Optional<Usuario> usuario = email == null ? Optional.empty() : usuarioRepository.findByEmail(email);

        if (usuario.isEmpty() || usuario.get().getSenha() == null || loginDTO.getSenha() == null
                || !passwordEncoder.matches(loginDTO.getSenha(), usuario.get().getSenha())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha invalidos");
        }

        return buildAuthResponse(usuario.get());
    }

    public UsuarioDTO findUsuario(String id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Usuario nao encontrado"));
        return toDTO(usuario);
    }

    public Usuario findOrCreateGithubUsuario(String githubId, String nome, String email, String avatarUrl) {
        Optional<Usuario> byGithubId = usuarioRepository.findByGithubId(githubId);
        if (byGithubId.isPresent()) {
            Usuario usuario = byGithubId.get();
            usuario.setAvatarUrl(avatarUrl);
            return usuarioRepository.save(usuario);
        }

        // Conta local com o mesmo e-mail (verificado pelo GitHub): vincula em vez de duplicar
        String normalizedEmail = normalizeEmail(email);
        Optional<Usuario> byEmail = normalizedEmail == null ? Optional.empty()
                : usuarioRepository.findByEmail(normalizedEmail);
        if (byEmail.isPresent()) {
            Usuario usuario = byEmail.get();
            usuario.setGithubId(githubId);
            if (usuario.getAvatarUrl() == null) {
                usuario.setAvatarUrl(avatarUrl);
            }
            return usuarioRepository.save(usuario);
        }

        Usuario usuario = Usuario.builder()
                .nome(nome)
                .email(normalizedEmail)
                .githubId(githubId)
                .avatarUrl(avatarUrl)
                .dataCadastro(Instant.now())
                .build();
        return usuarioRepository.save(usuario);
    }

    public void requestPasswordReset(String rawEmail) {
        String email = normalizeEmail(rawEmail);
        if (email == null) {
            return;
        }

        // Nao informamos se o e-mail existe, para nao expor quem tem conta
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            tokenRepository.deleteByUsuarioId(usuario.getId());

            byte[] bytes = new byte[32];
            secureRandom.nextBytes(bytes);
            String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

            tokenRepository.save(TokenRedefinicaoSenha.builder()
                    .tokenHash(sha256(token))
                    .usuarioId(usuario.getId())
                    .expiraEm(Instant.now().plus(Duration.ofMinutes(resetExpirationMinutes)))
                    .build());

            String link = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(usuario.getEmail(), usuario.getNome(), link);
        });
    }

    public void resetPassword(ResetPasswordDTO resetPasswordDTO) {
        validatePassword(resetPasswordDTO.getSenha());

        String token = resetPasswordDTO.getToken();
        TokenRedefinicaoSenha tokenRedefinicao = token == null ? null
                : tokenRepository.findByTokenHash(sha256(token)).orElse(null);

        // O indice TTL do MongoDB nao remove na hora exata, entao conferimos a expiracao aqui tambem
        if (tokenRedefinicao == null || tokenRedefinicao.getExpiraEm().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, INVALID_RESET_LINK);
        }

        Usuario usuario = usuarioRepository.findById(tokenRedefinicao.getUsuarioId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, INVALID_RESET_LINK));
        usuario.setSenha(passwordEncoder.encode(resetPasswordDTO.getSenha()));
        usuarioRepository.save(usuario);

        tokenRepository.deleteByUsuarioId(usuario.getId());
    }

    public AuthResponseDTO buildAuthResponse(Usuario usuario) {
        return AuthResponseDTO.builder()
                .token(tokenService.generateToken(usuario))
                .usuario(toDTO(usuario))
                .build();
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .avatarUrl(usuario.getAvatarUrl())
                .build();
    }

    private void validatePassword(String senha) {
        if (senha == null || senha.length() < MIN_PASSWORD_LENGTH) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "A senha deve ter pelo menos " + MIN_PASSWORD_LENGTH + " caracteres");
        }
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }
        return email.trim().toLowerCase();
    }

    private String sha256(String value) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
