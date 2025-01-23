import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <AppBar position="fixed" sx={{ width: '100%' }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Interview Management
                </Typography>
                <Button color="inherit" component={Link} to="/feedbacks">
                    Feedbacks
                </Button>
                <Button color="inherit" component={Link} to="/interviews">
                    Interviews
                </Button>
                <Button color="inherit" component={Link} to="/candidates">
                    Candidates
                </Button>
                <Button color="inherit" component={Link} to="/templates">
                    Templates
                </Button>
                <Button color="inherit" component={Link} to="/sections">
                    Template Sections
                </Button>
                
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
