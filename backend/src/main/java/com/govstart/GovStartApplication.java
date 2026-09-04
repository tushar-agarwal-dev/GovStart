package com.govstart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GovStartApplication {
    public static void main(String[] args) {
        SpringApplication.run(GovStartApplication.class, args);
    }
}
