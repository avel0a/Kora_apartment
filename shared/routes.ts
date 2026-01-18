import { z } from 'zod';
import { insertBookingSchema, insertContactSchema, rooms, bookings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  rooms: {
    list: {
      method: 'GET' as const,
      path: '/api/rooms',
      responses: {
        200: z.array(z.custom<typeof rooms.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/rooms/:slug',
      responses: {
        200: z.custom<typeof rooms.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  bookings: {
    create: {
      method: 'POST' as const,
      path: '/api/bookings',
      input: insertBookingSchema,
      responses: {
        201: z.custom<typeof bookings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  contact: {
    create: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactSchema,
      responses: {
        201: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
