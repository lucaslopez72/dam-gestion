# Contrato de interfaz

Fuentes: enunciado Actividad individual 1, README y políticas de Supabase existentes. Diseño: DESIGN.md.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Table Selection | TablaProductos | Input productos y Output seleccion | Selección simple, sin acciones masivas | tabla-productos.spec.ts |
| Form | ReactiveFormsModule e IonInput | Servicios Auth y Productos; validadores del alta | Acceso y alta | login.page.spec.ts; nombre-disponible.spec.ts |
| Scrollbar | src/global.scss | Variables de tema | Scroll Ionic y tabla horizontal | navegador estrecho |
| Toast | Mensajes inline de las páginas | role=status y role=alert | Éxito no modal y error persistente | tests de login |
| CRUD | Productos y Router | API Supabase con RLS | Lectura ambos roles, alta admin | nuevo-producto.page.spec.ts |

## Flujos y estados

Acceso: envío único → pendiente → sesión válida → Productos; error → formulario conservado y botón habilitado. Guard espera restauración. No cambiar roles desde el cliente. Los fallos de red no significan credenciales incorrectas.

Alta: validación síncrona y remota al perder foco → pendiente → Guardar → confirmación API → Productos. Error → valores conservados. Un resultado incierto exige consultar el catálogo antes de repetir. No hay edición ni borrado en esta actividad; no añadir acciones destructivas aparentes.

Dashboard: consulta simultánea SQL/documentos → carga → métricas, tabla y gráfico; error documental independiente de SQL. Suscripción documental se cancela al salir. PDF/CSV reflejan los filtros activos del dashboard, no la búsqueda interna de tabla. Exportación bloquea clics duplicados y anuncia resultado.

## Accesibilidad y locale

Español, moneda EUR, números `es-ES`; etiquetas, errores y estados de foco en los controles. Formularios novalidate; nunca alert/confirm/prompt del navegador. Menú modal de Ionic conserva navegación por teclado. Búsquedas con botón Limpiar, etiquetas visibles y estados de resultados. Contraste objetivo WCAG AA y Lighthouse Accessibility/Best Practices ≥90. Zoom permitido; reduced-motion respetado.

## Seguridad y datos

Fuente de permisos: Supabase RLS y app_metadata.rol. Las cuentas de evaluación y contraseñas van solo al docente, fuera del repositorio público. No se autorizan acciones administrativas por query strings o parámetros del navegador. Simulación NoSQL rotulada. No fabricar estados de conexión o cifras.
