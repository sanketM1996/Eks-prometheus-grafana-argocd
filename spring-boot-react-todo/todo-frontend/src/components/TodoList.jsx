import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodos, editTodo, removeTodo } from '../features/todos/todoSlice';

import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

export default function TodoList() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading your tasks...</Typography>
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Typography color="error" textAlign="center" mt={3}>
        Failed to load todos
      </Typography>
    );
  }

  if (items.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.04)'
        }}
      >
        <Typography variant="h6">No tasks yet 🚀</Typography>
        <Typography color="text.secondary">
          Add your first task to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {items.map((todo) => (
        <Paper
          key={todo.id}
          elevation={4}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            background: todo.completed
              ? 'rgba(76, 175, 80, 0.08)'
              : 'rgba(255,255,255,0.04)',

            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 8
            }
          }}
        >
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => dispatch(removeTodo(todo.id))}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    transform: 'scale(1.15)'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              checked={todo.completed}
              onChange={() =>
                dispatch(
                  editTodo({
                    id: todo.id,
                    data: {
                      ...todo,
                      completed: !todo.completed
                    }
                  })
                )
              }
              color="primary"
            />

            <ListItemText
              primary={
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    fontWeight={600}
                    sx={{
                      textDecoration: todo.completed
                        ? 'line-through'
                        : 'none',
                      opacity: todo.completed ? 0.7 : 1
                    }}
                  >
                    {todo.title}
                  </Typography>

                  <Chip
                    size="small"
                    icon={
                      todo.completed ? (
                        <TaskAltIcon />
                      ) : (
                        <PendingActionsIcon />
                      )
                    }
                    label={todo.completed ? 'Done' : 'Pending'}
                    color={todo.completed ? 'success' : 'warning'}
                  />
                </Box>
              }
              secondary={
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    opacity: 0.75
                  }}
                >
                  {todo.description}
                </Typography>
              }
            />
          </ListItem>
        </Paper>
      ))}
    </List>
  );
}