export interface Question {
  code: string;
  text: string;
  type: string;
  unit?: string;
  additional_info?: string;
  options?: string[]; // Add this line
  validation: {
    required: boolean;
    input_type?: string;
    min?: number;
    max?: number;
  };
}
