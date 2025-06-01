package com.jankovic.fastfood;

import com.jankovic.fastfood.entity.User;
import com.jankovic.fastfood.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class FastFoodApplication {
    public static void main(String[] args) {
        SpringApplication.run(FastFoodApplication.class, args);
    }

    @Bean
    public CommandLineRunner createAdmin(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByEmail("admin@admin").isEmpty()) {
                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                User admin = new User();
                admin.setEmail("admin@admin");
                admin.setName("Admin");
                admin.setPhone("0000000000");
                admin.setRole("ADMIN");
                admin.setPassword(encoder.encode("123"));
                admin.setVerified(true);
                userRepository.save(admin);
                System.out.println("Admin korisnik kreiran: admin@admin / 123");
            } else {
                System.out.println("Admin korisnik već postoji.");
            }
        };
    }
}
