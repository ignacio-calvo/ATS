import React, { useEffect, useState } from 'react';
import { Typography, List, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Box, Button, TextField, IconButton, FormControlLabel, Checkbox, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import InfoIcon from '@mui/icons-material/Info';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getSections, createSection, addQuestion, updateQuestion, deleteQuestion, deleteSection } from '../services/SectionService';
import { Section } from '../DTOs/Section';
import { Question } from '../DTOs/Question';
import { InputType } from '../DTOs/InputType';
import QuestionForm from './QuestionForm';

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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
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

    const handleDeleteSection = async (sectionId: number) => {
        try {
            await deleteSection(sectionId);
            setSections(sections.filter(section => section.id !== sectionId));
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    const handleAddQuestion = async (sectionId: number, question: Question) => {
        const section = sections.find(section => section.id === sectionId);
        if (!section) {
            console.error('Section not found');
            return;
        }

        try {
            const addedQuestion = await addQuestion(sectionId, question);
            const updatedSections = sections.map(section => {
                if (section.id === sectionId) {
                    return { ...section, questions: [...section.questions, addedQuestion] };
                }
                return section;
            });
            setSections(updatedSections);
            setIsModalOpen(false);
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
        const question = sections
            .find(section => section.id === sectionId)
            ?.questions.find(q => q.id === questionId);
        if (question) {
            setSelectedQuestion(question);
            setIsModalOpen(true);
        }
    };

    const handleSaveQuestion = async (question: Question) => {
        console.log(`Saving question ${question.id} in section ${question.sectionId}`);
        const updatedSections = sections.map(section => {
            if (section.id === question.sectionId) {
                return {
                    ...section,
                    questions: section.questions.map(q => q.id === question.id ? question : q),
                };
            }
            return section;
        });

        try {
            await updateQuestion(question.sectionId, question.id, question);
            setSections(updatedSections);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating question:', error);
        }
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

    const handleOpenModal = (sectionId: number) => {
        setSelectedQuestion({ id: 0, text: '', hint: '', sectionId, order: 0, isRequired: false, inputType: InputType.Text, inputOptions: [] });
        setIsModalOpen(true);
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
                            <Typography sx={{ flexGrow: 1 }}>{section.name}</Typography>
                            <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteSection(section.id); }}>
                                <DeleteIcon />
                            </IconButton>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, section.id)}>
                                <SortableContext items={section.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                                    {section.questions.sort((a, b) => a.order - b.order).map((question) => (
                                        <SortableItem key={question.id} id={question.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                                                <DragHandle id={question.id} />
                                                <Typography sx={{ flexGrow: 1, textAlign: 'left' }}>{question.text}</Typography>
                                                <Tooltip title={question.hint}>
                                                    <IconButton>
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <FormControlLabel
                                                    control={<Checkbox checked={question.isRequired} disabled />}
                                                    label="Required"
                                                />
                                                <IconButton onClick={(e) => { e.stopPropagation(); handleEditQuestion(section.id, question.id); }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(section.id, question.id); }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </SortableItem>
                                    ))}
                                </SortableContext>
                            </DndContext>
                            <Button variant="contained" onClick={() => handleOpenModal(section.id)} sx={{ mt: 2 }}>
                                Add Question
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </List>
            <QuestionForm
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={selectedQuestion?.id === 0 ? (question) => handleAddQuestion(selectedQuestion.sectionId, question) : handleSaveQuestion}
                question={selectedQuestion}
            />
        </Box>
    );
};

export default Sections;
