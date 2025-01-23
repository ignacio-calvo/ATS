import axios from 'axios';
import { Section, Question } from '../DTOs/Section';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: '/api/section', // This will be the base URL for all requests
});

export const getSections = async (): Promise<Section[]> => {
    const response = await axiosInstance.get<Section[]>('');
    return response.data;
};

export const getSectionById = async (id: number): Promise<Section> => {
    const response = await axiosInstance.get<Section>(`/${id}`);
    return response.data;
};

export const createSection = async (section: Section): Promise<Section> => {
    const response = await axiosInstance.post<Section>('', section);
    return response.data;
};

export const updateSection = async (id: number, section: Section): Promise<void> => {
    await axiosInstance.put(`/${id}`, section);
};

export const deleteSection = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/${id}`);
};

// New functions for handling questions
export const addQuestion = async (sectionId: number, question: Question): Promise<Question> => {
    const response = await axiosInstance.post<Question>(`/${sectionId}/questions`, question);
    return response.data;
};

export const updateQuestion = async (sectionId: number, questionId: number, question: Question): Promise<void> => {
    await axiosInstance.put(`/${sectionId}/questions/${questionId}`, question);
};

export const deleteQuestion = async (sectionId: number, questionId: number): Promise<void> => {
    await axiosInstance.delete(`/${sectionId}/questions/${questionId}`);
};

