import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, CircularProgress, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Card, CardContent, CardHeader, ListItemSecondaryAction, IconButton } from '@mui/material';
import { getInterviews, createInterview, deleteInterview, removeInterviewerFromInterview, addInterviewerToInterview } from '../services/InterviewService';
import { getCandidates } from '../services/CandidateService';
import { getInterviewers } from '../services/InterviewerService';
import { getInterviewTemplates } from '../services/InterviewTemplateService';
import { Interview } from '../DTOs/Interview';
import { Candidate } from '../DTOs/Candidate';
import { Interviewer } from '../DTOs/Interviewer';
import { InterviewTemplate } from '../DTOs/InterviewTemplate';
import DeleteIcon from '@mui/icons-material/Delete';

const Interviews: React.FC = () => {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
    const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newInterviewCandidateId, setNewInterviewCandidateId] = useState<number | null>(null);
    const [newInterviewDate, setNewInterviewDate] = useState<string>('');
    const [newInterviewJobDescriptionLink, setNewInterviewJobDescriptionLink] = useState<string>('');
    const [newInterviewInterviewers, setNewInterviewInterviewers] = useState<{ interviewerId: number, interviewTemplateId: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [interviewData, candidateData, interviewerData, templateData] = await Promise.all([
                    getInterviews(),
                    getCandidates(),
                    getInterviewers(),
                    getInterviewTemplates()
                ]);
                setInterviews(interviewData);
                setCandidates(candidateData);
                setInterviewers(interviewerData);
                setTemplates(templateData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddInterview = async () => {
        if (newInterviewCandidateId && newInterviewDate) {
            const newInterview: Interview = {
                id: 0,
                candidateId: newInterviewCandidateId,
                scheduledDate: newInterviewDate,
                jobDescriptionLink: newInterviewJobDescriptionLink,
                feedbacks: [],
                candidate: candidates.find(c => c.id === newInterviewCandidateId)!,
                interviewInterviewers: newInterviewInterviewers.map(ii => ({
                    interviewId: 0,
                    interviewerId: ii.interviewerId,
                    interviewTemplateId: ii.interviewTemplateId,
                    interview: {} as Interview,
                    interviewer: interviewers.find(i => i.id === ii.interviewerId)!,
                    interviewTemplate: templates.find(t => t.id === ii.interviewTemplateId)!
                }))
            };

            try {
                const addedInterview = await createInterview(newInterview);
                // Ensure the candidate and interviewInterviewers are populated correctly
                addedInterview.candidate = candidates.find(c => c.id === addedInterview.candidateId)!;
                addedInterview.interviewInterviewers.forEach(ii => {
                    ii.interviewer = interviewers.find(i => i.id === ii.interviewerId)!;
                    ii.interviewTemplate = templates.find(t => t.id === ii.interviewTemplateId)!;
                });

                setInterviews([...interviews, addedInterview]);
                setNewInterviewCandidateId(null);
                setNewInterviewDate('');
                setNewInterviewJobDescriptionLink('');
                setNewInterviewInterviewers([]);
            } catch (error) {
                console.error('Error adding interview:', error);
            }
        }
    };

    const handleDeleteInterview = async (id: number) => {
        try {
            await deleteInterview(id);
            setInterviews(interviews.filter(interview => interview.id !== id));
        } catch (error) {
            console.error('Error deleting interview:', error);
        }
    };

    const handleDeleteInterviewer = async (interviewId: number, interviewerId: number) => {
        try {
            await removeInterviewerFromInterview(interviewId, interviewerId);
            const updatedInterviews = interviews.map(interview => {
                if (interview.id === interviewId) {
                    return {
                        ...interview,
                        interviewInterviewers: interview.interviewInterviewers.filter(ii => ii.interviewerId !== interviewerId)
                    };
                }
                return interview;
            });
            setInterviews(updatedInterviews);
        } catch (error) {
            console.error('Error deleting interviewer:', error);
        }
    };

    const handleAddInterviewerToInterview = async (interviewId: number, interviewerId: number, interviewTemplateId: number) => {
        try {
            const newInterviewerData = {
                interviewId,
                interviewerId,
                interviewTemplateId
            };
            await addInterviewerToInterview(newInterviewerData);
            const updatedInterviews = interviews.map(interview => {
                if (interview.id === interviewId) {
                    return {
                        ...interview,
                        interviewInterviewers: [...interview.interviewInterviewers, {
                            interviewId,
                            interviewerId,
                            interviewTemplateId,
                            interviewer: interviewers.find(i => i.id === interviewerId)!,
                            interviewTemplate: templates.find(t => t.id === interviewTemplateId)!
                        }]
                    };
                }
                return interview;
            });
            setInterviews(updatedInterviews);
        } catch (error) {
            console.error('Error adding interviewer to interview:', error);
        }
    };

    const handleAddInterviewer = () => {
        setNewInterviewInterviewers([...newInterviewInterviewers, { interviewerId: 0, interviewTemplateId: 0 }]);
    };

    const handleInterviewerChange = (index: number, field: 'interviewerId' | 'interviewTemplateId', value: number) => {
        const updatedInterviewers = [...newInterviewInterviewers];
        updatedInterviewers[index][field] = value;
        setNewInterviewInterviewers(updatedInterviewers);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box >
            <Typography variant="h4" gutterBottom>
                Interviews
            </Typography>
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Candidate</InputLabel>
                            <Select
                                value={newInterviewCandidateId || ''}
                                onChange={(e) => setNewInterviewCandidateId(Number(e.target.value))}
                            >
                                {candidates.map(candidate => (
                                    <MenuItem key={candidate.id} value={candidate.id}>
                                        {candidate.firstName} {candidate.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Interview Date"
                            type="datetime-local"
                            fullWidth
                            value={newInterviewDate}
                            onChange={(e) => setNewInterviewDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
                <TextField
                    label="Job Description Link"
                    fullWidth
                    value={newInterviewJobDescriptionLink}
                    onChange={(e) => setNewInterviewJobDescriptionLink(e.target.value)}
                    sx={{ mb: 2 }}
                />
                {newInterviewInterviewers.map((ii, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                        <FormControl fullWidth sx={{ mr: 2 }}>
                            <InputLabel>Interviewer</InputLabel>
                            <Select
                                value={ii.interviewerId}
                                onChange={(e) => handleInterviewerChange(index, 'interviewerId', Number(e.target.value))}
                            >
                                {interviewers.map(interviewer => (
                                    <MenuItem key={interviewer.id} value={interviewer.id}>
                                        {interviewer.firstName} {interviewer.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Template</InputLabel>
                            <Select
                                value={ii.interviewTemplateId}
                                onChange={(e) => handleInterviewerChange(index, 'interviewTemplateId', Number(e.target.value))}
                            >
                                {templates.map(template => (
                                    <MenuItem key={template.id} value={template.id}>
                                        {template.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Button variant="contained" onClick={handleAddInterviewer}>
                        Add Interviewer
                    </Button>
                    <Button variant="contained" onClick={handleAddInterview} disabled={!newInterviewCandidateId || !newInterviewDate}>
                        Create Interview
                    </Button>
                </Box>
            </Box>
            <Grid container spacing={2}>
                {interviews.map((interview) => {
                    const availableInterviewers = interviewers.filter(interviewer => !interview.interviewInterviewers.some(ii => ii.interviewerId === interviewer.id));
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={interview.id}>
                            <Card>
                                <CardHeader
                                    title={`Interview with ${interview.candidate.firstName} ${interview.candidate.lastName}`}
                                    subheader={`Scheduled on ${new Date(interview.scheduledDate).toLocaleString()}`}
                                    action={
                                        <IconButton onClick={() => handleDeleteInterview(interview.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                />
                                <CardContent>
                                    {interview.jobDescriptionLink && (
                                        <Typography color="text.secondary">
                                            Job Description: <a href={interview.jobDescriptionLink} target="_blank" rel="noopener noreferrer">{interview.jobDescriptionLink}</a>
                                        </Typography>
                                    )}
                                    {interview.interviewInterviewers.length > 0 && (
                                        <List>
                                            {interview.interviewInterviewers.map((ii, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={`Interviewer: ${ii.interviewer.firstName} ${ii.interviewer.lastName}`}
                                                        secondary={`Template: ${ii.interviewTemplate?.name}`}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" onClick={() => handleDeleteInterviewer(interview.id, ii.interviewerId)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                    <Box sx={{ display: 'flex', mt: 2 }}>
                                        <FormControl fullWidth sx={{ mr: 2 }}>
                                            <InputLabel>Interviewer</InputLabel>
                                            <Select
                                                value={interview.newInterviewerId || ''}
                                                onChange={(e) => setInterviews(interviews.map(i => i.id === interview.id ? { ...i, newInterviewerId: Number(e.target.value) } : i))}
                                            >
                                                {availableInterviewers.map(interviewer => (
                                                    <MenuItem key={interviewer.id} value={interviewer.id}>
                                                        {interviewer.firstName} {interviewer.lastName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel>Template</InputLabel>
                                            <Select
                                                value={interview.newInterviewTemplateId || ''}
                                                onChange={(e) => setInterviews(interviews.map(i => i.id === interview.id ? { ...i, newInterviewTemplateId: Number(e.target.value) } : i))}
                                            >
                                                {templates.map(template => (
                                                    <MenuItem key={template.id} value={template.id}>
                                                        {template.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button variant="contained" onClick={() => handleAddInterviewerToInterview(interview.id, interview.newInterviewerId, interview.newInterviewTemplateId)}>
                                            Add Interviewer
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Interviews;




