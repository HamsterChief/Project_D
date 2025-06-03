export type Appointment = {
  id: number;
  email: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  audioUri?: string;
};

export const initialAppointments: Appointment[] = [
  { id: 1, email: 'melvernvandijk@outlook.com', title: 'Meeting', description:'Meeting met Taha', startDate: new Date('2025-04-24T14:00'), endDate: new Date('2025-04-24T15:00') },
  { id: 2, email: 'taha@gmail.com', title: 'Chillen', description:'Chillen met Henk', startDate: new Date('2025-04-25T09:30'), endDate: new Date('2025-04-24T10:00') },
  { id: 3, email: 'lucathierry@live.nl', title: 'Lunch', description:'Lunch met team', startDate: new Date('2025-04-26T12:00'), endDate: new Date('2025-04-24T13:00') },
];