import SchemaBuilder from "@pothos/core";
import ErrorsPlugin from "@pothos/plugin-errors";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import RelayPlugin from "@pothos/plugin-relay";
import { DateTimeResolver } from "graphql-scalars";
import { type Avatar } from "~/constants/type";

import { type YogaContext } from "~/graphql/context";
import { prisma } from "~/utils/db";

const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  Objects: {
    Avatar: Avatar;
  };
  PrismaTypes: PrismaTypes;
  Context: YogaContext;
}>({
  defaultFieldNullability: false,
  plugins: [
    ErrorsPlugin,
    PrismaPlugin,
    RelayPlugin,
  ],
  errors: {
    defaultTypes: [],
  },
  prisma: {
    client: prisma,
  },
  relay: {
    clientMutationId: "omit",
    cursorType: "String",
  },
});

builder.addScalarType("DateTime", DateTimeResolver);
builder.objectType("Avatar", {
  fields: (t) => ({
    name: t.exposeString("name"),
    url: t.exposeString("url"),
  }),
});
builder.objectType(Error, {
  name: "Error",
  fields: (t) => ({
    message: t.string({
      resolve: (root) =>
        root.name === "Error" ? root.message : "Something went wrong",
    }),
  }),
});
builder.queryType({});
builder.mutationType({});

export { builder };
