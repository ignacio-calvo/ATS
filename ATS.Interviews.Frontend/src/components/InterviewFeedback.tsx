import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, TextField, Button, CircularProgress, Accordion, AccordionSummary, AccordionDetails, ToggleButtonGroup, ToggleButton, Tooltip, IconButton, Divider, Snackbar, Alert, MenuItem, Select } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import { getInterviewById } from '../services/InterviewService';
import { getInterviewTemplateById } from '../services/InterviewTemplateService';
import { getFeedbacksByInterviewAndInterviewer, saveFeedback } from '../services/FeedbackService';
import { Interview } from '../DTOs/Interview';
import { InterviewTemplate } from '../DTOs/InterviewTemplate';
import { Feedback } from '../DTOs/Feedback';

const InterviewFeedback: React.FC = () => {
    const { interviewId, interviewerId } = useParams<{ interviewId: string, interviewerId: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [template, setTemplate] = useState<InterviewTemplate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [feedbacks, setFeedbacks] = useState<Map<number, Feedback>>(new Map());
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const interviewData = await getInterviewById(Number(interviewId));
                setInterview(interviewData);

                const interviewInterviewer = interviewData.interviewInterviewers?.find(ii => ii.interviewerId === Number(interviewerId));
                if (interviewInterviewer && interviewInterviewer.interviewTemplateId) {
                    const templateData = await getInterviewTemplateById(interviewInterviewer.interviewTemplateId);
                    setTemplate(templateData);

                    // Fetch existing feedbacks
                    const existingFeedbacks = await getFeedbacksByInterviewAndInterviewer(Number(interviewId), Number(interviewerId));

                    // Initialize feedbacks map with existing feedbacks or empty feedback objects for each question
                    const initialFeedbacks = new Map<number, Feedback>();
                    templateData.interviewTemplateSections.forEach(section => {
                        section.section.questions.forEach(question => {
                            const existingFeedback = existingFeedbacks.find(fb => fb.questionId === question.id);
                            initialFeedbacks.set(question.id, existingFeedback || {
                                id: 0,
                                interviewId: Number(interviewId),
                                interviewerId: Number(interviewerId),
                                questionId: question.id,
                                comments: '',
                                rating: 0,
                                capturedAt: new Date(),
                                interview: null,
                                interviewer: null,
                                question: null
                            });
                        });
                    });
                    setFeedbacks(initialFeedbacks);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [interviewId, interviewerId]);

    const handleFeedbackChange = (questionId: number, field: keyof Feedback, value: string | number) => {
        const updatedFeedbacks = new Map(feedbacks);
        const feedback = updatedFeedbacks.get(questionId);
        if (feedback) {
            feedback[field] = field === 'rating' ? Number(value) : value;
            updatedFeedbacks.set(questionId, feedback);
            setFeedbacks(updatedFeedbacks);
        }
    };

    const handleSaveFeedback = async () => {
        try {
            const filteredFeedbacks = Array.from(feedbacks.values()).map(feedback => ({
                ...feedback,
                capturedAt: new Date() // Update the capture date and time when saving
            }));
            await saveFeedback(filteredFeedbacks);
            setSnackbarMessage('Feedback saved successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error saving feedback:', error);
            setSnackbarMessage('Error saving feedback.');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <CircularProgress />;
    }

    const interviewInterviewer = interview?.interviewInterviewers?.find(ii => ii.interviewerId === Number(interviewerId));

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Interview Feedback
            </Typography>
            {interview && interview.candidate && interviewInterviewer && template && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        <Typography variant="body1" component="span" fontWeight="bold">Candidate:</Typography> {interview.candidate.firstName} {interview.candidate.lastName} ({interview.candidate.email})
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        <Typography variant="body1" component="span" fontWeight="bold">Interviewer:</Typography> {interviewInterviewer.interviewer?.firstName} {interviewInterviewer.interviewer?.lastName}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        <Typography variant="body1" component="span" fontWeight="bold">Template:</Typography> {template.name}
                    </Typography>
                    {interview.jobDescriptionLink && (
                        <Typography variant="h6" gutterBottom>
                            <Typography variant="body1" component="span" fontWeight="bold">Job Description:</Typography> <a href={interview.jobDescriptionLink} target="_blank" rel="noopener noreferrer">View Job Posting</a>
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        {interview.candidate.resumeLink && (
                            <Tooltip title="Resume">
                                <IconButton component="a" href={interview.candidate.resumeLink} target="_blank" rel="noopener noreferrer">
                                    <DescriptionIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {interview.candidate.linkedInProfile && (
                            <Tooltip title="LinkedIn">
                                <IconButton component="a" href={interview.candidate.linkedInProfile} target="_blank" rel="noopener noreferrer">
                                    <LinkedInIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {interview.candidate.gitHubProfile && (
                            <Tooltip title="GitHub">
                                <IconButton component="a" href={interview.candidate.gitHubProfile} target="_blank" rel="noopener noreferrer">
                                    <GitHubIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        {interview.candidate.otherProfile && (
                            <Tooltip title="Other Profile">
                                <IconButton component="a" href={interview.candidate.otherProfile} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    {template.interviewTemplateSections?.map((section, sectionIndex) => (
                        <Accordion key={section.section.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">
                                    {section.section.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {section.section.questions?.map((question, questionIndex) => (
                                    <Box key={question.id} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body1" gutterBottom>
                                                {question.text}
                                            </Typography>
                                            <Tooltip title={question.hint}>
                                                <IconButton>
                                                    <InfoIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        {question.inputType === 'Text' && (
                                            <TextField
                                                label="Comments"
                                                fullWidth
                                                multiline
                                                rows={2}
                                                value={feedbacks.get(question.id)?.comments || ''}
                                                onChange={(e) => handleFeedbackChange(question.id, 'comments', e.target.value)}
                                                sx={{ mb: 2 }}
                                            />
                                        )}
                                        {question.inputType === 'Rating' && (
                                            <>
                                                <ToggleButtonGroup
                                                    value={feedbacks.get(question.id)?.rating || 0}
                                                    exclusive
                                                    onChange={(e, value) => handleFeedbackChange(question.id, 'rating', value)}
                                                    sx={{ mb: 2 }}
                                                >
                                                    <ToggleButton value={1}>
                                                        <ThumbDownIcon />
                                                        <ThumbDownIcon />
                                                    </ToggleButton>
                                                    <ToggleButton value={2}>
                                                        <ThumbDownIcon />
                                                    </ToggleButton>
                                                    <ToggleButton value={3}>
                                                        <ThumbUpIcon />
                                                    </ToggleButton>
                                                    <ToggleButton value={4}>
                                                        <ThumbUpIcon />
                                                        <ThumbUpIcon />
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                                <TextField
                                                    label="Comments"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    value={feedbacks.get(question.id)?.comments || ''}
                                                    onChange={(e) => handleFeedbackChange(question.id, 'comments', e.target.value)}
                                                    sx={{ mb: 2 }}
                                                />
                                            </>
                                        )}
                                        {question.inputType === 'MultipleChoice' && (
                                            <Select
                                                label="Select Option"
                                                fullWidth
                                                value={feedbacks.get(question.id)?.selectedOptionId || ''}
                                                onChange={(e) => handleFeedbackChange(question.id, 'selectedOptionId', e.target.value as number)}
                                                sx={{ mb: 2 }}
                                            >
                                                {question.inputOptions?.map(option => (
                                                    <MenuItem key={option.id} value={option.id}>
                                                        {option.optionText}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                        {questionIndex < section.section.questions.length - 1 && <Divider sx={{ my: 2 }} />}
                                    </Box>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    <Button variant="contained" onClick={handleSaveFeedback}>
                        Save Feedback
                    </Button>
                </Box>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('successfully') ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default InterviewFeedback;


