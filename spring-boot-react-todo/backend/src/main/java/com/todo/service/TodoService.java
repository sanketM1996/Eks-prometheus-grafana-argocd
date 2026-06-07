package com.todo.service;

import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TodoService {
    TodoResponse create(TodoRequest request);
    TodoResponse update(Long id, TodoRequest request);
    void delete(Long id);
    TodoResponse getById(Long id);
    Page<TodoResponse> getAll(Pageable pageable);
}

