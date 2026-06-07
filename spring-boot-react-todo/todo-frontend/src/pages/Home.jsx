import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          textAlign: 'center'
        }}
      >
        {/* Title */}
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          📝 Todo App -version 2.0.0
        </Typography>

        <Typography gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
          Stay organized and boost your productivity
        </Typography>

        {/* Card Wrapper */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 3,
            backdropFilter: 'blur(10px)'
          }}
        >
          <TodoForm />

          <Box mt={3}>
            <TodoList />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}