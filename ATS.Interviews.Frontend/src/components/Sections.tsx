import React, { useEffect, useState } from 'react';
import { Typography, List, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Box, Button, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Checkbox, FormControlLabel, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getSections, createSection, addQuestion, updateQuestion, deleteQuestion } from '../services/SectionService';
import { Section } from '../DTOs/Section';
import { Question } from '../DTOs/Question';
import { InputType, InputOption } from '../DTOs/InputType';

const DragHandle: React.FC<{ id: number }> = ({ id }) => {
    const { attributes, listeners } = useSortable({ id });

    return (
        <IconButton {...listeners} {...attributes}>
            <DragHandleIcon sx={{ cursor: 'grab' }} />
        </IconButton>
    );
};

const SortableItem: React.FC<{ id: number; children: React.ReactNode }> = ({ id, children }) => {
    const { setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    );
};

const Sections: React.FC = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingQuestion, setEditingQuestion] = useState<{ [key: number]: boolean }>({});
    const [newQuestionText, setNewQuestionText] = useState<string>('');
    const [newQuestionHint, setNewQuestionHint] = useState<string>('');
    const [newQuestionInputType, setNewQuestionInputType] = useState<InputType>(InputType.Text);
    const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>([]);
    const [newQuestionIsRequired, setNewQuestionIsRequired] = useState<boolean>(false);
    const [originalQuestionText, setOriginalQuestionText] = useState<{ [key: number]: string }>({});
    const [originalQuestionHint, setOriginalQuestionHint] = useState<{ [key: number]: string }>({});
    const [newSectionName, setNewSectionName] = useState<string>('');

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const data = await getSections();
                setSections(data);
            } catch (error) {
                console.error('Error fetching sections:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    const handleAddSection = async () => {
        const newSection: Section = {
            id: 0, // Ensure the ID is set to 0 or omitted for new sections
            name: newSectionName,
            questions: [],
            order: sections.length + 1,
            interviewTemplateSections: []
        };

        try {
            const addedSection = await createSection(newSection);
            setSections([...sections, addedSection]);
            setNewSectionName('');
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    const handleAddQuestion = async (sectionId: number) => {
        const section = sections.find(section => section.id === sectionId);
        if (!section) {
            console.error('Section not found');
            return;
        }

        const newQuestion: Question = {
            id: 0, // Ensure the ID is set to 0 or omitted for new questions
            text: newQuestionText,
            hint: newQuestionHint,
            sectionId: sectionId,
            order: section.questions.length + 1,
            isRequired: newQuestionIsRequired,
            inputType: newQuestionInputType,
            inputOptions: newQuestionInputType === InputType.MultipleChoice ? newQuestionOptions.map((option, index) => ({ id: index, questionId: 0, optionText: option })) : []
        };

        try {
            const addedQuestion = await addQuestion(sectionId, newQuestion);
            const updatedSections = sections.map(section => {
                if (section.id === sectionId) {
                    return { ...section, questions: [...section.questions, addedQuestion] };
                }
                return section;
            });
            setSections(updatedSections);
            setNewQuestionText('');
            setNewQuestionHint('');
            setNewQuestionInputType(InputType.Text);
            setNewQuestionOptions([]);
            setNewQuestionIsRequired(false);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleDeleteQuestion = async (sectionId: number, questionId: number) => {
        console.log(`Deleting question ${questionId} from section ${sectionId}`);
        try {
            await deleteQuestion(sectionId, questionId);
            const updatedSections = sections.map(section => {
                if (section.id === sectionId) {
                    return { ...section, questions: section.questions.filter(q => q.id !== questionId) };
                }
                return section;
            });
            console.log('Updated sections:', updatedSections);
            setSections(updatedSections);
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleEditQuestion = (sectionId: number, questionId: number) => {
        console.log(`Editing question ${questionId} in section ${sectionId}`);
        if (editingQuestion[questionId]) {
            // Save changes and exit edit mode
            const question = sections
                .find(section => section.id === sectionId)
                ?.questions.find(q => q.id === questionId);
            if (question) {
                handleSaveQuestion(sectionId, questionId, question.text, question.hint);
            }
        } else {
            // Enter edit mode
            const question = sections
                .find(section => section.id === sectionId)
                ?.questions.find(q => q.id === questionId);
            if (question) {
                setOriginalQuestionText({ ...originalQuestionText, [questionId]: question.text });
                setOriginalQuestionHint({ ...originalQuestionHint, [questionId]: question.hint });
            }
            setEditingQuestion({ ...editingQuestion, [questionId]: true });
        }
    };

    const handleSaveQuestion = async (sectionId: number, questionId: number, newText: string, newHint: string) => {
        console.log(`Saving question ${questionId} in section ${sectionId}`);
        const updatedSections = sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    questions: section.questions.map(q => q.id === questionId ? { ...q, text: newText, hint: newHint } : q),
                };
            }
            return section;
        });

        const updatedQuestion = updatedSections
            .find(section => section.id === sectionId)
            ?.questions.find(q => q.id === questionId);

        if (updatedQuestion) {
            try {
                await updateQuestion(sectionId, questionId, updatedQuestion);
                setSections(updatedSections);
                setEditingQuestion({ ...editingQuestion, [questionId]: false });
            } catch (error) {
                console.error('Error updating question:', error);
            }
        }
    };

    const handleCancelEdit = (sectionId: number, questionId: number) => {
        console.log(`Cancelling edit for question ${questionId} in section ${sectionId}`);
        const updatedSections = sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    questions: section.questions.map(q => q.id === questionId ? { ...q, text: originalQuestionText[questionId], hint: originalQuestionHint[questionId] } : q),
                };
            }
            return section;
        });
        setSections(updatedSections);
        setEditingQuestion({ ...editingQuestion, [questionId]: false });
    };

    const handleDragEnd = (event: DragEndEvent, sectionId: number) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const updatedSections = sections.map(section => {
                if (section.id === sectionId) {
                    const oldIndex = section.questions.findIndex(q => q.id === active.id);
                    const newIndex = section.questions.findIndex(q => q.id === over.id);
                    const reorderedQuestions = arrayMove(section.questions, oldIndex, newIndex);

                    return { ...section, questions: reorderedQuestions.map((q, index) => ({ ...q, order: index + 1 })) };
                }
                return section;
            });
            setSections(updatedSections);

            // Save the updated order to the backend
            const updatedSection = updatedSections.find(section => section.id === sectionId);
            if (updatedSection) {
                updatedSection.questions.forEach(async (question) => {
                    await updateQuestion(sectionId, question.id, question);
                });
            }
        }
    };

    const handleAddOption = () => {
        setNewQuestionOptions([...newQuestionOptions, '']);
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...newQuestionOptions];
        updatedOptions[index] = value;
        setNewQuestionOptions(updatedOptions);
    };

    const handleDeleteOption = (index: number) => {
        const updatedOptions = newQuestionOptions.filter((_, i) => i !== index);
        setNewQuestionOptions(updatedOptions);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Sections
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    label="New Section Name"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <Button variant="contained" onClick={handleAddSection}>
                    Add Section
                </Button>
            </Box>
            <List>
                {sections.map((section) => (
                    <Accordion key={section.id} sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{section.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, section.id)}>
                                <SortableContext items={section.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                                    {section.questions.sort((a, b) => a.order - b.order).map((question) => (
                                        <SortableItem key={question.id} id={question.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                                                <DragHandle id={question.id} />
                                                {editingQuestion[question.id] ? (
                                                    <>
                                                        <TextField
                                                            fullWidth
                                                            defaultValue={question.text}
                                                            onChange={(e) => {
                                                                const updatedSections = sections.map(section => {
                                                                    if (section.id === question.sectionId) {
                                                                        return {
                                                                            ...section,
                                                                            questions: section.questions.map(q => q.id === question.id ? { ...q, text: e.target.value } : q),
                                                                        };
                                                                    }
                                                                    return section;
                                                                });
                                                                setSections(updatedSections);
                                                            }}
                                                            sx={{ mr: 2 }}
                                                        />
                                                        <TextField
                                                            fullWidth
                                                            defaultValue={question.hint}
                                                            onChange={(e) => {
                                                                const updatedSections = sections.map(section => {
                                                                    if (section.id === question.sectionId) {
                                                                        return {
                                                                            ...section,
                                                                            questions: section.questions.map(q => q.id === question.id ? { ...q, hint: e.target.value } : q),
                                                                        };
                                                                    }
                                                                    return section;
                                                                });
                                                                setSections(updatedSections);
                                                            }}
                                                            sx={{ mr: 2 }}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Typography sx={{ flexGrow: 1 }}>{question.text}</Typography>
                                                        <Typography sx={{ flexGrow: 1 }}>{question.hint}</Typography>
                                                        <Typography sx={{ flexGrow: 1 }}>{question.isRequired ? 'Required' : 'Optional'}</Typography>
                                                        <Typography sx={{ flexGrow: 1 }}>{question.inputType}</Typography>
                                                        {question.inputType === InputType.MultipleChoice && (
                                                            <List>
                                                                {question.inputOptions?.map((option) => (
                                                                    <ListItem key={option.id}>
                                                                        <ListItemText primary={option.optionText} />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        )}
                                                    </>
                                                )}
                                                <IconButton onClick={(e) => { e.stopPropagation(); handleEditQuestion(section.id, question.id); }}>
                                                    {editingQuestion[question.id] ? <SaveIcon /> : <EditIcon />}
                                                </IconButton>
                                                <IconButton onClick={(e) => { e.stopPropagation(); editingQuestion[question.id] ? handleCancelEdit(section.id, question.id) : handleDeleteQuestion(section.id, question.id); }}>
                                                    {editingQuestion[question.id] ? <CancelIcon /> : <DeleteIcon />}
                                                </IconButton>
                                            </Box>
                                        </SortableItem>
                                    ))}
                                </SortableContext>
                            </DndContext>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <TextField
                                    label="New Question Text"
                                    value={newQuestionText}
                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                    sx={{ mr: 2 }}
                                />
                                <TextField
                                    label="New Question Hint"
                                    value={newQuestionHint}
                                    onChange={(e) => setNewQuestionHint(e.target.value)}
                                    sx={{ mr: 2 }}
                                />
                                <FormControl sx={{ mr: 2 }}>
                                    <InputLabel>Input Type</InputLabel>
                                    <Select
                                        value={newQuestionInputType}
                                        onChange={(e) => setNewQuestionInputType(e.target.value as InputType)}
                                    >
                                        <MenuItem value={InputType.Text}>Text</MenuItem>
                                        <MenuItem value={InputType.Rating}>Rating</MenuItem>
                                        <MenuItem value={InputType.MultipleChoice}>Multiple Choice</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={newQuestionIsRequired}
                                            onChange={(e) => setNewQuestionIsRequired(e.target.checked)}
                                        />
                                    }
                                    label="Required"
                                    sx={{ mr: 2 }}
                                />
                                <Button variant="contained" onClick={() => handleAddQuestion(section.id)}>
                                    Add Question
                                </Button>
                            </Box>
                            {newQuestionInputType === InputType.MultipleChoice && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="h6">Options</Typography>
                                    {newQuestionOptions.map((option, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <TextField
                                                label={`Option ${index + 1}`}
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                sx={{ mr: 2 }}
                                            />
                                            <IconButton onClick={() => handleDeleteOption(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                    <Button variant="contained" onClick={handleAddOption}>
                                        Add Option
                                    </Button>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </List>
        </Box>
    );
};

export default Sections;
