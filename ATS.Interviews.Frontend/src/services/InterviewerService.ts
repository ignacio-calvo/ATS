import axios from 'axios';
import { Interviewer } from '../DTOs/Interviewer';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: '/api/interviewer', // This will be the base URL for all requests
});

export const getInterviewers = async (): Promise<Interviewer[]> => {
    const response = await axiosInstance.get<Interviewer[]>('');
    return response.data;
};

export const getInterviewerById = async (id: number): Promise<Interviewer> => {
    const response = await axiosInstance.get<Interviewer>(`/${id}`);
    return response.data;
};

export const createInterviewer = async (interviewer: Interviewer): Promise<Interviewer> => {
    const response = await axiosInstance.post<Interviewer>('', interviewer);
    return response.data;
};

export const updateInterviewer = async (id: number, interviewer: Interviewer): Promise<void> => {
    await axiosInstance.put(`/${id}`, interviewer);
};

export const deleteInterviewer = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/${id}`);
};

