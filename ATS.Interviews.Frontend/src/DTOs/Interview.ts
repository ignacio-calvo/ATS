import { Candidate } from './Candidate';
import { Feedback } from './Feedback';
import { InterviewInterviewer } from './InterviewInterviewer';

export interface Interview {
  id: number;
  candidateId: number;
  scheduledDate: string; // Use string for date to simplify JSON serialization
  feedbacks: Feedback[];
  candidate: Candidate;
  interviewInterviewers: InterviewInterviewer[];
  jobDescriptionLink?: string;
}