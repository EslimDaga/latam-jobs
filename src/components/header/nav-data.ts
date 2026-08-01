export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavGroup = {
  title: string;
  links: NavLink[];
};

export type NavMenu = {
  id: string;
  label: string;
  groups: NavGroup[];
};

export const menus: NavMenu[] = [
  {
    id: "deals",
    label: "Descubre",
    groups: [
      {
        title: "Vuela con nosotros",
        links: [
          { label: "Ofertas de vuelos", href: "/pe/es/ofertas" },
          { label: "Destinos", href: "/pe/es/destinos" },
          { label: "Vuelos nacionales", href: "/pe/es/vuelos-nacionales" },
          { label: "Vuelos internacionales", href: "/pe/es/vuelos-internacionales" },
        ],
      },
      {
        title: "Arma tu viaje",
        links: [
          { label: "Vuelo + Hotel", href: "/pe/es/paquetes" },
          { label: "Alquiler de autos", href: "/pe/es/autos" },
          { label: "Seguro de viaje", href: "/pe/es/seguro" },
        ],
      },
      {
        title: "Experiencia LATAM",
        links: [
          { label: "Cabinas y asientos", href: "/pe/es/cabinas" },
          { label: "Equipaje", href: "/pe/es/equipaje" },
          { label: "Trabaja con nosotros", href: "/vacantes" },
        ],
      },
    ],
  },
  {
    id: "trips",
    label: "Mis viajes",
    groups: [
      {
        title: "Gestiona tu reserva",
        links: [
          { label: "Mis reservas", href: "/pe/es/mis-viajes" },
          { label: "Check-in online", href: "/pe/es/check-in" },
          { label: "Cambiar mi vuelo", href: "/pe/es/cambios" },
          { label: "Solicitar devolución", href: "/pe/es/devoluciones" },
        ],
      },
      {
        title: "Antes de volar",
        links: [
          { label: "Compra de equipaje", href: "/pe/es/equipaje/compra" },
          { label: "Selección de asientos", href: "/pe/es/asientos" },
          { label: "Requisitos de viaje", href: "/pe/es/requisitos" },
        ],
      },
    ],
  },
];

export const utilityLinks: NavLink[] = [
  { label: "Estado de vuelo", href: "/pe/es/flight-status" },
  { label: "LATAM Pass", href: "https://latampass.latam.com/es_pe/", external: true },
];
