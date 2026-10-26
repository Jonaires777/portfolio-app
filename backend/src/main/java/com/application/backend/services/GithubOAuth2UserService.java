package com.application.backend.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class GithubOAuth2UserService extends DefaultOAuth2UserService {

    private final RestClient restClient = RestClient.create("https://api.github.com");

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);
        Map<String, Object> attributes = new HashMap<>(user.getAttributes());

        // Usamos sempre o e-mail primario verificado, pois ele e usado para vincular a conta local
        attributes.put("email", fetchPrimaryEmail(userRequest.getAccessToken().getTokenValue()));

        return new DefaultOAuth2User(user.getAuthorities(), attributes, "id");
    }

    private String fetchPrimaryEmail(String accessToken) {
        try {
            List<Map<String, Object>> emails = restClient.get()
                    .uri("/user/emails")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {
                    });
            if (emails == null) {
                return null;
            }
            return emails.stream()
                    .filter(e -> Boolean.TRUE.equals(e.get("primary")) && Boolean.TRUE.equals(e.get("verified")))
                    .map(e -> (String) e.get("email"))
                    .findFirst()
                    .orElse(null);
        } catch (RestClientException e) {
            return null;
        }
    }
}
