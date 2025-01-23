import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Box, Button, TextField, MenuItem, Select, FormControl, InputLabel, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getInterviewTemplates, createInterviewTemplate, updateInterviewTemplate, deleteInterviewTemplate } from '../services/InterviewTemplateService';
import { getSections } from '../services/SectionService';
import { InterviewTemplate } from '../DTOs/InterviewTemplate';
import { Section } from '../DTOs/Section';
import { InterviewTemplateSection } from '../DTOs/InterviewTemplateSection'; // Correct import

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

const Templates: React.FC = () => {
    const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newTemplateName, setNewTemplateName] = useState<string>('');
    const [expandedTemplate, setExpandedTemplate] = useState<number | false>(false);
    const [selectedSection, setSelectedSection] = useState<number | string>('');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await getInterviewTemplates();
                setTemplates(data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchSections = async () => {
            try {
                const data = await getSections();
                setSections(data);
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };

        fetchTemplates();
        fetchSections();
    }, []);

    const handleAddTemplate = async () => {
        const newTemplate: InterviewTemplate = {
            id: 0, // Ensure the ID is set to 0 or omitted for new templates
            name: newTemplateName,
            interviewTemplateSections: []
        };

        try {
            const addedTemplate = await createInterviewTemplate(newTemplate);
            setTemplates([...templates, addedTemplate]);
            setNewTemplateName('');
            setExpandedTemplate(addedTemplate.id);
        } catch (error) {
            console.error('Error adding template:', error);
        }
    };

    const handleAddSectionToTemplate = async (templateId: number) => {
        const sectionToAdd = sections.find(section => section.id === selectedSection);
        if (sectionToAdd) {
            const updatedTemplates = templates.map(template => {
                if (template.id === templateId) {
                    const newInterviewTemplateSection: InterviewTemplateSection = {
                        interviewTemplateId: templateId,
                        sectionId: sectionToAdd.id,
                        section: sectionToAdd,
                        order: template.interviewTemplateSections.length + 1 // Set order
                    };
                    return { ...template, interviewTemplateSections: [...template.interviewTemplateSections, newInterviewTemplateSection] };
                }
                return template;
            });
            setTemplates(updatedTemplates);
            setSelectedSection('');

            // Update the template in the database
            const updatedTemplate = updatedTemplates.find(template => template.id === templateId);
            if (updatedTemplate) {
                try {
                    await updateInterviewTemplate(updatedTemplate);
                } catch (error) {
                    console.error('Error updating template:', error);
                }
            }
        }
    };

    const handleDeleteSectionFromTemplate = async (templateId: number, sectionId: number) => {
        const updatedTemplates = templates.map(template => {
            if (template.id === templateId) {
                return { ...template, interviewTemplateSections: template.interviewTemplateSections.filter(its => its.sectionId !== sectionId) };
            }
            return template;
        });
        setTemplates(updatedTemplates);

        // Update the template in the database
        const updatedTemplate = updatedTemplates.find(template => template.id === templateId);
        if (updatedTemplate) {
            try {
                await updateInterviewTemplate(updatedTemplate);
            } catch (error) {
                console.error('Error updating template:', error);
            }
        }
    };

    const handleDeleteTemplate = async (templateId: number) => {
        try {
            await deleteInterviewTemplate(templateId);
            setTemplates(templates.filter(template => template.id !== templateId));
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const handleAccordionChange = (templateId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedTemplate(isExpanded ? templateId : false);
    };

    const handleDragEnd = async (event: DragEndEvent, templateId: number) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const updatedTemplates = templates.map(template => {
                if (template.id === templateId) {
                    const oldIndex = template.interviewTemplateSections.findIndex(its => its.sectionId === active.id);
                    const newIndex = template.interviewTemplateSections.findIndex(its => its.sectionId === over.id);
                    const reorderedSections = arrayMove(template.interviewTemplateSections, oldIndex, newIndex);

                    return { ...template, interviewTemplateSections: reorderedSections.map((its, index) => ({ ...its, order: index + 1 })) };
                }
                return template;
            });
            setTemplates(updatedTemplates);

            // Save the updated order to the backend
            const updatedTemplate = updatedTemplates.find(template => template.id === templateId);
            if (updatedTemplate) {
                try {
                    await updateInterviewTemplate(updatedTemplate);
                } catch (error) {
                    console.error('Error updating template:', error);
                }
            }
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Templates
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    label="New Template Name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    sx={{ mr: 2, flexGrow: 1 }}
                />
                <Button variant="contained" onClick={handleAddTemplate} disabled={!newTemplateName.trim()}>
                    Add Template
                </Button>
            </Box>
            <List>
                {templates.map((template) => (
                    <Accordion key={template.id} expanded={expandedTemplate === template.id} onChange={(event, isExpanded) => handleAccordionChange(template.id)(event, isExpanded)} sx={{ width: '100%' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography>{template.name}</Typography>
                                <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template.id); }}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, template.id)}>
                                <SortableContext items={template.interviewTemplateSections.map(its => its.sectionId)} strategy={verticalListSortingStrategy}>
                                    {template.interviewTemplateSections
                                        .sort((a, b) => a.order - b.order) // Sort sections by order
                                        .map((its) => (
                                            <SortableItem key={its.section.id} id={its.section.id}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                    <DragHandle id={its.section.id} />
                                                    <Accordion sx={{ width: '100%' }}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                            <Typography>{its.section.name}</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <List>
                                                                {its.section.questions.sort((a, b) => a.order - b.order).map((question) => (
                                                                    <ListItem key={question.id}>
                                                                        <ListItemText
                                                                            primary={question.text}
                                                                            secondary={question.hint}
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteSectionFromTemplate(template.id, its.sectionId); }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </SortableItem>
                                        ))}
                                </SortableContext>
                            </DndContext>
                            {sections.filter(section => !template.interviewTemplateSections.some(its => its.sectionId === section.id)).length > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    <FormControl sx={{ mr: 2, flexGrow: 1 }}>
                                        <InputLabel id="select-section-label">Select Section</InputLabel>
                                        <Select
                                            labelId="select-section-label"
                                            value={selectedSection}
                                            onChange={(e) => setSelectedSection(e.target.value as number)}
                                            label="Select Section"
                                        >
                                            {sections
                                                .filter(section => !template.interviewTemplateSections.some(its => its.sectionId === section.id))
                                                .map((section) => (
                                                    <MenuItem key={section.id} value={section.id}>
                                                        {section.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                    <Button variant="contained" onClick={() => handleAddSectionToTemplate(template.id)}>
                                        Add Section
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

export default Templates;



