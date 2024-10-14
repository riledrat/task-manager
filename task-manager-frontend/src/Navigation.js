import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import logo from './assets/logo.png';

const Navigation = () => (
    <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={logo} alt="Logo" height="40" style={{ marginLeft: '16px' }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="inherit" component={Link} to="/">Create Task</Button>
                <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
            </Box>
        </Toolbar>
    </AppBar>
);

export default React.memo(Navigation);
