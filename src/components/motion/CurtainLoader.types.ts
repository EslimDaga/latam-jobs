/**
 * Props del `CurtainLoader` — la cortina que se parte al centro y se retira al
 * terminar de cargar los recursos de la página. Todo es opcional para que en el
 * layout (Server Component) se monte sin pasarle callbacks no serializables.
 */
export interface CurtainLoaderProps {
  /**
   * Tiempo mínimo que la cortina permanece en pantalla, en ms, para que no
   * parpadee cuando la carga es instantánea. Por defecto 900.
   */
  minDuration?: number;
  /**
   * Tope de seguridad: si `window.load` nunca llega (recurso colgado), la
   * cortina se abre igual pasado este tiempo, en ms. Por defecto 6000.
   */
  maxDuration?: number;
  /** Se llama cuando la cortina termina de abrirse y desmontarse. */
  onComplete?: () => void;
}
