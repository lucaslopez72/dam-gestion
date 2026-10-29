# DAM Gestión — Desarrollo de Interfaces

Aplicación Ionic + Angular de gestión de inventario. El proyecto original está en `Documents/DAM 2/DI/Actividad 1/dam-gestion`; el servidor de desarrollo utiliza **http://localhost:4202**.

## Enlaces de entrega

- Aplicación: https://lucaslopez72.github.io/dam-gestion/
- Código fuente e historial: https://github.com/lucaslopez72/dam-gestion
- Documentación técnica: https://lucaslopez72.github.io/dam-gestion/documentacion/
- Manual: este README y la página Ayuda de la aplicación.

GitHub Actions valida, compila y publica automáticamente cada cambio en main. En producción se utilizan rutas con # para permitir recargas en GitHub Pages; localhost mantiene sus rutas habituales. Las credenciales de evaluación se entregan en el PDF privado del docente, nunca en este repositorio.

## Arranque y comprobaciones

Requisitos: Node.js 22 LTS y npm. Ejecutar desde la raíz del proyecto:

```sh
npm ci
npm start
npm test -- --watch=false
npm run build
npm run docs
```

La aplicación compilada queda en `www`. Compodoc genera la documentación técnica en `www/documentacion`. Generar la documentación después de la compilación, porque esta limpia la carpeta de salida. `netlify.toml` ejecuta pruebas, compila y genera documentación antes de publicar. Las rutas se redirigen a `index.html` para que una recarga en `/dashboard` funcione.

## Arquitectura

Se aplica separación MVVM: las plantillas presentan los datos; las páginas coordinan estado y navegación; los servicios encapsulan autenticación, acceso a datos y generación de informes. Las páginas se cargan de forma diferida. Los componentes TablaProductos, Indicador y Cabecera reciben Inputs y emiten Outputs sin depender de una página concreta.

- `services/auth.ts`: sesión real de Supabase y roles `admin`/`usuario` de `app_metadata.rol`. No se confía en `user_metadata`.
- `guards/auth.guard.ts`: espera la restauración de sesión antes de comprobar acceso.
- `services/productos.ts`: consulta SQL mediante la API REST de Supabase y alta y edición de productos. Las políticas RLS del servidor deben permitir lectura a ambos roles y escritura solo a administrador. Los guards y botones no sustituyen RLS.
- `services/nombre-disponible.ts`: validación remota asíncrona del nombre al salir del campo. Si falla la red, el alta se bloquea y muestra un error. La comprobación evita duplicados en el uso normal; no sustituye una restricción única transaccional en la base de datos.
- `services/documentos.ts`: simulación documental NoSQL permitida por el enunciado. Lee `assets/documentos-demo.json` con Promises y emite instantáneas cada diez segundos con RxJS mientras el dashboard está visible. No es una conexión real a Firestore. Se cancela la suscripción al salir o destruir la vista.
- `pages/dashboard`: consulta SQL y documentos concurrentemente con `Promise.all`. Un fallo de la fuente documental se muestra por separado y no oculta el catálogo SQL.
- `services/informes.ts`: PDF paginado y CSV UTF-8 del catálogo filtrado. El CSV escapa comillas y neutraliza fórmulas. jsPDF se carga de forma diferida.

## Manual de usuario

### Acceder

Abrir la aplicación e introducir el correo y la contraseña de una cuenta de evaluación confirmada en Supabase. No se admiten las antiguas cuentas simuladas. Ante credenciales incorrectas o falta de conexión, se muestra un mensaje y se vuelve a habilitar Entrar. No guardar contraseñas en el repositorio ni en este manual público. Las credenciales de evaluación se entregan únicamente al docente por un canal privado.

### Consultar productos

Después del acceso se muestra Productos. Ambos roles pueden consultar el catálogo, buscar por nombre y seleccionar una fila. Actualizar vuelve a consultar Supabase. Cerrar sesión finaliza la sesión local de Supabase y regresa al acceso.

### Registrar un producto (administrador)

Abrir Nuevo producto. Introducir un nombre de 3 a 120 caracteres, precio positivo y stock entero no negativo. Al salir del campo Nombre se consulta Supabase: el formulario indica si ya existe o si no ha podido comprobarlo. Esperar a que termine antes de guardar. El mensaje de éxito se muestra únicamente cuando el servicio confirma la inserción; después se abre Productos. Ante un error incierto de red, comprobar el listado antes de repetir el guardado.

### Editar un producto (administrador)

En Productos, pulsar Editar junto al registro. El formulario carga el nombre, precio y stock actuales. Cambiar los campos y pulsar Guardar cambios. El nombre actual es válido; se comprueba que no coincida con otro producto. Cancelar vuelve al catálogo sin guardar. La actualización mantiene el identificador y la fecha de creación, y solo se confirma si Supabase devuelve el registro actualizado. El usuario estándar no ve el botón y no puede abrir la ruta ni actualizar mediante la API.

### Dashboard e informes (administrador)

Los indicadores muestran referencias, unidades, valor del inventario (precio × stock) y productos con hasta cinco unidades. Pulsar Stock bajo filtra tabla y gráfico; pulsar Referencias recupera el catálogo completo. El campo Filtrar por nombre también limita el conjunto exportado. El gráfico representa hasta diez productos, ordenados por stock, y se acompaña de una tabla accesible con los valores.

Descargar PDF y Descargar CSV generan archivos con los filtros activos. El PDF repite la cabecera en cada página. El CSV usa separador `;`, UTF-8 con BOM y comillas escapadas. La búsqueda interna de la tabla es una ayuda visual adicional y no modifica los filtros del informe.

Los avisos al pie del dashboard pertenecen a una **simulación NoSQL**, independiente del inventario real. La hora de última lectura permite observar las actualizaciones.

### Móvil, teclado y PWA

En pantallas pequeñas usar Abrir menú de navegación en la cabecera. Tab y Mayús+Tab recorren los controles; Enter o Espacio activan botones y filtros. El zoom del navegador está habilitado. En producción HTTPS, el manifiesto y el service worker permiten instalar la aplicación si el navegador lo ofrece. Solo se almacenan recursos estáticos: **los datos y la autenticación de Supabase requieren conexión**. No se anuncia funcionamiento offline del inventario.

## Datos y seguridad

Para reproducir el backend en otro proyecto, ejecutar `supabase/schema.sql` y después `supabase/seed.sql` en su SQL Editor. No ejecutar estos archivos para cambiar un proyecto de terceros: contienen las políticas de esta actividad. El proyecto configurado ya tiene las políticas y los 12 productos de demostración, por lo que no hace falta volver a sembrarlo. Las cuentas de evaluación no se incluyen en esos scripts.

La configuración del cliente contiene exclusivamente la URL de Supabase y su clave **publicable**, que no es una clave administrativa. Nunca introducir `service_role`, claves secretas ni contraseñas en el frontend o el historial Git. El acceso efectivo depende de las políticas RLS del proyecto Supabase. Los datos usados para evaluación deben ser sintéticos.

## Control de versiones y entrega

Se conserva el repositorio Git original, con sus ramas `main`, `develop` y `feature/navegacion`. No se reconstruye un historial retroactivo. Los nuevos avances deben registrarse mediante commits reales. El workflow `.github/workflows/ci.yml` valida las ramas y pull requests; Netlify puede publicar automáticamente desde el repositorio autorizado.

El enunciado exige un repositorio accesible al docente, una URL pública operativa, cuentas de ambos roles, Lighthouse con Accessibility y Best Practices ≥90 y documentación generada. No considerar completados el despliegue, la auditoría ni el acceso de una cuenta estándar hasta verificarlos. El ZIP de entrega debe contener exclusivamente el PDF final de enlaces y evidencias; nunca incluir `node_modules` ni credenciales en un repositorio público.
