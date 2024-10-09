package fr.parisnanterre.PierreRayanShakirOrganization.controllers;

import org.springframework.web.bind.annotation.GetMapping;

public class helloController {

    @GetMapping("/hello")
    public String getHello() {
        return "Hello World!";
    }
}
