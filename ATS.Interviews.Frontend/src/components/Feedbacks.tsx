import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Card, CardContent, CardHeader, CircularProgress, Button } from '@mui/material';
import { getInterviewers } from '../services/InterviewerService';
import { getInterviewsByInterviewer } from '../services/InterviewService';
import { Interview } from '../DTOs/Interview';
import { Interviewer } from '../DTOs/Interviewer';

const Feedbacks: React.FC = () => {
    const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
    const [selectedInterviewerId, setSelectedInterviewerId] = useState<number | null>(null);
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterviewers = async () => {
            try {
                const interviewerData = await getInterviewers();
                setInterviewers(interviewerData);
            } catch (error) {
                console.error('Error fetching interviewers:', error);
            }
        };

        fetchInterviewers();
    }, []);

    const handleInterviewerChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
        const interviewerId = event.target.value as number;
        setSelectedInterviewerId(interviewerId);
        setLoading(true);
        try {
            const interviewData = await getInterviewsByInterviewer(interviewerId);
            setInterviews(interviewData);
        } catch (error) {
            console.error('Error fetching interviews:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Feedbacks
            </Typography>
            <Box sx={{ mb: 4 }}>
                <FormControl fullWidth>
                    <InputLabel>Interviewer</InputLabel>
                    <Select
                        value={selectedInterviewerId || ''}
                        onChange={handleInterviewerChange}
                    >
                        {interviewers.map(interviewer => (
                            <MenuItem key={interviewer.id} value={interviewer.id}>
                                {interviewer.firstName} {interviewer.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <Box>
                    {interviews.map(interview => (
                        <Card key={interview.id} sx={{ mb: 2 }}>
                            <CardHeader
                                title={`Interview on ${new Date(interview.scheduledDate).toLocaleString()}`}
                                subheader={`Candidate: ${interview.candidate?.firstName} ${interview.candidate?.lastName} (${interview.candidate?.email})`}
                            />
                            <CardContent>
                                {interview.interviewInterviewers
                                    .filter(ii => ii.interviewerId === selectedInterviewerId)
                                    .map(ii => (
                                        ii.interviewTemplate && (
                                            <Typography key={ii.interviewTemplate.id} variant="body2" color="textSecondary">
                                                Template: {ii.interviewTemplate.name}
                                            </Typography>
                                        )
                                    ))}
                                <Button variant="contained" onClick={() => navigate(`/interviewFeedback/${interview.id}/interviewer/${selectedInterviewerId}`)}>
                                    Provide Feedback
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </div>
    );
};

export default Feedbacks;






