/**
 * Datos de la vista de Vacantes (/vacantes), portados 1:1 desde el Figma
 * "[RH+] Trabalhe Conosco" (nodo 3298:16095). Las seis primeras vacantes son
 * las que aparecen en el diseño; el resto completa las "20 vacantes con
 * postulación abierta" del contador.
 */

export type VacanteArea =
  | "Tripulación de cabina"
  | "Pilotos"
  | "Tecnología y datos"
  | "Mantenimiento"
  | "Aeropuertos y operaciones"
  | "Comercial y clientes"
  | "Corporativo";

export type VacanteModalidad = "Presencial" | "Híbrido" | "Remoto";

export type VacanteEstado = "Abierto" | "Nuevo" | "Últimos días";

export type VacanteJornada = "Completa" | "Parcial" | "Turnos";

export interface Vacante {
  id: string;
  area: VacanteArea;
  titulo: string;
  /** Etiqueta corta de ubicación, p. ej. "Santiago, CL". */
  ubicacion: string;
  modalidad: VacanteModalidad;
  estado: VacanteEstado;
  jornada: VacanteJornada;
  idioma: string;
  /** Carga horaria visible en la tarjeta; opcional (la primera del diseño no la muestra). */
  horas?: string;
  /** Secciones del detalle. Si faltan, el panel muestra el placeholder del diseño. */
  sobreElRol?: string;
  loQueHaras?: string;
  loQueBuscamos?: string;
}

export const VACANTES: Vacante[] = [
  {
    id: "tripulante-cabina-scl",
    area: "Tripulación de cabina",
    titulo: "Tripulante de Cabina",
    ubicacion: "Santiago, CL",
    modalidad: "Presencial",
    estado: "Abierto",
    jornada: "Completa",
    idioma: "Español",
  },
  {
    id: "primer-oficial-a320-scl",
    area: "Pilotos",
    titulo: "Primer Oficial A320",
    ubicacion: "Santiago, CL",
    modalidad: "Presencial",
    estado: "Nuevo",
    jornada: "Completa",
    idioma: "Español / Inglés",
    horas: "40h/semana",
  },
  {
    id: "data-engineer-scl",
    area: "Tecnología y datos",
    titulo: "Data Engineer",
    ubicacion: "Santiago, CL",
    modalidad: "Remoto",
    estado: "Nuevo",
    jornada: "Completa",
    idioma: "Español",
    horas: "40h/semana",
  },
  {
    id: "tecnico-linea-gru",
    area: "Mantenimiento",
    titulo: "Técnico de Línea",
    ubicacion: "São Paulo, BR",
    modalidad: "Remoto",
    estado: "Últimos días",
    jornada: "Completa",
    idioma: "Portugués",
    horas: "40h/semana",
  },
  {
    id: "agente-rampa-bog",
    area: "Aeropuertos y operaciones",
    titulo: "Agente de Rampa",
    ubicacion: "Bogotá, CO",
    modalidad: "Remoto",
    estado: "Abierto",
    jornada: "Completa",
    idioma: "Español",
    horas: "40h/semana",
  },
  {
    id: "product-designer-gru",
    area: "Tecnología y datos",
    titulo: "Product Designer",
    ubicacion: "São Paulo, BR",
    modalidad: "Remoto",
    estado: "Últimos días",
    jornada: "Completa",
    idioma: "Portugués / Español",
    horas: "40h/semana",
  },
  {
    id: "capitan-b787-scl",
    area: "Pilotos",
    titulo: "Capitán Boeing 787",
    ubicacion: "Santiago, CL",
    modalidad: "Presencial",
    estado: "Abierto",
    jornada: "Turnos",
    idioma: "Español / Inglés",
  },
  {
    id: "analista-experiencia-lim",
    area: "Comercial y clientes",
    titulo: "Analista de Experiencia del Cliente",
    ubicacion: "Lima, PE",
    modalidad: "Híbrido",
    estado: "Nuevo",
    jornada: "Completa",
    idioma: "Español",
    horas: "40h/semana",
  },
  {
    id: "ingeniero-confiabilidad-scl",
    area: "Mantenimiento",
    titulo: "Ingeniero de Confiabilidad",
    ubicacion: "Santiago, CL",
    modalidad: "Presencial",
    estado: "Abierto",
    jornada: "Completa",
    idioma: "Español / Inglés",
    horas: "40h/semana",
  },
  {
    id: "coordinador-operaciones-gru",
    area: "Aeropuertos y operaciones",
    titulo: "Coordinador de Operaciones de Vuelo",
    ubicacion: "São Paulo, BR",
    modalidad: "Presencial",
    estado: "Abierto",
    jornada: "Turnos",
    idioma: "Portugués / Inglés",
  },
  {
    id: "backend-engineer-scl",
    area: "Tecnología y datos",
    titulo: "Backend Engineer",
    ubicacion: "Santiago, CL",
    modalidad: "Remoto",
    estado: "Abierto",
    jornada: "Completa",
    idioma: "Español / Inglés",
    horas: "40h/semana",
  },
  {
    id: "tripulante-cabina-gru",
    area: "Tripulación de cabina",
    titulo: "Tripulante de Cabina",
    ubicacion: "São Paulo, BR",
    modalidad: "Presencial",
    estado: "Nuevo",
    jornada: "Turnos",
    idioma: "Portugués / Español",
  },
  {
    id: "analista-carga-mia",
    area: "Aeropuertos y operaciones",
    titulo: "Analista de Carga Internacional",
    ubicacion: "Miami, US",
    modalidad: "Presencial",
    estado: "Abierto",
    jornada: "Completa",
    idioma: "Español / Inglés",
    horas: "40h/semana",
  },
  {
    id: "especialista-revenue-scl",
    area: "Comercial y clientes",
    titulo: "Especialista en Revenue Management",
    ubicacion: "Santiago, CL",
    modalidad: "Híbrido",
    estado: "Abierto",
    jornada: "Completa",
    idioma: "Español / Inglés",
    horas: "40h/semana",
  },
  {
    id: "tecnico-avionica-scl",
    area: "Mantenimiento",
    titulo: "Técnico en Aviónica",
    ubicacion: "Santiago, CL",
    modalidad: "Presencial",
    estado: "Últimos días",
    jornada: "Turnos",
    idioma: "Español",
  },
  {
    id: "data-analyst-bog",
    area: "Tecnología y datos",
    titulo: "Data Analyst",
    ubicacion: "Bogotá, CO",
    modalidad: "Remoto",
    estado: "Abierto",
    jornada: "Completa",
    idioma: "Español",
    horas: "40h/semana",
  },
  {
    id: "supervisor-aeropuerto-lim",
    area: "Aeropuertos y operaciones",
    titulo: "Supervisor de Aeropuerto",
    ubicacion: "Lima, PE",
    modalidad: "Presencial",
    estado: "Abierto",
    jornada: "Turnos",
    idioma: "Español",
  },
  {
    id: "analista-sostenibilidad-scl",
    area: "Corporativo",
    titulo: "Analista de Sostenibilidad",
    ubicacion: "Santiago, CL",
    modalidad: "Híbrido",
    estado: "Nuevo",
    jornada: "Completa",
    idioma: "Español / Inglés",
    horas: "40h/semana",
  },
  {
    id: "instructor-tripulacion-gru",
    area: "Tripulación de cabina",
    titulo: "Instructor de Tripulación",
    ubicacion: "São Paulo, BR",
    modalidad: "Presencial",
    estado: "Abierto",
    jornada: "Completa",
    idioma: "Portugués / Español",
  },
  {
    id: "people-partner-scl",
    area: "Corporativo",
    titulo: "People Business Partner",
    ubicacion: "Santiago, CL",
    modalidad: "Híbrido",
    estado: "Últimos días",
    jornada: "Completa",
    idioma: "Español",
    horas: "40h/semana",
  },
];

export const AREAS: VacanteArea[] = [
  "Tripulación de cabina",
  "Pilotos",
  "Tecnología y datos",
  "Mantenimiento",
  "Aeropuertos y operaciones",
  "Comercial y clientes",
  "Corporativo",
];

export const MODALIDADES: VacanteModalidad[] = ["Presencial", "Híbrido", "Remoto"];

export const ESTADOS: VacanteEstado[] = ["Abierto", "Nuevo", "Últimos días"];

export const UBICACIONES: string[] = [...new Set(VACANTES.map((v) => v.ubicacion))];

/** Nombre del parámetro de búsqueda que preselecciona una vacante en /vacantes. */
export const VACANTE_PARAM = "vacante";

/**
 * Enlace a la vista de vacantes apuntando a un cargo concreto. Lo usan las
 * secciones del home (tablero de embarque, testimonios…) para que al pulsar una
 * fila el usuario aterrice en /vacantes con esa vacante ya abierta. Si el cargo
 * no existe en el catálogo, cae al listado completo en vez de romper el enlace.
 */
export function vacanteHref(titulo?: string): string {
  if (!titulo) return "/vacantes";
  const objetivo = titulo.trim().toLowerCase();
  const match = VACANTES.find((v) => v.titulo.toLowerCase() === objetivo);
  return match ? `/vacantes?${VACANTE_PARAM}=${match.id}` : "/vacantes";
}
