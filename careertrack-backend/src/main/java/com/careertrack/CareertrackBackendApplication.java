package com.careertrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CareertrackBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CareertrackBackendApplication.class, args);
	}

}
