package com.clinisys.labocore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LabocoreApplication {
    public static void main(String[] args) {

        SpringApplication.run(LabocoreApplication.class, args);
    }
}
