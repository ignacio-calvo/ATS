import { Interview } from './Interview';
import { Interviewer } from './Interviewer';
import { InterviewTemplate } from './InterviewTemplate';

export interface InterviewInterviewer {
    interviewId: number;
    interview: Interview;
    interviewerId: number;
    interviewer: Interviewer;
    interviewTemplateId?: number;
    interviewTemplate?: InterviewTemplate;
}
