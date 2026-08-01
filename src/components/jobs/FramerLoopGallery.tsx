"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
  type Variants,
} from "framer-motion";

/**
 * FramerLoopGallery — sección "Nuestra cultura".
 *
 * Collage flotante con parallax por scroll construido EXCLUSIVAMENTE con las
 * fotos propias de LATAM en `public/images/cultura/`. En desktop las imágenes
 * se dispersan en un lienzo posicionado; en móvil caen en una grilla limpia.
 */

interface CultureImage {
  src: string;
  alt: string;
  quote?: string;
  name?: string;
  // object-position del recorte: fotos verticales necesitan anclarse al rostro
  // para que object-cover no decapite al colaborador en contenedores apaisados.
  pos?: string;
}

// Las 13 fotos oficiales de "Nuestra cultura" para el collage completo según Figma
const IMAGES: CultureImage[] = [
  { src: "/images/cultura/cultura-01.jpg", alt: "Técnica de mantenimiento inspeccionando una aeronave en plataforma" },
  {
    src: "/images/cultura/cultura-02.jpg",
    alt: "Vicente Ignacio Silva, Domain Specialist de Selección de LATAM sonriendo",
    quote: "“soy Domain Specialist de Selección dentro del área digital, lo que le da sentido al rol es con quiénes lo construyo: trabajar cross-país te obliga a salir de tu cabeza, y esa diversidad de miradas termina siendo el ingrediente que le da riqueza real a lo que entregamos.”",
    name: "Vicente",
  },
  { src: "/images/cultura/cultura-03.jpg", alt: "Equipo de agentes de LATAM en la puerta de embarque" },
  {
    src: "/images/cultura/cultura-04.jpg",
    alt: "Rodrigo Crisostomo, colaborador de mantenimiento de LATAM en la turbina de un avión",
    quote: "“Lo que más valoro y que me gusta de trabajar en latam, específicamente en el área de mantenimiento de línea base, es que cada día representa un nuevo desafío y una oportunidad de aprendizaje.”",
    name: "Rodrigo",
  },
  { src: "/images/cultura/cultura-05.jpg", alt: "Avión de LATAM volando sobre las nubes al atardecer" },
  {
    src: "/images/cultura/cultura-06.jpg",
    alt: "Andrés Mesía, colaborador de LATAM sonriendo en oficina",
    quote: "“Lo que más disfruto de trabajar en LATAM es el dinamismo de la industria y la oportunidad de aprender de personas con esa misma pasión por la aviación.”",
    name: "Andrés",
  },
  {
    src: "/images/cultura/cultura-07.jpg",
    alt: "Vanina Valle, colaboradora de LATAM sonriendo en oficina",
    quote: "“LATAM es una organización con un propósito fuerte y un sentido de pertenencia único. Es una verdadera escuela que impulsa el crecimiento profesional y personal, enseñando colaboración, resiliencia y la importancia de conectar con el trabajo que uno realiza.”",
    name: "Vanina",
  },
  { src: "/images/cultura/cultura-08.jpg", alt: "Piloto de LATAM junto a la aeronave" },
  { src: "/images/cultura/cultura-09.jpg", alt: "Agente de LATAM ayudando a una pasajera en el autoservicio" },
  { src: "/images/cultura/cultura-10.jpg", alt: "Comandante de LATAM en plataforma junto a un Airbus A320" },
  {
    src: "/images/cultura/cultura-11.jpg",
    alt: "Domenica Aguirre, tripulante de cabina de LATAM sonriendo",
    quote: "“LATAM desde el día uno demostró que cumple lo que promete no solo con nuestros clientes, sino con el núcleo de la empresa como somos nosotros.”",
    name: "Domenica",
  },
  {
    src: "/images/voces/voces-01.jpg",
    alt: "Juan Pablo Rodriguez Henao, colaborador de LATAM CARGO sonriendo",
    quote: "“De LATAM valoro profundamente su cultura humana: una compañía donde te sientes en familia, donde se reconoce el esfuerzo y se brindan oportunidades reales de desarrollo, sin importar la edad o las condiciones físicas.”",
    name: "Juan Pablo",
  },
  {
    src: "/images/voces/voces-02.jpg",
    alt: "Francia Alcaíno, colaboradora de LATAM Airlines sonriendo",
    pos: "50% 8%",
    quote: "“Trabajar en LATAM Airlines ha sido una experiencia verdaderamente transformadora. Viniendo del mundo del periodismo y las comunicaciones, nunca imaginé que encontraría en la aviación un lugar donde me sentiría tan plena y realizada.”",
    name: "Francia",
  },
];

// Disposición en anillo elíptico armónico con separación limpia entre todas las columnas para que no choquen
const SLOTS: {
  img: number;
  cls: string;
  align?: "top" | "bottom" | "center";
  edge?: "left" | "right";
}[] = [
  // COLUMNA 1 (Extremo izquierdo - exterior)
  { img: 8,  cls: "left-[1%]   top-[5%]  w-[150px] lg:w-[175px] aspect-square", align: "top", edge: "left" }, // Top-Left-Outer: kiosco
  { img: 5,  cls: "left-[0%]   top-[37%] w-[150px] lg:w-[175px] aspect-square", align: "center", edge: "left" }, // Middle-Left: Andrés Mesía
  { img: 3,  cls: "left-[1.5%] top-[68%] w-[160px] lg:w-[180px] aspect-square", align: "top", edge: "left" }, // Bottom-Left-Outer: Giovanni turbina
  // COLUMNA 2 (Segunda columna izquierda - separada al 18% para no chocar con col 1 ni con el centro)
  { img: 6,  cls: "left-[18%]  top-[11%] w-[165px] lg:w-[185px] aspect-[4/5]", align: "top" },   // Top-Left-Inner: Vanina Valle
  { img: 9,  cls: "left-[18%]  top-[55%] w-[165px] lg:w-[185px] aspect-[4/5]", align: "top" },   // Bottom-Left-Inner: piloto plataforma
  // CENTRO ARRIBA Y ABAJO (separados en 34% horizontal y alejados del texto central para no cubrir "Sé tú. Volemos más alto.")
  { img: 10, cls: "left-[44%]  top-[3%]  w-[155px] lg:w-[175px] aspect-square", align: "top" }, // Top-Center: Domenica Aguirre
  { img: 12, cls: "left-[34%]  top-[66%] w-[145px] lg:w-[170px] aspect-square", align: "top" }, // Bottom-Center-Left: Francia Alcaíno (se abre hacia ABAJO)
  { img: 4,  cls: "right-[34%] top-[66%] w-[155px] lg:w-[180px] aspect-[4/3]", align: "top" },   // Bottom-Center-Right: avión nubes (se abre hacia ABAJO)
  // PENÚLTIMA COLUMNA (Segunda columna derecha - separada al 18% desde la derecha)
  { img: 7,  cls: "right-[18%] top-[12%] w-[165px] lg:w-[185px] aspect-[4/5]", align: "top" },  // Top-Right-Inner: piloto mujer
  { img: 1,  cls: "right-[18%] top-[68%] w-[145px] lg:w-[170px] aspect-square", align: "top" }, // Bottom-Right-Inner: Vicente Silva (se abre hacia ABAJO)
  // ÚLTIMA COLUMNA (Extremo derecho - exterior)
  { img: 11, cls: "right-[1%]  top-[5%]  w-[150px] lg:w-[175px] aspect-square", align: "top", edge: "right" }, // Top-Right-Outer: Juan Pablo Rodriguez Henao
  { img: 2,  cls: "right-[0%]  top-[39%] w-[160px] lg:w-[185px] aspect-[4/3]", align: "center", edge: "right" },   // Middle-Right: equipo gate F01
  { img: 0,  cls: "right-[1.5%] top-[67%] w-[160px] lg:w-[180px] aspect-[4/5]", align: "top", edge: "right" },  // Bottom-Right-Outer: técnica
];

function CultureCard({
  img,
  cardStyle,
  align = "center",
  edge,
  onRaiseChange,
}: {
  img: CultureImage;
  cardStyle: string;
  align?: "top" | "bottom" | "center";
  // Columnas exteriores del collage: el overlay se ancla al borde y crece
  // hacia adentro para que la sección (overflow-hidden) no lo recorte.
  edge?: "left" | "right";
  // Avisa al slot contenedor que debe subir su z-index mientras el overlay
  // Glass esté visible (incluida la animación de salida), porque el transform
  // del parallax crea un stacking context que el z-50 interno no puede escapar.
  onRaiseChange?: (raised: boolean) => void;
}): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const reduced = useReducedMotion();

  // Si no tiene quote ni name, renderizamos solo la tarjeta normal
  if (!img.quote || !img.name) {
    return (
      <div className={cardStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: img.pos }} />
      </div>
    );
  }

  // Posicionamiento inteligente para evitar recortes arriba o abajo:
  // - Top slots se anclan en 'top-0' y se abren hacia abajo.
  // - Bottom slots se anclan en 'bottom-0' y se abren hacia arriba.
  const horizontalClasses =
    edge === "left" ? "left-0" : edge === "right" ? "right-0" : "-left-10";
  const verticalClasses =
    align === "top" ? "top-0" : align === "bottom" ? "bottom-0" : "-top-8";
  const positionClasses = `${horizontalClasses} ${verticalClasses}`;

  // El scale crece desde el borde anclado para no salirse del viewport.
  const transformOrigin = `${edge ?? "center"} ${
    align === "top" ? "top" : align === "bottom" ? "bottom" : "center"
  }`;

  const initialY = align === "top" ? -14 : align === "bottom" ? 14 : 10;

  // Entrada: spring que emerge desde el borde ancla (scale 0.9 → 1, nunca 1.25
  // como estado final para no dejar el texto rasterizado con transform).
  // Salida: más rápida que la entrada, como espera el usuario.
  const overlayVariants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
      }
    : {
        hidden: { opacity: 0, scale: 0.9, y: initialY },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 340,
            damping: 28,
            mass: 0.9,
            delayChildren: 0.05,
            staggerChildren: 0.05,
          },
        },
        exit: {
          opacity: 0,
          scale: 0.94,
          y: initialY * 0.4,
          transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
        },
      };

  // Imagen → cita → nombre entran en cascada (50ms entre cada uno).
  const itemVariants: Variants = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => {
        setIsHovered(true);
        onRaiseChange?.(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tarjeta base normal */}
      <div
        className={`${cardStyle} transition-opacity duration-300 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: img.pos }} />
      </div>

      {/* Overlay animado al hacer hover (efecto auténtico Glass de Figma: blur 24px, refracción e iluminación -45° + tinte violeta #573AD0 4%) */}
      <AnimatePresence onExitComplete={() => onRaiseChange?.(false)}>
        {isHovered && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute z-50 w-[min(318px,calc(100vw-40px))] sm:w-[330px] rounded-[42px] bg-[rgba(87,58,208,0.04)] p-[22px] backdrop-blur-[16px] backdrop-saturate-[1.4] cursor-pointer ${positionClasses}`}
            style={{
              transformOrigin,
              // Glass de Figma (nodo 89:3589): fill #573AD0 4%, Frost 16,
              // luz -45° 80% → brillo superior-izquierdo que se apaga en diagonal.
              backgroundImage:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.10) 32%, rgba(87, 58, 208, 0.03) 62%, rgba(255, 255, 255, 0.16) 100%)",
              boxShadow:
                "inset 0 2px 2px rgba(255, 255, 255, 0.65), inset 2px 0 2px rgba(255, 255, 255, 0.35), inset 0 -1px 1.5px rgba(31, 0, 153, 0.12), inset -1px 0 1px rgba(255, 255, 255, 0.14), 0 24px 48px -12px rgba(15, 23, 42, 0.35)",
            }}
          >
            <motion.div
              variants={itemVariants}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[30px] shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ objectPosition: img.pos }}
              />
            </motion.div>
            <div className="mt-[21px] px-0.5 pb-0.5 text-left">
              <motion.p
                variants={itemVariants}
                className="text-[13px] font-normal leading-[1.45] text-[#1f0099]"
              >
                {img.quote}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="mt-2.5 text-[13px] font-bold text-[#1f0099]"
              >
                {img.name}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CollageSlot({
  y,
  cls,
  img,
  cardStyle,
  align,
  edge,
}: {
  y?: MotionValue<number>;
  cls: string;
  img: CultureImage;
  cardStyle: string;
  align?: "top" | "bottom" | "center";
  edge?: "left" | "right";
}): React.JSX.Element {
  const [raised, setRaised] = useState(false);

  return (
    <motion.div
      style={{ y, zIndex: raised ? 60 : undefined }}
      className={`absolute ${cls}`}
    >
      <CultureCard
        img={img}
        cardStyle={cardStyle}
        align={align}
        edge={edge}
        onRaiseChange={setRaised}
      />
    </motion.div>
  );
}

function MobileCell({
  img,
  wide,
  edge,
}: {
  img: CultureImage;
  wide: boolean;
  edge?: "left" | "right";
}): React.JSX.Element {
  const [raised, setRaised] = useState(false);

  return (
    <div
      className={`relative aspect-[4/3] rounded-2xl ${wide ? "col-span-2" : ""}`}
      style={{ zIndex: raised ? 60 : undefined }}
    >
      <CultureCard
        img={img}
        cardStyle="relative h-full w-full overflow-hidden rounded-2xl shadow-md cursor-pointer"
        edge={edge}
        onRaiseChange={setRaised}
      />
    </div>
  );
}

export function FramerLoopGallery(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Con motion reducido el parallax se congela en su fotograma inicial (p=0),
  // que es exactamente lo que pinta el SSR. Antes se pasaba `y={undefined}`,
  // pero el servidor siempre evalúa reduced=false y servía los offsets
  // iniciales → mismatch de hidratación para usuarios con motion reducido.
  const quieto = useMotionValue(0);
  const progreso = reduced ? quieto : scrollYProgress;

  // 13 parallax — uno por slot del collage
  const y1 = useTransform(progreso, [0, 1], [70, -70]);
  const y2 = useTransform(progreso, [0, 1], [-50, 50]);
  const y3 = useTransform(progreso, [0, 1], [80, -80]);
  const y4 = useTransform(progreso, [0, 1], [-60, 60]);
  const y5 = useTransform(progreso, [0, 1], [40, -40]);
  const y6 = useTransform(progreso, [0, 1], [90, -90]);
  const y7 = useTransform(progreso, [0, 1], [-70, 70]);
  const y8 = useTransform(progreso, [0, 1], [60, -60]);
  const y9 = useTransform(progreso, [0, 1], [-40, 40]);
  const y10 = useTransform(progreso, [0, 1], [50, -50]);
  const y11 = useTransform(progreso, [0, 1], [-65, 65]);
  const y12 = useTransform(progreso, [0, 1], [75, -75]);
  const y13 = useTransform(progreso, [0, 1], [-55, 55]);
  const ys = [y1, y2, y3, y4, y5, y6, y7, y8, y9, y10, y11, y12, y13];

  // Texto (bloques), con su propio parallax suave.
  const yText1 = useTransform(progreso, [0, 1], [30, -30]);

  const cardStyle =
    "relative overflow-hidden rounded-[1.5rem] shadow-lg border border-black/5 bg-zinc-50 hover:scale-[1.04] hover:shadow-2xl transition-all duration-500 cursor-pointer w-full h-full";

  return (
    <section
      id="cultura"
      ref={containerRef}
      className="relative z-10 -mt-24 overflow-hidden bg-white pb-16 pt-0 lg:-mt-48 lg:pb-36 lg:pt-6"
    >
      <div className="container relative mx-auto max-w-[1550px] px-4">
        {/* Desktop: collage flotante */}
        <div className="relative mx-auto hidden h-[1080px] w-full max-w-[1550px] lg:block">
          {SLOTS.map((slot, i) => (
            <CollageSlot
              key={`slot-${i}`}
              y={ys[i]}
              cls={slot.cls}
              img={IMAGES[slot.img]}
              cardStyle={cardStyle}
              align={slot.align}
              edge={slot.edge}
            />
          ))}

          {/* Titular central + CTA, como en el Figma (nodo 89:2472) */}
          <motion.div
            style={{ y: yText1 }}
            className="absolute left-1/2 top-1/2 z-10 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6 text-center"
          >
            <h2 className="text-[42px] font-bold leading-[40.052px] tracking-[-0.3927px] text-[#1b0088]">
              Sé tú. Volemos más alto.
            </h2>
            <a
              href="#cultura"
              className="inline-flex select-none items-center justify-center rounded-full bg-red-latam px-[17px] py-2.5 text-[15.75px] font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-latam-deep active:scale-95"
            >
              Nuestra cultura
            </a>
          </motion.div>
        </div>

        {/* Móvil/tablet: grilla limpia con las mismas fotos */}
        <div className="flex flex-col gap-8 pt-8 lg:hidden">
          <div className="px-4 text-center">
            <h2 className="text-[clamp(1.75rem,8vw,42px)] font-bold leading-[0.9536] tracking-[-0.3927px] text-[#1b0088]">
              Sé tú. Volemos más alto.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {IMAGES.map((img, i) => (
              <MobileCell
                key={img.src}
                img={img}
                wide={i === 12}
                edge={i === 12 ? "left" : i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <a
              href="#cultura"
              className="rounded-full bg-red-latam px-[17px] py-2.5 text-center text-[15.75px] font-medium text-white shadow-md"
            >
              Nuestra cultura
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


