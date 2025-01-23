import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import { Container, Typography, Box, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Interviews from './components/Interviews';
import Candidates from './components/Candidates';
import Templates from './components/Templates';
import Sections from './components/Sections';
import Feedbacks from './components/Feedbacks';
import InterviewFeedback from './components/InterviewFeedback';
import { createTheme } from '@mui/material/styles';

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <NavBar />
                <Box sx={{ mt: 8 }}>
                    <Container sx={{ width: '100vw' }}>
                        <Routes>
                            <Route path="/" element={<Typography variant="h4" gutterBottom>Welcome to the Interview Management System</Typography>} />
                            <Route path="/interviews" element={<Interviews />} />
                            <Route path="/candidates" element={<Candidates />} />
                            <Route path="/templates" element={<Templates />} />
                            <Route path="/sections" element={<Sections />} />
                            <Route path="/feedbacks" element={<Feedbacks />} />
                            <Route path="/interviewFeedback/:interviewId/interviewer/:interviewerId" element={<InterviewFeedback />} />
                        </Routes>
                    </Container>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default App;





