import { type HttpStatusCode } from 'axios';
import type ErrorHandlerMap from '../common/request-error-handler';
import { type ErrorCode } from '../const/error-code';

export type ErrorHandlerMapKey = keyof typeof ErrorHandlerMap;

export interface RequestResponse<T> {
  code: ErrorCode;
  statusCode: HttpStatusCode;
  data: T | null;
  message: string;
}

export interface SocketResponse<T> {
  code: ErrorCode;
  statusCode: HttpStatusCode;
  data: T;
  message: string;
}

export interface ImageUploaderData {
  url: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export enum MessageAvatarPoi {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum MessageState {
  SENDING = 'SENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}
