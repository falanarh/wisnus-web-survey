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
  depends_on?: Array<{
    code: string;
    value?: string | string[];
    value_not?: string | string[];
  }>;
  validation: {
    required: boolean;
    input_type?: string;
    min?: number;
    max?: number;
    pattern?: string;
  };
}