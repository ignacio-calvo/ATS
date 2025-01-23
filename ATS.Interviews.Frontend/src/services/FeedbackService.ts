import axios from 'axios';
import { Feedback } from '../DTOs/Feedback';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: '/api/feedback', // This will be the base URL for all requests
});

export const getFeedbacks = async (): Promise<Feedback[]> => {
    const response = await axiosInstance.get<Feedback[]>('');
    return response.data;
};

export const getFeedbackById = async (id: number): Promise<Feedback> => {
    const response = await axiosInstance.get<Feedback>(`/${id}`);
    return response.data;
};

export const createFeedback = async (feedback: Feedback): Promise<Feedback> => {
    const response = await axiosInstance.post<Feedback>('', feedback);
    return response.data;
};

export const updateFeedback = async (id: number, feedback: Feedback): Promise<void> => {
    await axiosInstance.put(`/${id}`, feedback);
};

export const deleteFeedback = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/${id}`);
};

export const saveFeedback = async (feedbacks: Feedback[]): Promise<void> => {
    await axiosInstance.post('/save', feedbacks);
};

export const getFeedbacksByInterviewAndInterviewer = async (interviewId: number, interviewerId: number): Promise<Feedback[]> => {
    const response = await axiosInstance.get<Feedback[]>(`/interview/${interviewId}/interviewer/${interviewerId}`);
    return response.data;
};
