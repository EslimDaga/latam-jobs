// Librería de motion de latam-jobs — animaciones portadas del sitio de Jesko
// Jets (Webflow/GSAP) y reescritas con framer-motion sobre el sistema de
// tokens del proyecto. Ninguna depende de position:absolute para maquetar.

export { Reveal, type RevealProps } from "./Reveal";
export { RevealText, type RevealTextProps } from "./RevealText";
export { Marquee, type MarqueeProps } from "./Marquee";
export { LoopingWords, type LoopingWordsProps } from "./LoopingWords";
export { MagneticButton } from "./MagneticButton";
export { HoverLink, type HoverLinkProps } from "./HoverLink";
export { StickyCta, type StickyCtaProps } from "./StickyCta";
export { Preloader, type PreloaderProps } from "./Preloader";
export { CurtainLoader } from "./CurtainLoader";
export { type CurtainLoaderProps } from "./CurtainLoader.types";

export {
  EASE_ENTER,
  EASE_MOVE,
  SPRING_MAGNETIC,
  type SplitMode,
  type RevealBaseProps,
  type PolymorphicTag,
} from "./motion.types";

// Ya existentes en el proyecto, reexportados para tener el motion en un sitio.
export { SmoothScroll } from "./SmoothScroll";
export { useScrollProgress } from "./useScrollProgress";
export { usePauseOffscreen } from "./usePauseOffscreen";
