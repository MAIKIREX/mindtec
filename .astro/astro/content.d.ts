declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"posts": {
"3-ejemplos-de-neuromarketing-en-la-vida-diaria-que-quiza-no-sabias.md": {
	id: "3-ejemplos-de-neuromarketing-en-la-vida-diaria-que-quiza-no-sabias.md";
  slug: "3-ejemplos-de-neuromarketing-en-la-vida-diaria-que-quiza-no-sabias";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"5-tips-diferenciar-tu-marca.md": {
	id: "5-tips-diferenciar-tu-marca.md";
  slug: "5-tips-diferenciar-tu-marca";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"codigo-cultural.md": {
	id: "codigo-cultural.md";
  slug: "codigo-cultural";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"como-emocionar-a-mis-clientes.md": {
	id: "como-emocionar-a-mis-clientes.md";
  slug: "como-emocionar-a-mis-clientes";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"conoce-las-5c-del-neuromarketing-y-potenciate.md": {
	id: "conoce-las-5c-del-neuromarketing-y-potenciate.md";
  slug: "conoce-las-5c-del-neuromarketing-y-potenciate";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"diferencias-hombres-y-mujeres-al-comprar-i.md": {
	id: "diferencias-hombres-y-mujeres-al-comprar-i.md";
  slug: "diferencias-hombres-y-mujeres-al-comprar-i";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"eres-capaz-de-descubrir-mentiras-de-tu-cliente-aprende-como-hacerlo-parte-i.md": {
	id: "eres-capaz-de-descubrir-mentiras-de-tu-cliente-aprende-como-hacerlo-parte-i.md";
  slug: "eres-capaz-de-descubrir-mentiras-de-tu-cliente-aprende-como-hacerlo-parte-i";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"fidelizar_cliente.md": {
	id: "fidelizar_cliente.md";
  slug: "fidelizar_cliente";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"herramientas-recoleccion-datos-cualitativos.md": {
	id: "herramientas-recoleccion-datos-cualitativos.md";
  slug: "herramientas-recoleccion-datos-cualitativos";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"investigacion-de-mercado-en-bolivia-consumer-behavior.md": {
	id: "investigacion-de-mercado-en-bolivia-consumer-behavior.md";
  slug: "investigacion-de-mercado-en-bolivia-consumer-behavior";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"investigacion-de-mercado-en-pymes-paso-a-paso.md": {
	id: "investigacion-de-mercado-en-pymes-paso-a-paso.md";
  slug: "investigacion-de-mercado-en-pymes-paso-a-paso";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"investigacion-de-mercados-con-neuromarketing.md": {
	id: "investigacion-de-mercados-con-neuromarketing.md";
  slug: "investigacion-de-mercados-con-neuromarketing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"investigacion-de-mercados-consumidor.md": {
	id: "investigacion-de-mercados-consumidor.md";
  slug: "investigacion-de-mercados-consumidor";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"investigacion-de-mercados-cuantitativa-vs-cualitativa.md": {
	id: "investigacion-de-mercados-cuantitativa-vs-cualitativa.md";
  slug: "investigacion-de-mercados-cuantitativa-vs-cualitativa";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"mente_del_consumidor.md": {
	id: "mente_del_consumidor.md";
  slug: "mente_del_consumidor";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"por-que-utilizar-neuromarketing-en-mi-publicidad.md": {
	id: "por-que-utilizar-neuromarketing-en-mi-publicidad.md";
  slug: "por-que-utilizar-neuromarketing-en-mi-publicidad";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"publicidad-efectiva-en-tu-campana-como-saber-si-lo-sera.md": {
	id: "publicidad-efectiva-en-tu-campana-como-saber-si-lo-sera.md";
  slug: "publicidad-efectiva-en-tu-campana-como-saber-si-lo-sera";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"que-es-el-neuromarketing.md": {
	id: "que-es-el-neuromarketing.md";
  slug: "que-es-el-neuromarketing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
"sabes-la-diferencia-entre-marketing-de-emociones-y-neuromarketing.md": {
	id: "sabes-la-diferencia-entre-marketing-de-emociones-y-neuromarketing.md";
  slug: "sabes-la-diferencia-entre-marketing-de-emociones-y-neuromarketing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
