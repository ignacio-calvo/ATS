import { Section } from './Section';

export interface InterviewTemplateSection {
    interviewTemplateId: number;
    sectionId: number;
    section: Section;
    order: number;
}
