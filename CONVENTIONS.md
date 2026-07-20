# Conventions

Implementation habits and restrictions for this repo's TypeScript, beyond
what ESLint enforces directly.

## No classes

`functional/no-classes` is enabled — no `class` keyword anywhere in this
codebase. Classes are normally reached for in two situations; here's what
to do instead for each.

### "Which shape is this?" checks, instead of `instanceof`

If a value can be one of several different shapes, give each shape a
`tag` field with its own fixed value, and check that field instead of
checking a class (this pattern is sometimes called a "discriminated" or
"tagged" union):

```ts
type Circle = { readonly tag: "circle"; readonly radius: number };
type Square = { readonly tag: "square"; readonly side: number };
type Shape = Circle | Square;

function area(shape: Readonly<Shape>): number {
  if (shape.tag === "circle") {
    return Math.PI * shape.radius * shape.radius; // TS knows: a Circle here
  }
  return shape.side * shape.side; // and a Square here
}
```

Only give a type a `tag` field if it's actually mixed with other shapes
somewhere — as a union like above, or because instances of different
shapes travel through one shared channel and need to be told apart after
the fact (our website→Worker logging events are exactly this case). A
type that's never mixed with anything else doesn't need one.

### Hidden/private state, instead of private fields + methods

Write a function that keeps something to itself and hands back only the
functions that are allowed to see it:

```ts
type NameHolder = { readonly getName: () => string };

function createNameHolder(name: string): NameHolder {
  return {
    getName: (): string => name,
  };
}
```

Nothing outside `createNameHolder` can ever reach `name` directly — only
through `getName`, the one thing handed back.
