import { it } from "bun:test";
import SwaggerParser from "@apidevtools/swagger-parser";
import { fail } from "assert";
import { Elysia, t } from "elysia";
import { openapi } from "../src";

const req = (path: string) => new Request(`http://localhost${path}`);

it("returns a valid Swagger/OpenAPI json config for many routes", async () => {
	const app = new Elysia()
		.use(openapi())
		.get("/", () => "hi", {
			response: t.String({ description: "sample description" }),
		})
		.get("/unpath/:id", ({ params: { id } }) => id, {
			response: t.String({ description: "sample description" }),
		})
		.get(
			"/unpath/:id/:name/:age",
			({ params: { id, name } }) => `${id} ${name}`,
			{
				type: "json",
				response: t.String({ description: "sample description" }),
				params: t.Object({ id: t.String(), name: t.String() }),
			},
		)
		.post(
			"/json/:id",
			({ body, params: { id }, query: { name, email, birthday } }) => ({
				...body,
				id,
				name,
				email,
				birthday,
			}),
			{
				params: t.Object({
					id: t.String(),
				}),
				query: t.Object({
					name: t.String(),
					email: t.String({
						description: "sample email description",
						format: "email",
					}),
					birthday: t.String({
						description: "sample birthday description",
						pattern: "\\d{4}-\\d{2}-\\d{2}",
						minLength: 10,
						maxLength: 10,
					}),
				}),
				body: t.Object({
					username: t.String(),
					password: t.String(),
				}),
				response: t.Object(
					{
						username: t.String(),
						password: t.String(),
						id: t.String(),
						name: t.String(),
						email: t.String({
							description: "sample email description",
							format: "email",
						}),
						birthday: t.String({
							description: "sample birthday description",
							pattern: "\\d{4}-\\d{2}-\\d{2}",
							minLength: 10,
							maxLength: 10,
						}),
					},
					{ description: "sample description 3" },
				),
			},
		)
		.route("LOCK", "/lock", () => "locked");

	await app.modules;

	const res = await app.handle(req("/docs/json")).then((x) => x.json());
	await SwaggerParser.validate(res).catch((err) => fail(err));
});
