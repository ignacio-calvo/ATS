import { Interview } from './Interview';
import { Interviewer } from './Interviewer';
import { Question } from './Question';

export interface Feedback {
    id: number;
    interviewId: number;
    interviewerId: number;
    questionId: number;
    comments?: string;
    rating?: number;
    selectedOptionId?: number;
    capturedAt: Date; 
    interview: Interview;
    interviewer: Interviewer;
    question: Question;
}