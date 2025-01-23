import { Interview } from './Interview';

export interface Candidate {
  id: number;
  firstName: string; 
  lastName: string; 
  email: string;
  resumeLink?: string;
  linkedInProfile?: string;
  gitHubProfile?: string;
  otherProfile?: string;
  interviews: Interview[];
}