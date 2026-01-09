package com.api.library;

import com.api.library.entities.Book;
import com.api.library.repositories.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Scanner;

@SpringBootApplication
public class LibrarySystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(LibrarySystemApplication.class, args);
	}

    @Bean
    CommandLineRunner runner(BookRepository bookRepository) {
        return args -> {

            if (bookRepository.count() > 0) {
                System.out.println("Database contains data");
            } else {
                System.out.println("---- Starting database seeding ----");
                try (Scanner scanner = new Scanner(new FileInputStream("src/main/resources/data/books.txt"))) {

                    while (scanner.hasNext()) {

                        String row = scanner.nextLine();
                        String[] data = row.split(",");

                        bookRepository.save(Book.builder().isbn(data[0]).title(data[1])
                                .author(data[2]).isBorrowed(Boolean.parseBoolean(data[3])).build());
                    }
                    System.out.println("---- Database seeded successfully ----");
                } catch (IOException ex) {
                    System.out.println("Error opening/closing file");
                }
            }

        };
    }

}
