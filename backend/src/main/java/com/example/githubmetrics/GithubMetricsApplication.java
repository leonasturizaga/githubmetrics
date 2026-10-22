package com.example.githubmetrics;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GithubMetricsApplication {

    public static void main(String[] args) {
        // Load .env file
        Dotenv dotenv = Dotenv.configure()
                .directory("./")          // looks for .env in the project root (backend/)
                .ignoreIfMissing()        // don't crash if .env is missing
                .load();

        // Make the variables available as system properties
        dotenv.entries().forEach(entry -> {
            if (System.getenv(entry.getKey()) == null) {
                System.setProperty(entry.getKey(), entry.getValue());
            }
        });

        SpringApplication.run(GithubMetricsApplication.class, args);
    }
}