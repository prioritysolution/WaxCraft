import { yupResolver as createYupResolver } from "@hookform/resolvers/yup";
import type { AnyObjectSchema } from "yup";

const schemaByResolver = new WeakMap<object, AnyObjectSchema>();

export function getFormSchema(control: unknown): AnyObjectSchema | null {
  const resolver = (control as { _options?: { resolver?: object & { __schema?: AnyObjectSchema } } } | null)
    ?._options?.resolver;
  if (!resolver) return null;
  return schemaByResolver.get(resolver) ?? resolver.__schema ?? null;
}

export const yupResolver = ((
  ...args: Parameters<typeof createYupResolver>
) => {
  const resolver = createYupResolver(...args);
  const schema = args[0] as AnyObjectSchema;
  schemaByResolver.set(resolver as object, schema);
  (resolver as { __schema?: AnyObjectSchema }).__schema = schema;
  return resolver;
}) as typeof createYupResolver;
