package com.team5.career_progression_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class CareerProgressionAppApplication {

	public static void main(String[] args) {

		//Ucitavanje environment varijabli iz .env
		Dotenv dotenv = Dotenv.load();

		System.setProperty("DB_HOST", dotenv.get("DB_HOST"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME"));
		System.setProperty("DB_USER", dotenv.get("DB_USER"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
        System.setProperty("OPENAI_API_KEY", dotenv.get("OPENAI_API_KEY"));
		
		SpringApplication.run(CareerProgressionAppApplication.class, args);
	}

}
