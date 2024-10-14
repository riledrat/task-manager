import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Container,
    Box,
    TextField,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleEdit = useCallback((taskId) => navigate(`/edit-task/${taskId}`), [navigate]);

    const handleDelete = useCallback(async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${taskId}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            setError('Failed to delete task. Please try again.');
        }
    }, [fetchTasks]);

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCloseSnackbar = () => setError('');

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Task List
                    </Typography>
                    <TextField
                        label="Search Tasks"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'center' }}>Title</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>Description</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>Difficulty</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>Priority</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>Category</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map((task) => (
                                            <TableRow key={task._id}>
                                                <TableCell sx={{ textAlign: 'center' }}>{task.title}</TableCell>
                                                <TableCell sx={{ textAlign: 'center' }}>{task.description}</TableCell>
                                                <TableCell sx={{ textAlign: 'center' }}>{task.difficulty}</TableCell>
                                                <TableCell sx={{ textAlign: 'center' }}>{task.priority}</TableCell>
                                                <TableCell sx={{ textAlign: 'center' }}>{task.category}</TableCell>
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                    <Button onClick={() => handleEdit(task._id)} color="primary" startIcon={<EditIcon />}>Edit</Button>
                                                    <Button onClick={() => handleDelete(task._id)} color="secondary" startIcon={<DeleteIcon />}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No tasks found.</TableCell> {/* Update colSpan to 6 */}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Box>

            <Snackbar open={!!error} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default React.memo(TaskList);
