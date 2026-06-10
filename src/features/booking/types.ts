export type BookingStep = 1 | 2 | 3;

export interface BookingCarData {
  carModel: string;
  year: string;
}

export interface BookingDateData {
  date: string;
}

export type BookingDraft = Partial<BookingCarData & BookingDateData>;
