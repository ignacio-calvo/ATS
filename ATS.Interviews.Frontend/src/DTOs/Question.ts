import { InputOption } from './InputOption';
import { InputType } from './InputType';

export interface Question {
    id: number;
    text: string;
    hint: string;
    sectionId: number;
    order: number;
    isRequired: boolean;
    inputType: InputType;
    inputOptions?: InputOption[];
}