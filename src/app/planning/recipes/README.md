# 📦 Recipes Module — Restock

## Ubicación
Extrae la carpeta `recipes/` y colócala en:
```
src/app/planning/recipes/
```

## Estructura
```
recipes/
├── index.ts                              ← Barrel exports
├── recipes.routes.ts                     ← Lazy routes
├── domain/
│   ├── model/
│   │   ├── recipe.entity.ts
│   │   └── ingredient.entity.ts
│   └── commands/
│       ├── create-recipe.command.ts
│       ├── update-recipe.command.ts
│       └── delete-recipe.command.ts
├── infrastructure/
│   ├── recipes.response.ts
│   ├── recipes.assembler.ts
│   └── recipes-api-endpoint.ts          ← Mock funcional con RxJS (HTTP real comentado)
├── application/
│   └── recipes.store.ts                 ← Signals store, CRUD, modales, cálculo de costo
└── presentation/
    ├── views/
    │   ├── recipes-list/                ← Grid de recetas + métricas + búsqueda
    │   └── recipe-builder/              ← Detalle + tabla de ingredientes
    └── components/
        └── modals/
            ├── recipe-modal/            ← Create / Edit modal
            └── delete-modal/            ← Confirm delete modal
```

## Integración en el routing padre (planning.routes.ts)
```typescript
{
  path: 'recipes',
  loadChildren: () =>
    import('./recipes/recipes.routes').then(m => m.RECIPES_ROUTES),
}
```

## Dependencias esperadas de Shared
```typescript
import { BaseEntity }      from 'src/app/shared/domain/model/base-entity';
import { BaseResource,
         BaseResponse }    from 'src/app/shared/infrastructure/base-response';
import { BaseAssembler }   from 'src/app/shared/infrastructure/base-assembler';
import { BaseApiEndpoint } from 'src/app/shared/infrastructure/base-api-endpoint';
```

## Notas clave
- **estimatedCost** se recalcula localmente sumando `(unitPrice × quantity)` antes de cada POST/PUT.
- El endpoint usa mock con `of(...).pipe(delay(...))`. Para conectar a HTTP real, descomenta las líneas `// return this.http...` y borra el mock.
- Standalone components (Angular 17+), Signals (`signal`, `computed`), lazy loading.
- Moneda: **S/.** (soles peruanos).
