package fr.parisnanterre.PierreRayanShakirOrganization;

import fr.parisnanterre.PierreRayanShakirOrganization.controllers.HelloController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@WebMvcTest(HelloController.class)
public class HelloControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Test
    public void testGetHello() throws Exception {
        mockMvc.perform(get("/hello")) // Simulates a GET request to /hello and checks the response
                .andExpect(status().isOk()) // Checks that HTTP status is 200 (OK)
                .andExpect(content().string("Hello from API")); // Check that the response contains “Hello from API"
    }
}