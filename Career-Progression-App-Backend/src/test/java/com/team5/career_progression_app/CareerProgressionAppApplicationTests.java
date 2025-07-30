package com.team5.career_progression_app;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import io.github.cdimascio.dotenv.Dotenv;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class CareerProgressionAppApplicationTests {

	static {
        Dotenv dotenv = Dotenv.load();
        System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
        System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
        System.setProperty("DB_USER", dotenv.get("DB_USER"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
    }

    @Autowired
    private DataSource dataSource;

    @Test
    void testFlywayMigrationsApplied() throws Exception {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM flyway_schema_history")) {
            
            assertTrue(rs.next(), "Flyway schema history table should exist");
            int migrationCount = rs.getInt(1);
            assertTrue(migrationCount > 0, "Flyway should have applied migrations");
            System.out.println("Flyway applied " + migrationCount + " migrations");
        }
    }

    @Test
    void testRoleTablePopulated() throws Exception {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM role")) {
            
            assertTrue(rs.next(), "Result set should have at least one row");
            int count = rs.getInt(1);
            assertTrue(count > 0, "Role table should contain data from migrations");
            System.out.println("Found " + count + " roles in the database");
        }
    }
}
