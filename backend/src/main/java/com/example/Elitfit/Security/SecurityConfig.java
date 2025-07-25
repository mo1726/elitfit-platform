package com.example.Elitfit.Security;

import com.example.Elitfit.Security.JwtAuthenticationFilter;
import com.example.Elitfit.Service.Impl.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()  // Enable CORS support
                .and()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/membership-plans/**").permitAll()
                        .requestMatchers("/admin/**", "/users/all").hasRole("ADMIN")
                        .requestMatchers("/members/me").hasAnyRole("MEMBER", "TRAINER")
                        .requestMatchers(HttpMethod.GET, "/trainers/**").authenticated()


                        //.requestMatchers("/classes/trainer").hasRole("TRAINER") // REMOVE THIS LINE
                        .requestMatchers(HttpMethod.POST, "/classes").hasAnyRole("TRAINER","ADMIN")
                        .requestMatchers("/trainers/**").hasAnyRole("TRAINER", "ADMIN", "MEMBER")
                        .requestMatchers("/member/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/classes/trainer/**").hasAnyRole("ADMIN", "TRAINER", "MEMBER")
                        .requestMatchers("/bookings/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/diet/entry").hasAnyRole("TRAINER", "ADMIN")
                        .requestMatchers("/diet/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/diet/plan").hasAnyRole("TRAINER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/member/trainer/**").hasRole("MEMBER")
                        .requestMatchers("/user/change-password").authenticated()


                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
