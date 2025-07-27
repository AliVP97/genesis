export default interface DateType {
  day?: number;
  month?: string;
  week?: number | string;
  date?: string;
  content?: {
    secondary?: string;
  };
}
