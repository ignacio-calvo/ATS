import { InterviewTemplateSection } from './InterviewTemplateSection';

export interface InterviewTemplate {
    id: number;
    name: string;
    interviewTemplateSections: InterviewTemplateSection[];
}
