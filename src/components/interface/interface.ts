export interface AllCountriesData {
  toolkit: any;
  countryCode: string;
  name: string;
}

export interface CountriyHolidaysData {
  toolkit: any;
  countryCode: string;
  date: string;
  fixed: boolean;
  global: boolean;
  launchYear?: null;
  localName: string;
  name: string;
}

export interface NoticeType {
  id: number;
  day: number;
  month: number;
  year: number;
  codeCountry: string;
  note: NoteType[];
  noteId: number;
}

export interface NoteType {
  title?: string;
  order?: number;
  color?: string;
}
