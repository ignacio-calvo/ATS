import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Card, CardContent, CardActions, List, ListItem, ListItemText, Box, Button, IconButton, Snackbar, Alert, Grid, Tooltip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '../services/CandidateService';
import { Candidate } from '../DTOs/Candidate';
import CandidateForm from './CandidateForm';

const Candidates: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const data = await getCandidates();
                setCandidates(data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const handleAddCandidate = async (candidate: Candidate) => {
        try {
            const addedCandidate = await createCandidate(candidate);
            setCandidates([...candidates, addedCandidate]);
            setIsModalOpen(false);
            setSnackbarMessage('Candidate added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error adding candidate:', error);
            setSnackbarMessage('Error adding candidate.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleEditCandidate = async (candidate: Candidate) => {
        try {
            const updatedCandidate = await updateCandidate(candidate.id, candidate);
            console.log('Updated Candidate:', updatedCandidate); // Log the response
            if (updatedCandidate && updatedCandidate.id) {
                setCandidates(candidates.map(c => (c.id === updatedCandidate.id ? updatedCandidate : c)));
                setIsModalOpen(false);
                setSnackbarMessage('Candidate updated successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {
                throw new Error('Failed to update candidate');
            }
        } catch (error) {
            console.error('Error updating candidate:', error);
            setSnackbarMessage('Error updating candidate.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDeleteCandidate = async (id: number) => {
        try {
            await deleteCandidate(id);
            setCandidates(candidates.filter(candidate => candidate.id !== id));
            setSnackbarMessage('Candidate deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error deleting candidate:', error);
            setSnackbarMessage('Error deleting candidate.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleOpenModal = (candidate?: Candidate) => {
        setSelectedCandidate(candidate || null);
        setIsModalOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Candidates
            </Typography>
            <Button variant="contained" onClick={() => handleOpenModal()} sx={{ mb: 2 }}>
                Add Candidate
            </Button>
            <Grid container spacing={2}>
                {candidates.map((candidate) => (
                    <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                        <Card sx={{ mb: 2, position: 'relative' }}>
                            <CardActions sx={{ position: 'absolute', top: 0, right: 0 }}>
                                <IconButton onClick={() => handleOpenModal(candidate)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteCandidate(candidate.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                            <CardContent>
                                <Typography variant="h5" component="div" align="center">
                                    {candidate.firstName} {candidate.lastName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    <EmailIcon sx={{ mr: 1 }} />
                                    <Typography color="text.secondary">
                                        {candidate.email}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    {candidate.resumeLink && (
                                        <Tooltip title="Resume">
                                            <IconButton component="a" href={candidate.resumeLink} target="_blank" rel="noopener noreferrer">
                                                <DescriptionIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {candidate.linkedInProfile && (
                                        <Tooltip title="LinkedIn">
                                            <IconButton component="a" href={candidate.linkedInProfile} target="_blank" rel="noopener noreferrer">
                                                <LinkedInIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {candidate.gitHubProfile && (
                                        <Tooltip title="GitHub">
                                            <IconButton component="a" href={candidate.gitHubProfile} target="_blank" rel="noopener noreferrer">
                                                <GitHubIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {candidate.otherProfile && (
                                        <Tooltip title="Other Profile">
                                            <IconButton component="a" href={candidate.otherProfile} target="_blank" rel="noopener noreferrer">
                                                <LinkIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                                {candidate.interviews && candidate.interviews.length > 0 ? (
                                    <List>
                                        {candidate.interviews.map((interview) => (
                                            <ListItem key={interview.id} sx={{ justifyContent: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <CalendarTodayIcon sx={{ mr: 1 }} />
                                                    <ListItemText
                                                        primary={`Interview on ${new Date(interview.scheduledDate).toLocaleDateString()}`}
                                                        secondary={`Template: ${interview.interviewTemplate?.name || 'No template'}`}
                                                        sx={{ textAlign: 'center' }}
                                                    />
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography color="text.secondary" align="center">
                                        No interviews
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <CandidateForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={selectedCandidate ? handleEditCandidate : handleAddCandidate}
                candidate={selectedCandidate}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Candidates;



