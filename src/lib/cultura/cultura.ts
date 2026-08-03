/* ────────────────────────────────────────────────────────────────────────────
 * Contenido de la vista /cultura.
 *
 * Textos literales del Figma "[RH+] Trabalhe Conosco", marco "Cultura"
 * (#3416:11384). Vive aquí y no en los componentes para que copy y maqueta se
 * puedan tocar por separado, igual que `lib/vacantes/vacantes.ts`.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Presencia por región (#3416:11461) — las píldoras de la tarjeta de cifras. */
export interface GrupoPresencia {
  region: string;
  paises: string[];
}

export const PRESENCIA: GrupoPresencia[] = [
  {
    region: "Sudamérica",
    paises: ["Argentina", "Brasil", "Chile", "Colombia", "Ecuador", "Perú", "Paraguay"],
  },
  { region: "Norteamérica", paises: ["EE. UU.", "México"] },
  { region: "Europa y Oceanía", paises: ["Europa", "Oceanía"] },
];

/** Los cuatro atributos JETS (#3416:11503). La letra es la marca de agua. */
export interface ValorJets {
  letra: string;
  rotulo: string;
  descripcion: string;
}

export const VALORES_JETS: ValorJets[] = [
  {
    letra: "J",
    rotulo: "Justos",
    descripcion:
      "Entregamos al cliente lo que prometemos y, si no podemos cumplir, corregimos.",
  },
  {
    letra: "E",
    rotulo: "Empáticos",
    descripcion:
      "Nos ponemos en el lugar del cliente para diseñar soluciones y resolver problemas.",
  },
  {
    letra: "T",
    rotulo: "Transparentes",
    descripcion:
      "Ofrecemos reglas y servicios claros y fáciles de entender para construir una relación de confianza.",
  },
  {
    letra: "S",
    rotulo: "Simple",
    descripcion: "Interactuamos con facilidad y eficiencia, siempre.",
  },
];

/** Las 9 guías culturales (#3416:11565). En el Figma son <details> plegados. */
export interface GuiaCultural {
  id: string;
  titulo: string;
  descripcion: string;
}

export const GUIAS_CULTURALES: GuiaCultural[] = [
  {
    id: "turbulencias",
    titulo: "Anticipamos las siguientes turbulencias",
    descripcion:
      "Observamos el contexto, detectamos riesgos temprano y actuamos antes de que se conviertan en obstáculos.",
  },
  {
    id: "cliente",
    titulo: "Comenzamos por el cliente",
    descripcion:
      "Tomamos decisiones pensando primero en las personas y en la experiencia que necesitan.",
  },
  {
    id: "jets",
    titulo: "Ser JETS",
    descripcion:
      "Trabajamos juntos, con empatía, transparencia y simplicidad para avanzar mejor.",
  },
  {
    id: "excelencia",
    titulo: "Ejecutar con excelencia y eficiencia",
    descripcion:
      "Convertimos las buenas ideas en resultados concretos, cuidando el tiempo y los recursos.",
  },
  {
    id: "liderazgo",
    titulo: "Liderar con propósito",
    descripcion:
      "Tomamos decisiones claras, alineadas con nuestro propósito y con impacto sostenible.",
  },
  {
    id: "adelante",
    titulo: "Estar siempre un paso adelante",
    descripcion:
      "Aprendemos rápido, nos adaptamos y construimos hoy lo que necesitaremos mañana.",
  },
  {
    id: "cooperar",
    titulo: "Cooperar para crecer",
    descripcion:
      "Compartimos conocimiento y trabajamos en red para que el crecimiento sea colectivo.",
  },
  {
    id: "grande",
    titulo: "Pensar en grande",
    descripcion:
      "Buscamos soluciones ambiciosas, viables y capaces de transformar la experiencia de millones.",
  },
  {
    id: "sostenibilidad",
    titulo: "Impulsar la sostenibilidad y la diversidad",
    descripcion:
      "Creamos espacios diversos y tomamos decisiones responsables con las personas y el planeta.",
  },
];

/** "Por qué LATAM" (#3416:11683) — rejilla de 6 celdas con filete interior. */
export interface RazonLatam {
  numero: string;
  titulo: string;
  descripcion: string;
}

export const RAZONES: RazonLatam[] = [
  {
    numero: "01",
    titulo: "Global y multicultural",
    descripcion:
      "Desarrolla tu carrera en una industria global y multicultural, colaborando con personas de diferentes culturas, experiencias y perspectivas.",
  },
  {
    numero: "02",
    titulo: "Entorno dinámico y desafiante",
    descripcion:
      "Sé parte de un entorno en constante evolución, donde cada desafío representa una oportunidad para aprender, innovar y crecer.",
  },
  {
    numero: "03",
    titulo: "Desarrollo de carrera",
    descripcion:
      "Accede a múltiples oportunidades de crecimiento y desarrollo profesional, construyendo una carrera con impacto y proyección.",
  },
  {
    numero: "04",
    titulo: "Conocer el mundo",
    descripcion:
      "Conecta con nuevos destinos, culturas y experiencias que amplían tu mirada y te acercan al mundo.",
  },
  {
    numero: "05",
    titulo: "Cuidamos de las personas de manera justa, empática, transparente y simple",
    descripcion:
      "Forma parte de una cultura que pone a las personas en el centro, promoviendo un ambiente de trabajo JETS, con relaciones basadas en la confianza, el respeto y la colaboración.",
  },
  {
    numero: "06",
    titulo: "Diversidad y sostenibilidad",
    descripcion:
      "Únete a una compañía comprometida con la diversidad, la inclusión y el desarrollo sostenible de Sudamérica, generando un impacto positivo en las comunidades donde operamos.",
  },
];

/** Testimonio destacado (#3416:11736). */
export const TESTIMONIO = {
  inicial: "P",
  nombre: "Paola",
  cargo: "Gerente en LATAM",
  cita: "En mi camino dentro de LATAM encontré más que un lugar para trabajar: un equipo que confía, celebra mis logros y me da libertad para crear soluciones que realmente hacen la diferencia.",
} as const;
