import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Navigation';
import { CircularProgress, Box, createTheme, ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';

const TaskForm = lazy(() => import('./TaskForm'));
const TaskList = lazy(() => import('./TaskList'));

const App = () => {
    const [darkMode, setDarkMode] = useState(true);

    // Create a theme based on the mode
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Apply baseline CSS for MUI */}
            <Router>
                <Navigation />
                {/* Mini button slider for dark mode toggle */}
                <Box sx={{ position: 'fixed', top: 11.4, right: 222 }}>
                    <IconButton onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? <WbSunnyIcon /> : <NightsStayIcon />}
                    </IconButton>
                </Box>
                <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}>
                    <Routes>
                        <Route path="/" element={<TaskForm />} />
                        <Route path="/tasks" element={<TaskList />} />
                        <Route path="/edit-task/:taskId" element={<TaskForm />} />
                    </Routes>
                </Suspense>
            </Router>
        </ThemeProvider>
    );
};

export default React.memo(App);
