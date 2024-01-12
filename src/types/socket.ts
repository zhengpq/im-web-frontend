import { SocketResponse } from '.';

export interface SocketData<T> {
  from: string;
  to: string;
  data: T;
}

export type SocketValue<T> = SocketResponse<SocketData<T>>;
