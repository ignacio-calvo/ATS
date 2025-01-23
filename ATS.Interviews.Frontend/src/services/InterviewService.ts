import axios from 'axios';
import { Interview } from '../DTOs/Interview';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: '/api/interview', // This will be the base URL for all requests
});

export const getInterviews = async (): Promise<Interview[]> => {
    const response = await axiosInstance.get<Interview[]>('');
    return response.data;
};

export const getInterviewById = async (id: number): Promise<Interview> => {
    const response = await axiosInstance.get<Interview>(`/${id}`);
    return response.data;
};

export const createInterview = async (interview: Interview): Promise<Interview> => {
    const response = await axiosInstance.post<Interview>('', interview);
    return response.data;
};

export const updateInterview = async (id: number, interview: Interview): Promise<void> => {
    await axiosInstance.put(`/${id}`, interview);
};

export const deleteInterview = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/${id}`);
};

export const removeInterviewerFromInterview = async (interviewId: number, interviewerId: number): Promise<void> => {
    await axiosInstance.delete(`/${interviewId}/interviewer/${interviewerId}`);
};

export const addInterviewerToInterview = async (interviewInterviewer: { interviewId: number, interviewerId: number, interviewTemplateId: number }): Promise<void> => {
    await axiosInstance.post(`/${interviewInterviewer.interviewId}/interviewer`, interviewInterviewer);
};

export const getInterviewsByInterviewer = async (interviewerId: number): Promise<Interview[]> => {
    const response = await axiosInstance.get<Interview[]>(`/byInterviewer/${interviewerId}`);
    return response.data;
};
