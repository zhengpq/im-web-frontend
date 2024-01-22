const handleError = async <T>(promise: Promise<T>) => {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
};

export default handleError;
