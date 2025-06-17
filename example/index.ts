import { Elysia, t } from "elysia";
import { openapi } from "../src/index";

const schema = t.Object({
	test: t.Literal("hello"),
});

const app = new Elysia()
	.use(
		openapi({
			provider: "scalar",
			documentation: {
				info: {
					title: "Elysia Scalar",
					version: "0.8.1",
				},
				tags: [
					{
						name: "Test",
						description: "Hello",
					},
				],
				components: {
					schemas: {
						User: {
							description: "string",
						},
					},
					securitySchemes: {
						JwtAuth: {
							type: "http",
							scheme: "bearer",
							bearerFormat: "JWT",
							description: "Enter JWT Bearer token **_only_**",
						},
					},
				},
			},
			swaggerOptions: {
				persistAuthorization: true,
			},
		}),
	)
	.model({ schema })
	.get(
		"/",
		() => {
			return { test: "hello" as const };
		},
		{
			response: "schema",
		},
	)
	.post("/json", ({ body }) => body, {
		parse: "formdata",
		body: "schema",
		response: "schema",
	})
	.listen(3000);
