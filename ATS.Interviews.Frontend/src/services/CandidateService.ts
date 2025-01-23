import axios from 'axios';
import { Candidate } from '../DTOs/Candidate';

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
    baseURL: '/api/candidate', // This will be the base URL for all requests
});

export const getCandidates = async (): Promise<Candidate[]> => {
    const response = await axiosInstance.get<Candidate[]>('');
    return response.data;
};

export const getCandidateById = async (id: number): Promise<Candidate> => {
    const response = await axiosInstance.get<Candidate>(`/${id}`);
    return response.data;
};

export const createCandidate = async (candidate: Candidate): Promise<Candidate> => {
    const response = await axiosInstance.post<Candidate>('', candidate);
    return response.data;
};

export const updateCandidate = async (id: number, candidate: Candidate): Promise<Candidate> => {
    const response = await axiosInstance.put<Candidate>(`/${id}`, candidate);
    return response.data;
};

export const deleteCandidate = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/${id}`);
};
