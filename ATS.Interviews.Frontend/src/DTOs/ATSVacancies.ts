import { ATSVacancy } from "./ATSVacancy";

export interface ATSVacancies {
  total: number;
  totalPaginas: number;
  vacantes: ATSVacancy[];
}