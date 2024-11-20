export interface ServerSuccessInterface<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}
