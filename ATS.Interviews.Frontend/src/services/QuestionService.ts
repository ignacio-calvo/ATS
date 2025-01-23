import axios from 'axios';
import { Question } from '../DTOs/Question';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: '/api/question', // This will be the base URL for all requests
});

export const getQuestions = async (): Promise<Question[]> => {
    const response = await axiosInstance.get<Question[]>('');
    return response.data;
};

export const getQuestionById = async (id: number): Promise<Question> => {
    const response = await axiosInstance.get<Question>(`/${id}`);
    return response.data;
};

export const createQuestion = async (question: Question): Promise<Question> => {
    const response = await axiosInstance.post<Question>('', question);
    return response.data;
};

export const updateQuestion = async (id: number, question: Question): Promise<void> => {
    await axiosInstance.put(`/${id}`, question);
};

export const deleteQuestion = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/${id}`);
};


