/// <reference types="react/canary" />
// <ViewTransition> solo está declarado en el canal canary de @types/react. La
// referencia triple-slash carga esas declaraciones y desaparece al compilar: un
// `import ... from "react/canary"` sí llegaría al bundler, que no sabría
// resolverlo porque ese módulo no existe en tiempo de ejecución. El componente
// en sí lo exporta el React canary que App Router usa por debajo.
import { ViewTransition } from "react";

/**
 * Traducción de tipo de navegación a clase de animación. Las clases las resuelve
 * globals.css con los pseudoelementos `::view-transition-old/new`.
 *
 * `default` cubre las navegaciones sin tipo —el botón atrás del navegador y los
 * gestos de deslizamiento no lo llevan— con un fundido neutro, que es preferible
 * al corte seco de no animar nada.
 */
const NAV_ANIMATION = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "page-fade",
};

/**
 * PageTransition — envoltorio de contenido de página para las transiciones de
 * ruta. Va dentro de cada `page.tsx` y no del layout: una View Transition de
 * entrada/salida necesita que el nodo se monte y desmonte, y el layout compartido
 * nunca lo hace.
 */
export function PageTransition({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    /* `default="none"` deja el envoltorio quieto en las transiciones que no son
       de ruta. Sin él, cualquier `startTransition` de la página —los filtros de
       /vacantes reescribiendo el query, un revelado de Suspense— arrastraría el
       documento entero en una animación que nadie pidió. */
    <ViewTransition enter={NAV_ANIMATION} exit={NAV_ANIMATION} default="none">
      {/* El envoltorio replica el `flex flex-col` del <body> para que el
          `flex-1` del <main> siga midiendo contra el alto de la ventana. */}
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
