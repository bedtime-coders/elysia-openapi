# `@bedtime-coders/elysia-openapi`

[![npm][npm-version-src]][npm-version-href]
[![Bundlephobia][bundle-src]][bundle-href]
[![Elysia][elysia-src]][elysia-href]
[![License][license-src]][license-href]
[![Stars][github-stars-src]][github-stars-href]

A plugin for [ElysiaJS](https://github.com/elysiajs/elysia) to auto-generate an [OpenAPI](https://github.com/OAI/OpenAPI-Specification) reference page.

## Installation
```bash
bun add @bedtime-coders/elysia-openapi
```

## Example
```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@bedtime-coders/elysia-openapi'

const app = new Elysia()
    .use(openapi())
    .get('/', () => 'hi', { response: t.String({ description: 'sample description' }) })
    .post(
        '/json/:id',
        ({ body, params: { id }, query: { name } }) => ({
            ...body,
            id,
            name
        }),
        {
            params: t.Object({
                id: t.String()
            }),
            query: t.Object({
                name: t.String()
            }),
            body: t.Object({
                username: t.String(),
                password: t.String()
            }),
            response: t.Object({
                username: t.String(),
                password: t.String(),
                id: t.String(),
                name: t.String()
            }, { description: 'sample description' })
        }
    )
    .listen(8080);
```

Visit `http://localhost:8080/docs` to see the generated OpenAPI reference page ✨

# `config`

## `provider`
`@default 'scalar'`

Choose between [Scalar API Reference](https://github.com/scalar/scalar) & [Swagger UI](https://github.com/swagger-api/swagger-ui)

## `scalar`
Customize `scalarConfig`, refers to [Scalar config](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)

## `swagger`
Customize Swagger config, refers to [Swagger 3.0.3 config](https://swagger.io/specification/v3)

## `path`
`@default '/docs'`

The endpoint to expose Swagger UI

## `excludeStaticFile`
`@default true`

Determine if Swagger should exclude static files.

## `exclude`
`@default []`

Paths to exclude from the Swagger endpoint

<!-- Badges-->

[license-src]: https://img.shields.io/github/license/bedtime-coders/elysia-openapi?color=blue
[license-href]: https://github.com/bedtime-coders/elysia-openapi/blob/main/LICENSE
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@bedtime-coders/elysia-openapi?color=blue&label=bundlephobia
[bundle-href]: https://bundlephobia.com/package/@bedtime-coders/elysia-openapi
[elysia-src]: https://img.shields.io/badge/%F0%9F%A6%8A-f6f8fa?label=elysia&color=blue
[elysia-href]: https://elysiajs.com/
[npm-version-src]: https://img.shields.io/npm/v/@bedtime-coders/elysia-openapi?style=color=blue
[npm-version-href]: https://npmjs.com/package/@bedtime-coders/elysia-openapi
[github-stars-src]: https://img.shields.io/github/stars/bedtime-coders/elysia-openapi?color=blue
[github-stars-href]: https://github.com/bedtime-coders/elysia-openapi/stargazers
