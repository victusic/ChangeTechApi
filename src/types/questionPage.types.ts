export interface QuestionDTO {
  id: number;
  number: number;
  text: string;
}

export interface AnswerDTO {
  id: number;
  type: number;
  text: string | null;
  rangeMin: number | null;
  rangeMax: number | null;
}

export interface VectorElDTO {
  id: number;
  spoiling: number;
}

export interface AnswerResultDTO {
  vectorParameter: number;
  value: number;
}
