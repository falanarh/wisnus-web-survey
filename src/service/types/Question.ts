export interface Question {
  code: string;
  text: string;
  type: string;
  unit?: string;
  additional_info?: string;
  options?: Array<string | {
    text: string;
    additional_info?: string;
  }>;
  multiple?: boolean;
  instruction?: string;
  allow_other?: boolean;
  layered_question?: Question[];
  validation: {
    required: boolean;
    input_type?: string;
    min?: number;
    max?: number;
    pattern?: string;
  };
}