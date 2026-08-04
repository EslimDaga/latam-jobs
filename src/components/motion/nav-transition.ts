/**
 * Jerarquía de rutas del sitio. La profundidad decide hacia dónde se desliza el
 * contenido: bajar un nivel avanza (sale por la izquierda), subir retrocede
 * (sale por la derecha). Es la convención de dirección horizontal de siempre —
 * romperla desorienta más que no animar.
 *
 * Las rutas que comparten nivel no tienen dirección; se dejan al fundido neutro
 * del envoltorio, porque un deslizamiento entre hermanas sugiere una jerarquía
 * que no existe.
 */
const ROUTE_DEPTH: Record<string, number> = {
  "/": 0,
  "/vacantes": 1,
  "/cultura": 1,
};

/**
 * Calcula los `transitionTypes` de un `<Link>` comparando la ruta actual con el
 * destino. Devuelve `undefined` —es decir, sin tipo, fundido por defecto—
 * cuando no hay salto real de ruta: anclas de la propia página, `mailto:`,
 * enlaces externos, el mismo camino o dos rutas del mismo nivel.
 *
 * @param pathname Ruta activa (`usePathname()`).
 * @param href     Destino del enlace, con o sin `?query` y `#ancla`.
 */
export function navTransitionTypes(
  pathname: string,
  href: string,
): string[] | undefined {
  // Solo las rutas internas absolutas navegan por el router del lado cliente.
  if (!href.startsWith("/")) return undefined;

  // "/#proceso" y "/vacantes?area=ti" apuntan a "/" y "/vacantes".
  const target = href.split(/[?#]/, 1)[0] || "/";
  if (target === pathname) return undefined;

  const from = ROUTE_DEPTH[pathname];
  const to = ROUTE_DEPTH[target];
  if (from === undefined || to === undefined || from === to) return undefined;

  return to > from ? ["nav-forward"] : ["nav-back"];
}
