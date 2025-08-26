import * as z from 'zod';

export type RepositoryFromSchema<T> = {
  data: T;
  updateData: (fields: Partial<T>) => T;
};

export const repositoryFromSchema = <T>(
  schema: z.ZodType<T>,
  initialData?: T,
): RepositoryFromSchema<T> => {
  let data = initialData || ({} as T);

  const updateData = (fields: Partial<T>) => {
    try {
      const newData = { ...data, ...fields };
      schema.parse(newData);
      data = newData;
    } catch (error) {
      console.error(error);
    }
    return data;
  };

  return {
    data,
    updateData,
  };
};
