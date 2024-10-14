import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Grid, Box, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const TaskForm = ({ fetchTasks }) => {
    const { taskId } = useParams();
    const [taskData, setTaskData] = useState({ title: '', description: '', difficulty: 'Easy', priority: 'Medium', category: 'Work' });
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (taskId) {
            fetchTask();
        } else {
            setTaskData({ title: '', description: '', difficulty: 'Easy', priority: 'Medium', category: 'Work' });
        }
    }, [taskId]);

    const fetchTask = useCallback(async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/tasks/${taskId}`);
            setTaskData({ title: data.title, description: data.description, difficulty: data.difficulty, category: data.category });
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!taskData.title.trim() || taskData.title.length < 3) {
            setError('Task Title must be at least 3 characters long.');
            return;
        }
        if (!taskData.description.trim() || taskData.description.length < 5) {
            setError('Task Description must be at least 5 characters long.');
            return;
        }

        try {
            if (taskId) {
                await axios.put(`http://localhost:5000/tasks/${taskId}`, taskData);
            } else {
                await axios.post('http://localhost:5000/tasks', taskData);
            }

            fetchTasks?.();
            setOpen(true);
            setTaskData({ title: '', description: '', difficulty: 'Easy', priority: 'Medium', category: '' });
            setError('');

            setTimeout(() => navigate('/tasks'), 500);
        } catch (error) {
            console.error('Error submitting task:', error);
            setError(error.response?.data?.message || 'Error while sending task.');
        }
    };

    const handleChange = (e) => {
        setTaskData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClose = () => setOpen(false);

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: '8px' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        {taskId ? 'Update Task' : 'Add Task'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Task Title"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    name="title"
                                    value={taskData.title}
                                    onChange={handleChange}
                                    error={!!error && error.includes('Title')}
                                    helperText={error.includes('Title') ? error : ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Task Description"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    name="description"
                                    value={taskData.description}
                                    onChange={handleChange}
                                    error={!!error && error.includes('Description')}
                                    helperText={error.includes('Description') ? error : ''}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                        name="difficulty"
                                        value={taskData.difficulty}
                                        onChange={handleChange}
                                        label="Difficulty"
                                    >
                                        <MenuItem value="Easy">Easy</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="Hard">Hard</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        name="priority"
                                        value={taskData.priority}
                                        onChange={handleChange}
                                        label="Priority"
                                    >
                                        <MenuItem value="High">High</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="Low">Low</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={taskData.category}
                                        onChange={handleChange}
                                        label="Category"
                                    >
                                        <MenuItem value="Work">Work</MenuItem>
                                        <MenuItem value="Personal">Personal</MenuItem>
                                        <MenuItem value="Urgent">Urgent</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit" fullWidth>
                                    {taskId ? 'Update' : 'Add'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Task successfully {taskId ? 'updated' : 'added'}!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default React.memo(TaskForm);
