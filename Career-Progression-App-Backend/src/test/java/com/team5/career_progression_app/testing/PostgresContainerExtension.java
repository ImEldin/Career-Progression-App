package com.team5.career_progression_app.testing;

import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.testcontainers.containers.PostgreSQLContainer;

public class PostgresContainerExtension implements BeforeAllCallback {

    public static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:latest")
                    .withDatabaseName("test_db")
                    .withUsername("test_user")
                    .withPassword("test_pass");

    @Override
    public void beforeAll(ExtensionContext context) {
        postgres.start();

        System.setProperty("spring.datasource.url", postgres.getJdbcUrl());
        System.setProperty("spring.datasource.username", postgres.getUsername());
        System.setProperty("spring.datasource.password", postgres.getPassword());

        System.setProperty("spring.flyway.url", postgres.getJdbcUrl());
        System.setProperty("spring.flyway.user", postgres.getUsername());
        System.setProperty("spring.flyway.password", postgres.getPassword());
    }
}
