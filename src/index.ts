/* eslint-disable @typescript-eslint/ban-ts-comment */

import type {
	ApiReferenceConfiguration,
	ReferenceConfiguration,
} from "@scalar/types";
import { Elysia, type InternalRoute } from "elysia";
import type { OpenAPIV3 } from "openapi-types";
import { ScalarRender } from "./scalar";
import { SwaggerUIRender } from "./swagger";
import type { ElysiaOpenAPICConfig } from "./types";
import { filterPaths, registerSchemaPath } from "./utils";

/**
 * Plugin for [elysia](https://github.com/elysiajs/elysia) that auto-generate OpenAPI page.
 *
 * @see https://github.com/bedtime-coders/elysia-openapi
 */
export const openapi = <Path extends string = "/docs">({
	provider = "scalar",
	scalarVersion = "latest",
	scalarCDN = "",
	scalarConfig = {},
	documentation = {},
	version = "5.9.0",
	excludeStaticFile = true,
	path = "/docs" as Path,
	specPath = `${path}/json`,
	exclude = [],
	swaggerOptions = {},
	theme = `https://unpkg.com/swagger-ui-dist@${version}/swagger-ui.css`,
	autoDarkMode = true,
	excludeMethods = ["OPTIONS"],
	excludeTags = [],
}: ElysiaOpenAPICConfig<Path> = {}) => {
	const schema = {};
	let totalRoutes = 0;

	if (!version)
		version = `https://unpkg.com/swagger-ui-dist@${version}/swagger-ui.css`;

	const info = {
		title: "Elysia Documentation",
		description: "Development documentation",
		version: "0.0.0",
		...documentation.info,
	};

	const relativePath = path.startsWith("/") ? path.slice(1) : path;

	const app = new Elysia({ name: "@bedtime-coders/elysia-openapi" });

	const page = new Response(
		provider === "swagger-ui"
			? SwaggerUIRender(
					info,
					version,
					theme,
					JSON.stringify(
						{
							url: specPath,
							dom_id: "#swagger-ui",
							...swaggerOptions,
						},
						(_, value) => (typeof value === "function" ? undefined : value),
					),
					autoDarkMode,
				)
			: ScalarRender(
					info,
					scalarVersion,
					{
						url: specPath,
						...scalarConfig,
						// so we can showcase the elysia theme
						_integration: "elysiajs",
					} satisfies Partial<ApiReferenceConfiguration>,
					scalarCDN,
				),
		{
			headers: {
				"content-type": "text/html; charset=utf8",
			},
		},
	);

	app
		.get(path, page, {
			detail: {
				hide: true,
			},
		})
		.get(
			specPath,
			function openAPISchema() {
				// @ts-expect-error Private property
				const routes = app.getGlobalRoutes() as InternalRoute[];

				if (routes.length !== totalRoutes) {
					const ALLOWED_METHODS = [
						"GET",
						"PUT",
						"POST",
						"DELETE",
						"OPTIONS",
						"HEAD",
						"PATCH",
						"TRACE",
					];
					totalRoutes = routes.length;

					// forEach create a clone of a route (can't use for-of)
					routes.forEach((route: InternalRoute) => {
						if (route.hooks?.detail?.hide === true) return;
						if (excludeMethods.includes(route.method)) return;
						if (
							ALLOWED_METHODS.includes(route.method) === false &&
							route.method !== "ALL"
						)
							return;

						if (route.method === "ALL")
							ALLOWED_METHODS.forEach((method) => {
								registerSchemaPath({
									schema,
									hook: route.hooks,
									method,
									path: route.path,
									// @ts-ignore
									models: app.getGlobalDefinitions?.().type,
									contentType: route.hooks.type,
								});
							});
						else
							registerSchemaPath({
								schema,
								hook: route.hooks,
								method: route.method,
								path: route.path,
								// @ts-ignore
								models: app.getGlobalDefinitions?.().type,
								contentType: route.hooks.type,
							});
					});
				}

				return {
					openapi: "3.0.3",
					...{
						...documentation,
						tags: documentation.tags?.filter(
							(tag) => !excludeTags?.includes(tag?.name),
						),
						info: {
							title: "Elysia Documentation",
							description: "Development documentation",
							version: "0.0.0",
							...documentation.info,
						},
					},
					paths: {
						...filterPaths(schema, {
							excludeStaticFile,
							exclude: Array.isArray(exclude) ? exclude : [exclude],
						}),
						...documentation.paths,
					},
					components: {
						...documentation.components,
						schemas: {
							// @ts-ignore
							...app.getGlobalDefinitions?.().type,
							...documentation.components?.schemas,
						},
					},
				} satisfies OpenAPIV3.Document;
			},
			{
				detail: {
					hide: true,
				},
			},
		);

	return app;
};

export type { ElysiaOpenAPICConfig };
export default openapi;
