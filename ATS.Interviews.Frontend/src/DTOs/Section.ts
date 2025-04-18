import { Question } from './Question';
import { InterviewTemplateSection } from './InterviewTemplateSection';

export interface Section {
    id: number;
    name: string;
    questions: Question[];
    interviewTemplateSections: InterviewTemplateSection[];
    order: number; // Added order field to support section ordering
}
