import axios from 'axios';
import { InterviewTemplate } from '../DTOs/InterviewTemplate';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: '/api/interviewtemplate', // This will be the base URL for all requests
});

export const getInterviewTemplates = async (): Promise<InterviewTemplate[]> => {
    const response = await axiosInstance.get<InterviewTemplate[]>('');
    return response.data;
};

export const getInterviewTemplateById = async (id: number): Promise<InterviewTemplate> => {
    const response = await axiosInstance.get<InterviewTemplate>(`/${id}`);
    return response.data;
};

export const createInterviewTemplate = async (template: InterviewTemplate): Promise<InterviewTemplate> => {
    const response = await axiosInstance.post<InterviewTemplate>('', template);
    return response.data;
};

export const updateInterviewTemplate = async (template: InterviewTemplate): Promise<void> => {
    // Simplify the payload to include only the necessary identifiers
    const payload = {
        id: template.id,
        name: template.name,
        interviewTemplateSections: template.interviewTemplateSections.map(its => ({
            interviewTemplateId: its.interviewTemplateId ?? template.id,
            sectionId: its.sectionId,
            order: its.order
        }))
    };
    await axiosInstance.put(`/${template.id}`, payload);
};

export const deleteInterviewTemplate = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/${id}`);
};

