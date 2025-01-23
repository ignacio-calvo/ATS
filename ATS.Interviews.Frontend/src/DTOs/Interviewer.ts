import { Feedback } from './Feedback';
import { InterviewInterviewer } from './InterviewInterviewer';

export interface Interviewer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  feedbacks: Feedback[];
  interviewInterviewers: InterviewInterviewer[];
}