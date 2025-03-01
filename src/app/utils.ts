import { z } from "zod";

export type Either<E, A> =
  | { isRight: true; right: A }
  | { isRight: false; left: E };

export namespace Either {
  export const Right = <L, R>(right: R): Either<L, R> => ({
    isRight: true,
    right,
  });
  export const Left = <L, R>(left: L): Either<L, R> => ({
    isRight: false,
    left,
  });
}

export const optionalField = <K extends string, T>(
  key: K,
  value: T,
): { [key in K]?: NonNullable<T> } => {
  if (value != undefined) {
    return { [key as K]: value } as { [key in K]?: NonNullable<T> };
  } else {
    return {};
  }
};

/** To be used in form rules validators */
export const validateViaZod =
  <A>(schema: z.Schema<A>, errorMessage: string) =>
  (value: unknown): Promise<void> =>
    schema
      .safeParseAsync(value)
      .then((result) =>
        result.success ? Promise.resolve() : Promise.reject(errorMessage),
      );
