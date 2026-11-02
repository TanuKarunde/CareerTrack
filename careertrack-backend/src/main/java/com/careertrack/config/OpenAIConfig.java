package com.careertrack.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class OpenAIConfig {

    @Value("${gemini.api.url}")
    private String geminiUrl;

    @Bean
    public RestClient openAIRestClient() {

        return RestClient.builder()
                .baseUrl(geminiUrl)
                .build();
    }
}