import { AxiosError } from 'axios';

export type TMetaItem = {
    code: number;
    status: string;
    message: string;
  };
export type TMetaErrorResponse = AxiosError<TMetaItem>;