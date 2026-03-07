import { GetMe } from '@cohab/shared/src/me';
import { queryOptions } from '@tanstack/react-query';
import { getMe } from './api';

export const getMeQuery = () =>
  queryOptions<GetMe>({
    queryKey: ['me'],
    queryFn: () => getMe(),
  });
