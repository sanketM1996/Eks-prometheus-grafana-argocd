import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTodo } from '../features/todos/todoSlice';
import { TextField, Button } from '@mui/material';

export default function TodoForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(createTodo({ title, description }));
    setTitle(''); setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained">Add Todo</Button>
    </form>
  );
}
