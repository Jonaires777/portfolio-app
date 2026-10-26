package com.application.backend.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.application.backend.model.Usuario;
import com.application.backend.services.AuthService;
import com.application.backend.services.TokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private AuthService authService;

    @Autowired
    private TokenService tokenService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        OAuth2User githubUser = (OAuth2User) authentication.getPrincipal();

        String githubId = String.valueOf(githubUser.getAttributes().get("id"));
        String nome = githubUser.getAttribute("name");
        if (nome == null || nome.isBlank()) {
            nome = githubUser.getAttribute("login");
        }

        Usuario usuario = authService.findOrCreateGithubUsuario(githubId, nome,
                githubUser.getAttribute("email"), githubUser.getAttribute("avatar_url"));

        // A API e stateless (JWT); a sessao so era necessaria durante o fluxo OAuth2
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // O token vai no fragmento da URL para nao ser enviado a servidores nem aparecer em logs
        response.sendRedirect(frontendUrl + "/oauth/callback#token=" + tokenService.generateToken(usuario));
    }
}
