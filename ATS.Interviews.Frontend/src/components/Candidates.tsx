import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Card, CardContent, CardActions, List, ListItem, ListItemText, Box, TextField, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getCandidates, createCandidate } from '../services/CandidateService';
import { Candidate } from '../DTOs/Candidate';

const Candidates: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newCandidateFirstName, setNewCandidateFirstName] = useState<string>('');
    const [newCandidateLastName, setNewCandidateLastName] = useState<string>('');
    const [newCandidateEmail, setNewCandidateEmail] = useState<string>('');
    const [newCandidateResumeLink, setNewCandidateResumeLink] = useState<string>('');
    const [newCandidateLinkedInProfile, setNewCandidateLinkedInProfile] = useState<string>('');
    const [newCandidateGitHubProfile, setNewCandidateGitHubProfile] = useState<string>('');
    const [newCandidateOtherProfile, setNewCandidateOtherProfile] = useState<string>('');

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

    const handleAddCandidate = async () => {
        const newCandidate: Candidate = {
            id: 0, // Ensure the ID is set to 0 or omitted for new candidates
            firstName: newCandidateFirstName,
            lastName: newCandidateLastName,
            email: newCandidateEmail,
            resumeLink: newCandidateResumeLink,
            linkedInProfile: newCandidateLinkedInProfile,
            gitHubProfile: newCandidateGitHubProfile,
            otherProfile: newCandidateOtherProfile,
            interviews: []
        };

        try {
            const addedCandidate = await createCandidate(newCandidate);
            setCandidates([...candidates, addedCandidate]);
            setNewCandidateFirstName('');
            setNewCandidateLastName('');
            setNewCandidateEmail('');
            setNewCandidateResumeLink('');
            setNewCandidateLinkedInProfile('');
            setNewCandidateGitHubProfile('');
            setNewCandidateOtherProfile('');
        } catch (error) {
            console.error('Error adding candidate:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Candidates
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                <TextField
                    label="First Name"
                    value={newCandidateFirstName}
                    onChange={(e) => setNewCandidateFirstName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Last Name"
                    value={newCandidateLastName}
                    onChange={(e) => setNewCandidateLastName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    value={newCandidateEmail}
                    onChange={(e) => setNewCandidateEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Resume Link"
                    value={newCandidateResumeLink}
                    onChange={(e) => setNewCandidateResumeLink(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="LinkedIn Profile"
                    value={newCandidateLinkedInProfile}
                    onChange={(e) => setNewCandidateLinkedInProfile(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="GitHub Profile"
                    value={newCandidateGitHubProfile}
                    onChange={(e) => setNewCandidateGitHubProfile(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Other Profile"
                    value={newCandidateOtherProfile}
                    onChange={(e) => setNewCandidateOtherProfile(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleAddCandidate} disabled={!newCandidateFirstName.trim() || !newCandidateLastName.trim() || !newCandidateEmail.trim()}>
                    Add Candidate
                </Button>
            </Box>
            <List>
                {candidates.map((candidate) => (
                    <Card key={candidate.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {candidate.firstName} {candidate.lastName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                <EmailIcon sx={{ mr: 1 }} />
                                <Typography color="text.secondary">
                                    {candidate.email}
                                </Typography>
                            </Box>
                            {candidate.resumeLink && (
                                <Typography color="text.secondary">
                                    Resume: <a href={candidate.resumeLink} target="_blank" rel="noopener noreferrer">{candidate.resumeLink}</a>
                                </Typography>
                            )}
                            {candidate.linkedInProfile && (
                                <Typography color="text.secondary">
                                    LinkedIn: <a href={candidate.linkedInProfile} target="_blank" rel="noopener noreferrer">{candidate.linkedInProfile}</a>
                                </Typography>
                            )}
                            {candidate.gitHubProfile && (
                                <Typography color="text.secondary">
                                    GitHub: <a href={candidate.gitHubProfile} target="_blank" rel="noopener noreferrer">{candidate.gitHubProfile}</a>
                                </Typography>
                            )}
                            {candidate.otherProfile && (
                                <Typography color="text.secondary">
                                    Other: <a href={candidate.otherProfile} target="_blank" rel="noopener noreferrer">{candidate.otherProfile}</a>
                                </Typography>
                            )}
                            {candidate.interviews && candidate.interviews.length > 0 ? (
                                <List>
                                    {candidate.interviews.map((interview) => (
                                        <ListItem key={interview.id}>
                                            <CalendarTodayIcon sx={{ mr: 1 }} />
                                            <ListItemText
                                                primary={`Interview on ${new Date(interview.scheduledDate).toLocaleDateString()}`}
                                                secondary={`Template: ${interview.interviewTemplate?.name || 'No template'}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography color="text.secondary">
                                    No interviews
                                </Typography>
                            )}
                        </CardContent>
                        <CardActions>
                            {/* Add any actions here if needed */}
                        </CardActions>
                    </Card>
                ))}
            </List>
        </Box>
    );
};

export default Candidates;
