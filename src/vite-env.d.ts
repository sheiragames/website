// eslint-disable-next-line @typescript-eslint/triple-slash-reference -- vite's own scaffolding convention; client.d.ts has no exports to import, only ambient declarations
/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- declaration merging (augmenting Window) only works with `interface`, `type` cannot do this
interface Window {
	testLog: (needEmail: boolean, errorMessage?: string) => void;
}
