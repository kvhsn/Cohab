import { GetMe } from '@cohab/shared/src/me';
import { queryOptions } from '@tanstack/react-query';
import { getMe } from './api';
export const keys = {
  all: ['me'] as const,
};

export const getMeQuery = () =>
  queryOptions<GetMe>({
    queryKey: keys.all,
    queryFn: () => getMe(),
  });
