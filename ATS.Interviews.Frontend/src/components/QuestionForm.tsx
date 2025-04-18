import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, IconButton, Typography } from '@mui/material';
import { Question } from '../DTOs/Question';
import { InputType } from '../DTOs/InputType';
import DeleteIcon from '@mui/icons-material/Delete';

interface QuestionFormProps {
    open: boolean;
    onClose: () => void;
    onSave: (question: Question) => void;
    question?: Question;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ open, onClose, onSave, question }) => {
    const [text, setText] = useState('');
    const [hint, setHint] = useState('');
    const [isRequired, setIsRequired] = useState(false);
    const [inputType, setInputType] = useState<InputType>(InputType.Text);
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
        if (question) {
            setText(question.text);
            setHint(question.hint);
            setIsRequired(question.isRequired);
            setInputType(question.inputType);
            setOptions(question.inputOptions?.map(option => option.optionText) || []);
        }
    }, [question]);

    const handleSave = () => {
        const newQuestion: Question = {
            id: question?.id || 0,
            text,
            hint,
            sectionId: question?.sectionId || 0,
            order: question?.order || 0,
            isRequired,
            inputType,
            inputOptions: inputType === InputType.MultipleChoice ? options.map((option, index) => ({ id: index, questionId: question?.id || 0, optionText: option })) : []
        };
        onSave(newQuestion);
    };

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleDeleteOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{question ? 'Edit Question' : 'Add Question'}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                    <TextField
                        label="Question Text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        sx={{ mb: 2, mt: 2 }}
                        multiline
                        rows={2}
                    />
                    <TextField
                        label="Hint"
                        value={hint}
                        onChange={(e) => setHint(e.target.value)}
                        sx={{ mb: 2 }}
                        multiline
                        rows={4}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isRequired}
                                onChange={(e) => setIsRequired(e.target.checked)}
                            />
                        }
                        label="Required"
                    />
                    <FormControl sx={{ mb: 2 }}>
                        <InputLabel>Input Type</InputLabel>
                        <Select
                            value={inputType}
                            onChange={(e) => setInputType(e.target.value as InputType)}
                        >
                            <MenuItem value={InputType.Text}>Text</MenuItem>
                            <MenuItem value={InputType.Rating}>Rating</MenuItem>
                            <MenuItem value={InputType.MultipleChoice}>Multiple Choice</MenuItem>
                        </Select>
                    </FormControl>
                    {inputType === InputType.MultipleChoice && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">Options</Typography>
                            {options.map((option, index) => (
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
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QuestionForm;

