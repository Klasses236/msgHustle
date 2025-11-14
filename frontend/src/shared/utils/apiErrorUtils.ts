export const getApiErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'error' in error.data
  ) {
    return (error.data as { error: string }).error;
  }
  return 'Ошибка при выполнении запроса';
};
