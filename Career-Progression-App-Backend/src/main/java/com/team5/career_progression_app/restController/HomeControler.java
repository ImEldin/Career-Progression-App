package com.team5.career_progression_app.restController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeControler {

    @GetMapping("/")
    public String hello() { return "Career Progression App is running!"; }
}
