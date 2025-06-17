import { Elysia, InternalRoute } from "elysia";
import { openapi } from "../src/index";
import { registerSchemaPath } from "../src/utils";
import { plugin } from "./plugin";

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
				paths: {
					"/b/": {
						get: {
							operationId: "getB",
							summary: "Ping Pong B",
							description: "Lorem Ipsum Dolar",
							tags: ["Test"],
							responses: {
								"200": {
									description: "test",
								},
							},
						},
					},
				},
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
	.use(plugin)
	.listen(3000);

console.log(app.rsaoutes);
