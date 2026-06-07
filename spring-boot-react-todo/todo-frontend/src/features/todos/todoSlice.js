import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './todoAPI';

export const getTodos = createAsyncThunk('todos/fetch', async (page = 0) => {
  const res = await fetchTodos(page);
  return res.data;
});

export const createTodo = createAsyncThunk('todos/create', async (todo) => {
  const res = await addTodo(todo);
  return res.data;
});

export const editTodo = createAsyncThunk('todos/update', async ({ id, data }) => {
  const res = await updateTodo(id, data);
  return res.data;
});

export const removeTodo = createAsyncThunk('todos/delete', async (id) => {
  await deleteTodo(id);
  return id;
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], totalPages: 0, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => { state.status = 'loading'; })
      .addCase(getTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
