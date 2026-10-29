---
version: alpha
name: "DAM Gestión"
description: "Mesa de operaciones de inventario: azul tinta, superficies claras y datos tabulados."
colors:
  primary: "#145e72"
  ink: "#182d42"
  background: "#f1f4f7"
  surface: "#ffffff"
  muted: "#596a7b"
  border: "#d8e1e8"
  warning: "#8a4c08"
  danger: "#b42332"
typography:
  body:
    fontFamily: "Segoe UI, Arial, sans-serif"
  display:
    fontFamily: "Bahnschrift, Segoe UI, sans-serif"
rounded:
  DEFAULT: "0.75rem"
  control: "0.5rem"
spacing:
  section-gap: "1.5rem"
  page-max: "76rem"
components:
  button: { height: "2.75rem" }
  table: { textColor: "{colors.ink}" }
  input: { height: "2.75rem" }
---

# DAM Gestión

## Overview

Herramienta de inventario para una actividad de DAM, en español de España. Registro de producto, no sitio de marketing. La referencia es una mesa de operaciones: una columna de navegación azul tinta y hojas de trabajo claras. La firma visual es el contraste entre las cifras tabuladas y un pequeño acento ámbar en los avisos de stock. Evitar degradados decorativos, imágenes de almacenes sin relación con los datos y cifras inventadas.

La fuente canónica de tokens es `src/theme/variables.scss` (modelo B). Este documento refleja sus valores; `src/global.scss`, Cabecera, TablaProductos e Indicador consumen esas variables. No mantener paletas independientes en cada pantalla.

## Colors

Primary identifica acciones; ink, texto principal y navegación; background, área de trabajo; surface, formularios y tablas; muted, texto secundario; border, separación; warning, stock bajo; danger, errores. Tema claro deliberado para consistencia y contraste de evaluación. El modo de alto contraste del sistema conserva sus colores.

## Typography

Segoe UI para lectura y controles; Bahnschrift para títulos breves, con fallback local. Números con `tabular-nums`. Precios y fechas `es-ES`, EUR y zona Europe/Madrid cuando se indique una hora. Títulos en sentence case, cuerpo de 16 px y altura 1.5.

## Layout

Panel lateral de 260 px en escritorio; menú Ionic modal en móvil. Cabecera compartida con botón de menú. Contenido hasta 76 rem, relleno fluido 18–40 px. Tabla con desplazamiento horizontal propio cuando haga falta; formularios con altura natural. Ningún elemento de búsqueda obliga a desbordar el viewport.

## Elevation & Depth

Fondos y bordes comunican jerarquía. Sombra tenue solo en formularios y superficies principales. No sombras anidadas en cada celda o indicador.

## Shapes

Superficies a 12 px, controles a 8 px. Etiquetas de estado compactas. Iconos Ionicons acompañados de texto salvo el botón accesible de menú.

## Components

Cabecera es la única dueña del toolbar. TablaProductos gestiona la búsqueda local y selección simple; Indicador emite activación; las páginas gestionan servicios y permisos. Botones mínimos de 44 px con hover, foco, deshabilitado y estado de carga estable. Los errores se muestran en texto y se anuncian; los campos conservan valores. Los estados vacíos explican el resultado sin inventar datos.

La búsqueda local se mantiene solo durante la vista (excepción deliberada a URL por tratarse de inventario autenticado). Los filtros de exportación se distinguen de la búsqueda visual de tabla. El gráfico mantiene una tabla con los valores. Animación solo en el feedback de controles, 160 ms; respetar reduced-motion. Scrollbars globales visibles y estables.

## Do's and Don'ts

- Mostrar únicamente métricas derivadas de Supabase y señalar explícitamente los documentos simulados.
- Reutilizar las variables de Ionic y los tres componentes compartidos.
- No ocultar controles de menú en móvil ni deshabilitar el zoom.
- No sustituir permisos RLS por la apariencia de botones o rutas.
