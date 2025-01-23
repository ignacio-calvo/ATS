import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Candidate } from '../DTOs/Candidate';

interface CandidateFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (candidate: Candidate) => void;
    candidate?: Candidate;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ open, onClose, onSave, candidate }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [resumeLink, setResumeLink] = useState('');
    const [linkedInProfile, setLinkedInProfile] = useState('');
    const [gitHubProfile, setGitHubProfile] = useState('');
    const [otherProfile, setOtherProfile] = useState('');

    useEffect(() => {
        if (candidate) {
            setFirstName(candidate.firstName);
            setLastName(candidate.lastName);
            setEmail(candidate.email);
            setResumeLink(candidate.resumeLink || '');
            setLinkedInProfile(candidate.linkedInProfile || '');
            setGitHubProfile(candidate.gitHubProfile || '');
            setOtherProfile(candidate.otherProfile || '');
        }
    }, [candidate]);

    const handleSave = () => {
        const newCandidate: Candidate = {
            id: candidate?.id || 0,
            firstName,
            lastName,
            email,
            resumeLink,
            linkedInProfile,
            gitHubProfile,
            otherProfile,
            interviews: candidate?.interviews || []
        };
        onSave(newCandidate);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{candidate ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Resume Link"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="LinkedIn Profile"
                        value={linkedInProfile}
                        onChange={(e) => setLinkedInProfile(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="GitHub Profile"
                        value={gitHubProfile}
                        onChange={(e) => setGitHubProfile(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Other Profile"
                        value={otherProfile}
                        onChange={(e) => setOtherProfile(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" disabled={!firstName.trim() || !lastName.trim() || !email.trim()}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CandidateForm;
