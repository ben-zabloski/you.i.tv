import { normalize as normalizr, schema } from "normalizr";

const video = new schema.Entity(
  "videos",
  {},
  {
    idAttribute: (value: any, parent: any, key: string): string =>
      value.id.videoId,
  }
);

// Define a users schema

export function normalize(data: any) {
  return normalizr(data.items, [video]);
}
