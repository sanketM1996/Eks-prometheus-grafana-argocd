import axiosClient from '../../api/axiosClient';

export const fetchTodos = async (page = 0) =>
  axiosClient.get(`/todos?page=${page}&size=10&sortBy=createdAt&direction=desc`);

export const addTodo = async (data) => axiosClient.post('/todos', data);

export const updateTodo = async (id, data) => axiosClient.put(`/todos/${id}`, data);

export const deleteTodo = async (id) => axiosClient.delete(`/todos/${id}`);
