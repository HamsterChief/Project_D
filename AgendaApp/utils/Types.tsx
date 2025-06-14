

export interface Task {
  id: number;
  title: string;
  description?: string;
  startDate: string; 
  endDate: string;   
  finished: boolean
}