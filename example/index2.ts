import { Elysia } from "elysia";
import { openapi } from "../src/index";
import { plugin } from "./plugin";

const app = new Elysia({
	// aot: false
})
	.use(
		openapi({
			documentation: {
				info: {
					title: "Elysia",
					version: "0.6.10",
				},
				tags: [
					{
						name: "Test",
						description: "Hello",
					},
				],
				security: [{ JwtAuth: [] }],
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
