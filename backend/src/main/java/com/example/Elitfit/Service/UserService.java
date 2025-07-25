package com.example.Elitfit.Service;

import com.example.Elitfit.Dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Long id);
    UserDto updateUser(Long id, UserDto dto);
    void deleteUser(Long id);
    void changePasswordByEmail(String email, String newPassword);
}
