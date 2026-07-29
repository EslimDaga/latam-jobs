"use client";

import { useEffect, useMemo, useRef } from "react";
import { Reveal } from "@/components/motion";

/**
 * VacancyBoard — "Vacantes con embarque abierto".
 *
 * Portado 1:1 desde el diseño de Figma (node 12:334). Es un tablero de
 * embarque de aeropuerto con dos vistas —Lista y Mapa— más un drawer de
 * detalle. La vista Lista anima cada fila con un efecto split-flap (Solari);
 * la vista Mapa proyecta pines Web-Mercator sobre un mapamundi con arcos de
 * ruta y un avión en vuelo. Un reloj en vivo marca la hora de salida.
 *
 * La lógica interactiva original vivía en un componente DCLogic imperativo que
 * operaba sobre el DOM por atributos `data-*`. Para no perder fidelidad, el
 * markup se inyecta tal cual y toda esa lógica se porta dentro de un efecto que
 * trabaja sobre el mismo árbol renderizado. Los estados :hover/:active van en
 * una hoja de estilo con alcance por la clase raíz.
 */

const SG = "var(--font-space-grotesk),system-ui,sans-serif";
const SM = "var(--font-space-mono),monospace";
const LS = "'Latam Sans',var(--font-manrope),sans-serif";

type Palette = Record<string, string> & { light?: string };

type MapJob = {
  mapIdx: number;
  cargo: string;
  area: string;
  ubicacion: string;
  modalidad: string;
  estado: string;
  code: string;
  country: string;
  reqId: string;
  title: string;
  sub: string;
};

type Row = { area: string; cargo: string; ubicacion: string; estado: string; href: string; modalidad?: string };

function palette(light: boolean): Palette {
  if (light)
    return {
      light: "true",
      // Fondo blanco liso (sin gradiente). Los paneles internos pasan a ser
      // tarjetas blancas con filete índigo tenue y sombra suave para conservar
      // definición sobre el blanco del tablero y de la sección.
      boardBg: "#ffffff",
      boardShadow: "none",
      accent: "#e6114c", heading: "#1B0088", body: "#5b6172", label: "#8a90a2",
      chipActiveBg: "#1B0088", chipActiveText: "#ffffff", chipBd: "rgba(27,0,136,.16)", chipText: "#5b6172", hoverBd: "rgba(27,0,136,.42)",
      panelBg: "#ffffff", panelBgSoft: "#fafbff", panelBd: "rgba(27,0,136,.12)", panelShadow: "0 20px 45px -30px rgba(27,0,136,.22)",
      divider: "rgba(27,0,136,.10)", headBg: "rgba(27,0,136,.035)", headText: "#5b6172",
      rowText: "#5b6172", rowHoverBg: "rgba(27,0,136,.045)", rowHoverBd: "rgba(27,0,136,.08)",
      clock: "#1B0088", actionBd: "rgba(27,0,136,.2)", actionColor: "#1B0088", actionHoverText: "#ffffff",
      searchBg: "rgba(255,255,255,.68)", searchBd: "rgba(27,0,136,.12)", inputText: "#1B0088",
      tileText: "#2e3350", tileTextArea: "#3f4564", cargoText: "#1B0088", settleTileBg: "rgba(27,0,136,.07)",
      dBg: "linear-gradient(180deg,#ffffff 0%,#f4f5fb 100%)", dBd: "rgba(27,0,136,.12)", dShadow: "-34px 0 70px -24px rgba(27,0,136,.22)",
      dHeading: "#1B0088", dSub: "#5b6172", dLabel: "#8a90a2",
      dChipBg: "rgba(27,0,136,.05)", dChipBd: "rgba(27,0,136,.14)", dChipText: "#3f4564",
      dTagBg: "rgba(27,0,136,.04)", dTagBd: "rgba(27,0,136,.1)", dTagText: "#6b7186",
      dCardBg: "rgba(27,0,136,.035)", dCardBd: "rgba(27,0,136,.09)", dGridVal: "#1B0088",
      dListText: "#3f4564", dCloseBg: "rgba(27,0,136,.04)", dCloseBd: "rgba(27,0,136,.14)", dCloseColor: "#1B0088", dCloseHoverBg: "rgba(27,0,136,.08)", dCloseHoverBd: "rgba(27,0,136,.28)",
      dFooterBg: "rgba(255,255,255,.92)", dFooterBd: "rgba(27,0,136,.09)",
      dSaveBd: "rgba(27,0,136,.16)", dSaveText: "#1B0088", dSaveHoverBg: "rgba(27,0,136,.05)", dSaveHoverBd: "rgba(27,0,136,.3)",
      mapField: "#f5f5fb", pinGlow: "rgba(230,17,76,.18)", pinLabelBg: "rgba(255,255,255,.72)", zoomText: "#1B0088",
      cardBg: "#ffffff", cardBd: "rgba(27,0,136,.08)", cardShadow: "0 6px 18px -12px rgba(27,0,136,.30)", countBadgeBg: "rgba(27,0,136,.07)", cardHoverBg: "#f3f3f7", groupMeta: "rgba(27,0,136,.45)",
    };
  return {
    light: "",
    boardBg:
      "radial-gradient(120% 90% at 82% 8%, rgba(255,72,110,.22), transparent 55%), radial-gradient(90% 90% at 12% 96%, rgba(84,96,255,.24), transparent 55%), radial-gradient(140% 130% at 20% 10%, #34394f 0%, #232739 46%, #1a1d2b 100%)",
    boardShadow: "0 40px 90px -30px rgba(0,0,0,.6)",
    accent: "#ff6982", heading: "#F4F4F6", body: "#A7AAB3", label: "#8F94A3",
    chipActiveBg: "#F4F4F6", chipActiveText: "#0c0d15", chipBd: "rgba(255,255,255,.16)", chipText: "#A7AAB3", hoverBd: "rgba(255,255,255,.4)",
    panelBg: "rgba(24,27,40,.52)", panelBgSoft: "rgba(24,27,40,.32)", panelBd: "rgba(255,255,255,.14)", panelShadow: "0 20px 50px -30px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)",
    divider: "rgba(255,255,255,.08)", headBg: "rgba(255,255,255,.05)", headText: "#AEB2BF",
    rowText: "#A7AAB3", rowHoverBg: "rgba(255,255,255,.06)", rowHoverBd: "rgba(255,255,255,.1)",
    clock: "#F4F4F6", actionBd: "rgba(255,255,255,.22)", actionColor: "#F4F4F6", actionHoverText: "#0c0d15",
    searchBg: "rgba(255,255,255,.09)", searchBd: "rgba(255,255,255,.2)", inputText: "#F4F4F6",
    tileText: "#C7CAD2", tileTextArea: "#A7AAB3", cargoText: "#F4F4F6", settleTileBg: "rgba(255,255,255,.05)",
    dBg: "linear-gradient(180deg,#191d29 0%,#12141d 100%)", dBd: "rgba(255,255,255,.1)", dShadow: "-34px 0 70px -24px rgba(0,0,0,.7)",
    dHeading: "#F4F4F6", dSub: "#A7AAB3", dLabel: "#8F94A3",
    dChipBg: "rgba(255,255,255,.06)", dChipBd: "rgba(255,255,255,.12)", dChipText: "#C7CAD2",
    dTagBg: "rgba(255,255,255,.04)", dTagBd: "rgba(255,255,255,.08)", dTagText: "#8F94A3",
    dCardBg: "rgba(255,255,255,.03)", dCardBd: "rgba(255,255,255,.07)", dGridVal: "#F4F4F6",
    dListText: "#C7CAD2", dCloseBg: "rgba(255,255,255,.05)", dCloseBd: "rgba(255,255,255,.16)", dCloseColor: "#F4F4F6", dCloseHoverBg: "rgba(255,255,255,.12)", dCloseHoverBd: "rgba(255,255,255,.3)",
    dFooterBg: "rgba(16,18,26,.92)", dFooterBd: "rgba(255,255,255,.08)",
    dSaveBd: "rgba(255,255,255,.16)", dSaveText: "#F4F4F6", dSaveHoverBg: "rgba(255,255,255,.06)", dSaveHoverBd: "rgba(255,255,255,.3)",
    mapField: "#12141d", pinGlow: "rgba(255,105,130,.22)", pinLabelBg: "rgba(255,255,255,.06)", zoomText: "#F4F4F6",
    cardBg: "rgba(255,255,255,.045)", cardBd: "rgba(255,255,255,.09)", cardShadow: "0 6px 18px -12px rgba(0,0,0,.5)", countBadgeBg: "rgba(255,255,255,.08)", cardHoverBg: "rgba(255,255,255,.09)", groupMeta: "rgba(200,204,230,.55)",
  };
}

function now(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
}

function buildData(theme: "Claro" | "Oscuro") {
  const light = theme === "Claro";
  const p = palette(light);

  const rows: Row[] = [
    { area: "TRIPULACIÓN", cargo: "Tripulante de Cabina", ubicacion: "Santiago, CL", estado: "Abierto", href: "#postular" },
    { area: "PILOTOS", cargo: "Primer Oficial A320", ubicacion: "Lima, PE", estado: "Nuevo", href: "#postular" },
    { area: "MANTENIMIENTO", cargo: "Técnico de Línea", ubicacion: "São Paulo, BR", estado: "Últimos días", href: "#postular" },
    { area: "TECNOLOGÍA", cargo: "Data Engineer", ubicacion: "Santiago, CL", estado: "Nuevo", href: "#postular" },
    { area: "OPERACIONES", cargo: "Agente de Rampa", ubicacion: "Bogotá, CO", estado: "Abierto", href: "#postular" },
    { area: "TECNOLOGÍA", cargo: "Product Designer", ubicacion: "Remoto", estado: "Últimos días", href: "#postular" },
  ];
  const restAreas = ["Pilotos", "Tripulación de cabina", "Mantenimiento", "Aeropuertos y operaciones", "Corporativo", "Tecnología y datos"];

  const pinsRaw = [
    { code: "MIA", lon: -80.3, lat: 25.8, count: 1 },
    { code: "BOG", lon: -74.1, lat: 4.7, count: 2 },
    { code: "UIO", lon: -78.5, lat: -0.2, count: 1 },
    { code: "LIM", lon: -77.0, lat: -12.0, count: 2 },
    { code: "GRU", lon: -46.6, lat: -23.5, count: 3 },
    { code: "SCL", lon: -70.6, lat: -33.4, count: 4 },
    { code: "MAD", lon: -3.7, lat: 40.4, count: 1 },
    { code: "FRA", lon: 8.6, lat: 50.1, count: 1 },
  ];
  // Web Mercator calibrada al PNG world-map (1200×650); % = px/12, py/6.5
  const PX = (lon: number) => 564 + 3.0 * lon;
  const PY = (lat: number) => 399 - 177 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  const mapPins = pinsRaw.map((o) => {
    const big = o.count > 1;
    return { code: o.code, count: o.count, left: (PX(o.lon) / 12).toFixed(2) + "%", top: (PY(o.lat) / 6.5).toFixed(2) + "%", big, small: !big };
  });
  const pinPx: Record<string, [number, number]> = {};
  pinsRaw.forEach((o) => {
    pinPx[o.code] = [PX(o.lon), PY(o.lat)];
  });

  const P = (lon: number, lat: number): [number, number] => [PX(lon), PY(lat)];
  const arc = (a: [number, number], b: [number, number]) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], dist = Math.hypot(dx, dy);
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.max(14, dist * 0.22);
    return "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + b[0].toFixed(1) + " " + b[1].toFixed(1);
  };
  const gru = P(-46.63, -23.55), mad = P(-3.7, 40.42), fra = P(8.68, 50.11), mia = P(-80.19, 25.76), bog = P(-74.08, 4.61);
  const arcPaths = [arc(gru, mad), arc(bog, mia), arc(mad, fra)];

  type Group = { country: string; count: number; code: string; items: { title: string; sub: string; code: string; reqId?: string; mapIdx?: number }[]; meta?: string };
  const mapGroups: Group[] = [
    { country: "CHILE", count: 4, code: "SCL", items: [
      { title: "Analista Sr. Revenue Management", sub: "Gerencia Comercial · Híbrido", code: "SCL" },
      { title: "Ingeniero/a de Confiabilidad Flota A320", sub: "Vicepresidencia de Mantenimiento · Presencial", code: "SCL" },
      { title: "Product Designer", sub: "Digital & eCommerce · Híbrido", code: "SCL" },
      { title: "Analista de Sostenibilidad", sub: "Asuntos Corporativos · Híbrido", code: "SCL" } ] },
    { country: "BRASIL", count: 3, code: "GRU", items: [
      { title: "Coordenador/a de Operações de Rampa", sub: "Operaciones Aeroportuarias · Presencial", code: "GRU" },
      { title: "Analista de Carga Internacional", sub: "LATAM Cargo · Presencial", code: "GRU" },
      { title: "Data Scientist", sub: "Operações Digitais · Híbrido", code: "GRU" } ] },
    { country: "PERÚ", count: 2, code: "LIM", items: [
      { title: "Supervisor/a de Servicio al Pasajero", sub: "Aeropuertos · Presencial · Turnos", code: "LIM" },
      { title: "Analista de Planificación de Red", sub: "Operaciones · Presencial", code: "LIM" } ] },
    { country: "COLOMBIA", count: 2, code: "BOG", items: [
      { title: "Agente de Servicio en Rampa", sub: "Operaciones Aeroportuarias · Presencial", code: "BOG" },
      { title: "Ejecutivo/a Comercial", sub: "Ventas · Presencial", code: "BOG" } ] },
    { country: "ECUADOR", count: 1, code: "UIO", items: [
      { title: "Jefe/a de Aeropuerto", sub: "Operaciones · Presencial", code: "UIO" } ] },
    { country: "ESTADOS UNIDOS", count: 1, code: "MIA", items: [
      { title: "Analista de Revenue Accounting", sub: "Finanzas · Híbrido", code: "MIA" } ] },
    { country: "ESPAÑA", count: 1, code: "MAD", items: [
      { title: "Especialista de Conectividad", sub: "Red y Alianzas · Híbrido", code: "MAD" } ] },
    { country: "ALEMANIA", count: 1, code: "FRA", items: [
      { title: "KAM Carga Europa", sub: "LATAM Cargo · Presencial", code: "FRA" } ] },
  ].map((g) => Object.assign({}, g, { meta: g.count + " vacantes · " + g.code }));

  const cityBy: Record<string, string> = { SCL: "Santiago, CL", GRU: "São Paulo, BR", LIM: "Lima, PE", BOG: "Bogotá, CO", UIO: "Quito, EC", MIA: "Miami, US", MAD: "Madrid, ES", FRA: "Frankfurt, DE" };
  const cityName: Record<string, string> = { SCL: "Santiago", GRU: "São Paulo", LIM: "Lima", BOG: "Bogotá", UIO: "Quito", MIA: "Miami", MAD: "Madrid", FRA: "Frankfurt" };
  const titleCase = (s: string) => (s || "").toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  const modOf = (sub: string) => { const s = sub || ""; if (/Remot/i.test(s)) return "Remota"; if (/Híbrid/i.test(s)) return "Híbrida"; return "Presencial"; };
  const areaOf = (sub: string) => ((sub || "").split("·")[0] || "").trim();
  let mi = 0;
  const mapJobs: MapJob[] = [];
  const jobByCode: Record<string, MapJob[]> = {};
  const countryInfo: Record<string, { name: string; city: string; code: string; count: number }> = {};
  mapGroups.forEach((g) => {
    countryInfo[g.code] = { name: titleCase(g.country), city: cityName[g.code] || "", code: g.code, count: g.count };
    g.items.forEach((it) => {
      const reqId = "LA-" + (2207 + mi * 11);
      it.reqId = reqId;
      const job: MapJob = { mapIdx: mi, cargo: it.title, area: areaOf(it.sub), ubicacion: cityBy[g.code] || g.country, modalidad: modOf(it.sub), estado: "Abierto", code: g.code, country: g.country, reqId, title: it.title, sub: it.sub };
      it.mapIdx = mi;
      mapJobs.push(job);
      (jobByCode[g.code] = jobByCode[g.code] || []).push(job);
      mi++;
    });
  });

  return { light, p, rows, restAreas, mapPins, arcPaths, mapGroups, mapJobs, jobByCode, countryInfo, pinPx };
}

type BoardData = ReturnType<typeof buildData>;

function buildBoardHTML(d: BoardData): string {
  const { p, rows, restAreas, mapPins, arcPaths, mapGroups } = d;
  // Placeholder estable: el reloj real lo escribe el efecto en cuanto monta, así
  // el HTML del servidor y el del cliente coinciden (sin desajuste de hidratación).
  const clock = "--:--:--";

  const chips = restAreas
    .map(
      (area) =>
        `<span data-chip style="font:500 12.762px/12.762px ${SG};padding:9.8px 15.7px;border-radius:999px;cursor:pointer;transition:all .16s;border:1px solid ${p.chipBd};color:${p.chipText}">${area}</span>`,
    )
    .join("");

  const rowsHtml = rows
    .map(
      (row, i) => `
        <a href="${row.href}" data-row="${i}" style="display:grid;grid-template-columns:188px minmax(168px,1.3fr) 186px 172px 120px;column-gap:14px;align-items:center;text-decoration:none;padding:14px 8px;border-radius:10px;border:1px solid transparent;transition:background .14s ease,border-color .14s ease;color:${p.rowText}">
          <span data-flap data-col="area" data-ci="0" style="display:flex;overflow:hidden;white-space:nowrap">${row.area}</span>
          <span data-flap data-col="cargo" data-ci="1" style="display:flex;overflow:hidden;white-space:nowrap">${row.cargo}</span>
          <span data-flap data-col="ubic" data-ci="2" style="display:flex;overflow:hidden;white-space:nowrap">${row.ubicacion}</span>
          <span data-flap data-col="estado" data-ci="3" data-estado="${row.estado}" style="display:flex;overflow:hidden;white-space:nowrap">${row.estado}</span>
          <span style="display:flex;justify-content:flex-end">
            <span data-action style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;transition:all .18s ease;border:1px solid ${p.actionBd};color:${p.actionColor}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </span>
        </a>`,
    )
    .join("");

  const arcsHtml = arcPaths
    .map(
      (dd) =>
        `<path d="${dd}" fill="none" stroke="${p.accent}" stroke-width="1" stroke-dasharray="2 3" opacity="0.45" vector-effect="non-scaling-stroke"></path>`,
    )
    .join("");

  const pinsHtml = mapPins
    .map(
      (pin) => `
      <div data-pin="${pin.code}" style="position:absolute;left:${pin.left};top:${pin.top};transform:translate(-50%,-50%);display:flex;align-items:center;gap:7px;z-index:3;cursor:pointer;transition:transform .2s ease">
        ${pin.big ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:${p.heading};color:#fff;font:700 12px/1 ${SM};box-shadow:0 4px 12px -2px rgba(27,0,136,.5)">${pin.count}</span>` : ""}
        ${pin.small ? `<span style="width:14px;height:14px;border-radius:50%;background:${p.accent};border:2px solid #fff;box-shadow:0 0 0 4px ${p.pinGlow},0 3px 8px -1px rgba(230,17,76,.5)"></span>` : ""}
        <span style="font:700 10px/1 ${SM};letter-spacing:.14em;padding:4px 7px;border-radius:6px;background:${p.pinLabelBg};color:${p.body};border:1px solid ${p.divider};white-space:nowrap;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)">${pin.code}</span>
      </div>`,
    )
    .join("");

  const groupsHtml = mapGroups
    .map(
      (g) => `
      <div data-group="${g.code}" style="margin-bottom:22px;border-radius:14px;transition:box-shadow .25s ease,background .25s ease">
        <div style="display:flex;align-items:baseline;gap:11px;margin:2px 4px 12px">
          <span style="font:700 17px/1 ${SG};letter-spacing:.01em;color:${p.heading}">${g.country}</span>
          <span style="font:700 12px/1 ${SM};letter-spacing:.18em;text-transform:uppercase;color:${p.groupMeta}">${g.meta}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${g.items
            .map(
              (job) => `
            <a href="#postular" data-mapjob="${job.mapIdx}" style="display:flex;align-items:center;gap:14px;text-decoration:none;padding:18px 20px;border-radius:16px;background:${p.cardBg};border:1px solid ${p.cardBd};box-shadow:${p.cardShadow};transition:background .16s ease,box-shadow .16s ease,transform .16s ease">
              <span style="flex:1;min-width:0">
                <span style="display:block;font:600 16.5px/1.28 ${SG};color:${p.heading}">${job.title}</span>
                <span style="display:block;margin-top:4px;font:400 13.5px/1.35 ${SG};color:${p.body}">${job.sub}</span>
              </span>
              <span style="flex:0 0 auto;font:700 11px/1 ${SM};letter-spacing:.1em;padding:7px 11px;border-radius:8px;background:${p.countBadgeBg};color:${p.heading}">${job.code}</span>
              <span style="flex:0 0 auto;display:inline-flex;color:${p.accent}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></span>
            </a>`,
            )
            .join("")}
        </div>
      </div>`,
    )
    .join("");

  return `
  <div data-vac-board style="width:100%;font-family:${SG}">
    <div data-board style="position:relative;width:100%;border-radius:22px;overflow:hidden;padding:40px 44px;background:${p.boardBg};box-shadow:${p.boardShadow}">
      <div data-view-toggle style="position:absolute;top:40px;right:44px;z-index:6;display:inline-flex;align-items:center;gap:4px;padding:5px;border-radius:999px;-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%);background:${p.panelBg};border:1px solid ${p.panelBd};box-shadow:${p.panelShadow}">
        <button data-view-btn="lista" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border:0;border-radius:999px;cursor:pointer;font:700 13.252px/13.252px ${SG};transition:background .18s ease,color .18s ease">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span data-view-label="lista">Lista</span>
        </button>
        <button data-view-btn="mapa" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border:0;border-radius:999px;cursor:pointer;font:700 13.252px/13.252px ${SG};background:transparent;transition:background .18s ease,color .18s ease">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span data-view-label="mapa" style="display:none">Mapa</span>
        </button>
      </div>
      <div style="font:900 14px/10.798px ${LS};letter-spacing:3.4554px;text-transform:uppercase;color:${p.accent}">Vacantes disponibles</div>
      <h2 style="margin:14px 0 10px;font:700 42px/40.052px ${LS};letter-spacing:-.3927px;color:${p.heading}">Encuentra tu próxima oportunidad en LATAM</h2>
      <p style="margin:0 0 24px;font:400 15.216px/22.823px ${LS};max-width:560px;color:${p.body}">Explora las vacantes abiertas, filtra por área y descubre dónde puede crecer tu talento.</p>

      <div style="display:flex;flex-wrap:wrap;gap:9px;margin-bottom:16px">
        <span style="font:700 12.762px/12.762px ${SG};padding:9.8px 15.7px;border-radius:999px;background:${p.chipActiveBg};color:${p.chipActiveText}">Todas</span>
        ${chips}
      </div>

      <div data-view-panel="lista" style="position:relative;border-radius:16px;-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%);border:1px solid ${p.panelBd};background:${p.panelBg};box-shadow:${p.panelShadow}">
        <div style="display:flex;align-items:center;gap:10px;padding:15px 20px;border-bottom:1px solid ${p.divider}">
          <span style="font-size:16px;color:${p.accent}">✈</span>
          <span style="font:900 11.78px/11.78px ${LS};letter-spacing:2.1204px;color:${p.heading}">SALIDAS · EMBARQUE ABIERTO</span>
          <span style="width:6px;height:6px;border-radius:50%;background:#37d18a;animation:vacBlink 1.6s infinite;margin-left:2px"></span>
          <span style="font:400 10.307px/10.307px ${SM};letter-spacing:1.443px;color:${p.label}">EN VIVO</span>
          <span data-clock style="margin-left:auto;font:900 13px/12.762px ${LS};letter-spacing:1.5314px;color:${p.clock}">${clock}</span>
        </div>
        <div data-cols style="display:grid;grid-template-columns:188px minmax(168px,1.3fr) 186px 172px 120px;column-gap:14px;padding:14px 20px;font:900 11.78px/11.78px ${LS};letter-spacing:2.1204px;text-transform:uppercase;background:${p.headBg};border-bottom:1px solid ${p.divider};color:${p.headText}">
          <span style="display:flex;align-items:center;gap:7px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="opacity:.7"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>Área</span>
          <span style="display:flex;align-items:center;gap:7px;color:${p.accent}"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="opacity:.9"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg>Cargo</span>
          <span style="display:flex;align-items:center;gap:7px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="opacity:.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>Ubicación</span>
          <span style="display:flex;align-items:center;gap:7px">Estado</span>
          <span></span>
        </div>
        <div data-rows style="padding:6px 12px 12px">
          ${rowsHtml}
        </div>
        <div data-foot style="display:flex;align-items:center;gap:14px;padding:14px 20px;border-top:1px solid ${p.divider}">
          <span style="font:900 12px/11.78px ${LS};letter-spacing:1.4136px;color:${p.heading}">6 VACANTES CON POSTULACIÓN ABIERTA</span>
          <div style="margin-left:auto;display:flex;align-items:center;gap:9px;padding:9px 16px;border-radius:999px;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);min-width:300px;border:1px solid ${p.searchBd};background:${p.searchBg}">
            <span style="font-size:13px;color:${p.label}">⌕</span>
            <input placeholder="Buscar por cargo o palabra clave" style="flex:1;border:0;background:transparent;outline:none;font:400 13px/1 ${LS};color:${p.inputText}">
          </div>
        </div>
      </div>

      <div data-view-panel="mapa" style="display:none;flex-direction:column;border-radius:16px;overflow:hidden;-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%);border:1px solid ${p.panelBd};background:${p.panelBg};box-shadow:${p.panelShadow}">
        <div data-map-row style="display:flex;align-items:stretch">
          <div style="position:relative;flex:1;min-width:0">
            <div data-map-inner style="position:relative;width:133%;aspect-ratio:1200/650;background:${p.mapField};-webkit-mask-image:linear-gradient(90deg,#000 76%,transparent 95%);mask-image:linear-gradient(90deg,#000 76%,transparent 95%)">
              <img src="/images/world-map.png" alt="Mapa del mundo con destinos LATAM" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;z-index:0">
              <svg viewBox="0 0 1200 650" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1">
                ${arcsHtml}
                <path data-active-arc d="" fill="none" stroke="${p.accent}" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round" opacity="0" vector-effect="non-scaling-stroke"></path>
              </svg>

              <span data-plane style="position:absolute;left:0;top:0;z-index:2;opacity:0;pointer-events:none;transform:translate(-50%,-50%);transition:opacity .3s ease;filter:drop-shadow(0 2px 4px rgba(27,0,136,.28))"><svg width="24" height="24" viewBox="0 0 24 24" fill="${p.accent}"><path d="M12 2c-.62 0-1.05.52-1.05 1.2V9L3 14v1.9l7.95-2.3V19l-2 1.45V22l3.05-.9 3.05.9v-1.55L13.05 19v-5.4L21 15.9V14l-7.95-5V3.2C13.05 2.52 12.62 2 12 2z"></path></svg></span>

              ${pinsHtml}

              <div data-map-info style="position:absolute;top:22px;left:22px;display:flex;align-items:center;gap:12px;z-index:4">
                <span style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:13px;background:${p.panelBg};border:1px solid ${p.panelBd};color:${p.accent};-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.9 4.9-2.9 2.9-2.3-.6a.5.5 0 0 0-.5.8L4 20l1.6 1.4a.5.5 0 0 0 .8-.5l-.6-2.3 2.9-2.9 4.9 3.9a.5.5 0 0 0 .8-.5z"></path></svg>
                </span>
                <div>
                  <div style="font:600 16px/1.1 ${SG};color:${p.heading}">10 vuelos disponibles</div>
                  <div style="margin-top:3px;font:400 12.5px/1.3 ${SG};color:${p.body}">Explora destinos con vacantes abiertas.</div>
                </div>
              </div>

              <div data-map-zoom style="position:absolute;left:22px;bottom:22px;display:flex;flex-direction:column;gap:8px;z-index:4">
                <div style="display:flex;flex-direction:column;border-radius:12px;overflow:hidden;border:1px solid ${p.panelBd};background:${p.panelBg};-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)">
                  <button data-mapbtn aria-label="Acercar" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:0;border-bottom:1px solid ${p.divider};background:transparent;color:${p.zoomText};cursor:pointer;transition:background .16s ease"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                  <button data-mapbtn aria-label="Alejar" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:0;background:transparent;color:${p.zoomText};cursor:pointer;transition:background .16s ease"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                </div>
                <button data-mapbtn aria-label="Centrar" style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;border:1px solid ${p.panelBd};background:${p.panelBg};color:${p.zoomText};cursor:pointer;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:background .16s ease"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
              </div>
            </div>
          </div>

          <div data-map-side style="width:404px;flex:0 0 auto;align-self:stretch;position:relative;overflow:hidden;background:${p.panelBgSoft};-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%)">
            <div data-mapscroll style="position:absolute;inset:0;overflow-y:auto;padding:22px 20px">
              <div style="display:flex;align-items:center;justify-content:space-between;margin:0 4px 18px">
                <span style="font:700 12px/1 ${SM};letter-spacing:.24em;color:${p.label}">TODAS LAS VACANTES</span>
                <span style="font:700 12.5px/1 ${SM};letter-spacing:.04em;color:${p.heading};background:${p.countBadgeBg};padding:6px 11px;border-radius:9px">15</span>
              </div>
              ${groupsHtml}
            </div>
            <div data-mapdetail style="position:absolute;inset:0;overflow-y:auto;padding:22px 20px;display:none"></div>
          </div>
        </div>

        <div data-map-legend style="display:flex;align-items:center;gap:22px;padding:14px 20px;border-top:1px solid ${p.divider}">
          <span style="display:flex;align-items:center;gap:8px;font:400 12px/1 ${SG};color:${p.body}"><span style="width:11px;height:11px;border-radius:50%;background:${p.accent};border:2px solid #fff;box-shadow:0 0 0 3px ${p.pinGlow}"></span>Destino con vacantes</span>
          <span style="display:flex;align-items:center;gap:8px;font:400 12px/1 ${SG};color:${p.body}"><span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:${p.heading};color:#fff;font:700 9px/1 ${SM}">4</span>Número de posiciones</span>
          <span style="margin-left:auto;font:700 12px/1 ${SM};letter-spacing:.12em;color:${p.heading}">15 VACANTES · 8 DESTINOS</span>
        </div>
      </div>

      <div data-scrim style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(6,7,12,.52);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);opacity:0;pointer-events:none;transition:opacity .35s ease;z-index:20"></div>

      <aside data-drawer style="position:absolute;top:0;right:0;bottom:0;width:468px;max-width:86%;transform:translateX(112%);transition:transform .44s cubic-bezier(.22,1,.36,1);z-index:30;display:flex;flex-direction:column;overflow:hidden;border-top-right-radius:22px;border-bottom-right-radius:22px;background:${p.dBg};border-left:1px solid ${p.dBd};box-shadow:${p.dShadow};font-family:${SG}">
        <button data-close aria-label="Cerrar" style="position:absolute;top:22px;right:22px;z-index:2;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;border:1px solid ${p.dCloseBd};background:${p.dCloseBg};color:${p.dCloseColor};cursor:pointer;transition:all .16s ease">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div data-scroll style="flex:1;overflow-y:auto;padding:32px 30px 26px">
          <div style="display:flex;gap:16px;align-items:flex-start;padding-right:44px">
            <div style="flex:0 0 auto;width:58px;height:58px;border-radius:16px;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#8a5cff 0%,#ff6982 100%);box-shadow:0 10px 24px -10px rgba(255,105,130,.6)">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5a2.12 2.12 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.9 4.9-2.9 2.9-2.3-.6a.5.5 0 0 0-.5.8L4 20l1.6 1.4a.5.5 0 0 0 .8-.5l-.6-2.3 2.9-2.9 4.9 3.9a.5.5 0 0 0 .8-.5z"></path></svg>
            </div>
            <div style="min-width:0">
              <h3 data-d-title style="margin:2px 0 8px;font:600 25px/1.1 ${SG};letter-spacing:-.01em;color:${p.dHeading}">Cargo</h3>
              <div style="display:flex;align-items:center;gap:8px;font:400 14.5px/1 ${SG};color:${p.dSub}"><span data-d-flag style="font-size:16px">🌎</span><span data-d-loc>Ubicación</span></div>
            </div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 10px">
            <span data-d-mod style="font:500 12.5px/1 ${SG};padding:8px 14px;border-radius:999px;background:${p.dChipBg};border:1px solid ${p.dChipBd};color:${p.dChipText}">Modalidad</span>
            <span data-d-tipo style="font:500 12.5px/1 ${SG};padding:8px 14px;border-radius:999px;background:${p.dChipBg};border:1px solid ${p.dChipBd};color:${p.dChipText}">Contrato</span>
            <span data-d-estado style="font:600 12.5px/1 ${SG};padding:8px 14px;border-radius:999px;background:rgba(91,226,160,.14);border:1px solid rgba(91,226,160,.4);color:#5be2a0">Estado</span>
          </div>
          <div style="display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;background:${p.dTagBg};border:1px solid ${p.dTagBd};color:${p.dTagText};font:400 11.5px/1 ${SG}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 14"></polyline></svg>
            <span data-d-pub>Publicado</span>
          </div>

          <div style="display:flex;align-items:center;gap:8px;margin:26px 0 10px"><span style="color:${p.accent};font-size:15px">✈</span><span style="font:600 14px/1 ${SG};color:${p.dHeading}">Sobre este vuelo</span></div>
          <p data-d-desc style="margin:0;font:400 14.5px/1.6 ${SG};color:${p.dSub}">Descripción del rol.</p>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:20px 0 4px">
            <div style="border-radius:12px;padding:13px 15px;background:${p.dCardBg};border:1px solid ${p.dCardBd}"><div style="font:700 10.5px/1 ${SM};letter-spacing:.14em;color:${p.dLabel};text-transform:uppercase">Área</div><div data-g-area style="margin-top:7px;font:500 15px/1.2 ${SG};color:${p.dGridVal}">—</div></div>
            <div style="border-radius:12px;padding:13px 15px;background:${p.dCardBg};border:1px solid ${p.dCardBd}"><div style="font:700 10.5px/1 ${SM};letter-spacing:.14em;color:${p.dLabel};text-transform:uppercase">Ubicación</div><div data-g-ubic style="margin-top:7px;font:500 15px/1.2 ${SG};color:${p.dGridVal}">—</div></div>
            <div style="border-radius:12px;padding:13px 15px;background:${p.dCardBg};border:1px solid ${p.dCardBd}"><div style="font:700 10.5px/1 ${SM};letter-spacing:.14em;color:${p.dLabel};text-transform:uppercase">Modalidad</div><div data-g-mod style="margin-top:7px;font:500 15px/1.2 ${SG};color:${p.dGridVal}">—</div></div>
            <div style="border-radius:12px;padding:13px 15px;background:${p.dCardBg};border:1px solid ${p.dCardBd}"><div style="font:700 10.5px/1 ${SM};letter-spacing:.14em;color:${p.dLabel};text-transform:uppercase">Tipo de contrato</div><div data-g-tipo style="margin-top:7px;font:500 15px/1.2 ${SG};color:${p.dGridVal}">—</div></div>
          </div>

          <div style="display:flex;align-items:center;gap:8px;margin:24px 0 12px"><span style="color:${p.accent};font-size:15px">◆</span><span style="font:600 14px/1 ${SG};color:${p.dHeading}">Responsabilidades</span></div>
          <ul data-d-resp style="list-style:none;margin:0;padding:0"></ul>

          <div style="display:flex;align-items:center;gap:8px;margin:22px 0 12px"><span style="color:${p.accent};font-size:15px">✓</span><span style="font:600 14px/1 ${SG};color:${p.dHeading}">Requisitos</span></div>
          <ul data-d-req style="list-style:none;margin:0;padding:0"></ul>
        </div>

        <div style="flex:0 0 auto;display:flex;flex-direction:column;gap:10px;padding:18px 22px 24px;border-top:1px solid ${p.dFooterBd};background:${p.dFooterBg};-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)">
          <a data-cta href="#postular" style="display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:15px;border-radius:12px;text-decoration:none;background:#E8114B;color:#fff;font:600 15px/1 ${SG};box-shadow:0 12px 28px -12px rgba(232,17,75,.7);transition:filter .16s ease">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Postularme ahora
          </a>
          <button data-save style="display:inline-flex;align-items:center;justify-content:center;gap:9px;padding:14px;border-radius:12px;border:1px solid ${p.dSaveBd};background:transparent;color:${p.dSaveText};font:600 14px/1 ${SG};cursor:pointer;transition:all .16s ease">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            Guardar vacante
          </button>
        </div>
      </aside>
    </div>
  </div>`;
}

function scopedCss(scope: string, p: Palette): string {
  return `
    .${scope} *{box-sizing:border-box}
    .${scope} a{color:inherit}
    @keyframes vacBlink{0%,100%{opacity:1}50%{opacity:.25}}
    .${scope} ::placeholder{opacity:1}
    .${scope} [data-mapscroll],.${scope} [data-mapdetail]{scrollbar-width:thin;scrollbar-color:#c9c2ec transparent}
    .${scope} [data-mapscroll]::-webkit-scrollbar,.${scope} [data-mapdetail]::-webkit-scrollbar{width:14px}
    .${scope} [data-mapscroll]::-webkit-scrollbar-track,.${scope} [data-mapdetail]::-webkit-scrollbar-track{background:transparent}
    .${scope} [data-mapscroll]::-webkit-scrollbar-thumb,.${scope} [data-mapdetail]::-webkit-scrollbar-thumb{background:#c9c2ec;border-radius:999px;border:4px solid transparent;background-clip:content-box}
    .${scope} [data-mapscroll]::-webkit-scrollbar-thumb:hover,.${scope} [data-mapdetail]::-webkit-scrollbar-thumb:hover{background:#b3a9e2;background-clip:content-box}
    .${scope} [data-chip]:hover{border-color:${p.hoverBd}!important;color:${p.heading}!important}
    .${scope} a[data-row]:hover{background:${p.rowHoverBg}!important;border-color:${p.rowHoverBd}!important}
    .${scope} [data-action]:hover{background:${p.accent}!important;border-color:${p.accent}!important;color:${p.actionHoverText}!important}
    .${scope} [data-action]:active{background:#E8114B!important;border-color:#fff!important;color:#fff!important}
    .${scope} a[data-mapjob]:hover{background:${p.cardHoverBg}!important;transform:translateY(-1px)}
    .${scope} [data-mapbtn]:hover{background:${p.rowHoverBg}!important}
    .${scope} [data-close]:hover{background:${p.dCloseHoverBg}!important;border-color:${p.dCloseHoverBd}!important}
    .${scope} [data-cta]:hover{filter:brightness(1.08)}
    .${scope} [data-save]:hover{background:${p.dSaveHoverBg}!important;border-color:${p.dSaveHoverBd}!important}

    /* ── Responsive ─────────────────────────────────────────────────────── */
    @media (max-width: 1023px){
      .${scope} [data-board]{padding:28px 18px!important}
      .${scope} [data-view-toggle]{position:static!important;margin:0 0 18px}
      .${scope} [data-vac-board] h2{font-size:clamp(26px,5.5vw,42px)!important;line-height:1.06!important}
      .${scope} [data-map-row]{flex-direction:column}
      .${scope} [data-map-side]{width:100%!important;height:420px}
      .${scope} [data-map-inner]{width:100%!important;-webkit-mask-image:none!important;mask-image:none!important}
      .${scope} [data-map-legend]{flex-wrap:wrap;row-gap:8px}
      .${scope} [data-map-legend] > span:last-child{margin-left:0!important;flex-basis:100%}
      .${scope} [data-drawer]{width:100%!important;max-width:100%!important}
    }
    @media (max-width: 1099px){
      .${scope} [data-view-panel="lista"]{overflow-x:auto}
      .${scope} [data-cols],.${scope} [data-rows]{min-width:760px}
      .${scope} [data-cols],.${scope} a[data-row]{grid-template-columns:150px minmax(150px,1.3fr) 150px 140px 90px!important}
      .${scope} [data-foot]{flex-wrap:wrap;row-gap:10px}
      .${scope} [data-foot] > div{margin-left:0!important;min-width:0!important;flex:1 1 100%}
    }
    @media (max-width: 639px){
      .${scope} [data-map-zoom]{display:none!important}
      .${scope} [data-map-info]{top:12px!important;left:12px!important;gap:8px}
      .${scope} [data-map-side]{height:380px}
    }
  `;
}

/* ── Datos de detalle del drawer (idénticos al diseño) ───────────────────── */
type Detail = { mod: string; tipo: string; pub: string; desc: string; resp: string[]; req: string[] };

const DETAILS: Record<string, Detail> = {
  "Tripulante de Cabina": { mod: "Presencial", tipo: "Tiempo integral", pub: "hace 3 días",
    desc: "Serás la cara visible de LATAM a bordo, velando por la seguridad y la mejor experiencia de nuestros pasajeros en cada vuelo.",
    resp: ["Ejecutar los procedimientos de seguridad a bordo.", "Brindar una atención cálida y cercana a los pasajeros.", "Realizar el servicio de cabina según los estándares LATAM.", "Actuar con calma y criterio ante contingencias."],
    req: ["Enseñanza media completa.", "Inglés intermedio (oral y escrito).", "Aptitud médica según normativa aeronáutica.", "Disponibilidad para viajar y turnos rotativos."] },
  "Primer Oficial A320": { mod: "Presencial", tipo: "Tiempo integral", pub: "hace 8 días",
    desc: "Operarás nuestra flota A320 como Primer Oficial, apoyando al Comandante en una operación segura, puntual y eficiente.",
    resp: ["Asistir en la conducción segura de la aeronave.", "Ejecutar la planificación y revisión previa al vuelo.", "Aplicar los procedimientos operacionales estándar.", "Colaborar con la tripulación para una experiencia excepcional."],
    req: ["Licencia CPL/ATPL vigente con habilitación A320.", "Mínimo 1.500 horas de vuelo.", "Inglés nivel ICAO 4 o superior.", "Certificado médico Clase 1 vigente."] },
  "Técnico de Línea": { mod: "Presencial", tipo: "Tiempo integral", pub: "hace 5 días",
    desc: "Garantizarás la aeronavegabilidad de la flota ejecutando tareas de mantenimiento en línea con los más altos estándares.",
    resp: ["Realizar inspecciones y mantenimiento en plataforma.", "Diagnosticar y resolver fallas técnicas.", "Registrar tareas según la documentación técnica.", "Asegurar el cumplimiento de las normas de seguridad."],
    req: ["Licencia de Mecánico de Mantenimiento Aeronáutico.", "Experiencia en flota Airbus o Boeing.", "Lectura técnica en inglés.", "Disponibilidad para turnos rotativos."] },
  "Data Engineer": { mod: "Híbrida", tipo: "Tiempo integral", pub: "hace 2 días",
    desc: "Diseñarás y mantendrás las canalizaciones de datos que impulsan las decisiones de negocio de LATAM.",
    resp: ["Construir y mantener pipelines de datos escalables.", "Modelar y optimizar el almacenamiento analítico.", "Asegurar la calidad y gobernanza de los datos.", "Colaborar con los equipos de producto y analítica."],
    req: ["Experiencia sólida con SQL y Python.", "Manejo de cloud (AWS/GCP) y orquestadores.", "Conocimiento de modelado de datos.", "Inglés intermedio."] },
  "Agente de Rampa": { mod: "Presencial", tipo: "Tiempo integral", pub: "hace 6 días",
    desc: "Serás clave en la operación en tierra, asegurando que cada vuelo salga a tiempo y en condiciones seguras.",
    resp: ["Cargar y descargar equipaje y carga.", "Operar equipos de apoyo en plataforma.", "Coordinar el turnaround de la aeronave.", "Cumplir los protocolos de seguridad operacional."],
    req: ["Enseñanza media completa.", "Licencia de conducir vigente.", "Aptitud física para trabajo en plataforma.", "Disponibilidad para turnos y clima variable."] },
  "Product Designer": { mod: "Remota", tipo: "Tiempo integral", pub: "hace 4 días",
    desc: "Diseñarás experiencias digitales que millones de pasajeros usan para volar con LATAM, desde la idea hasta el detalle.",
    resp: ["Diseñar flujos e interfaces centradas en el usuario.", "Prototipar y validar con investigación.", "Mantener y evolucionar el design system.", "Colaborar con producto e ingeniería."],
    req: ["Portafolio sólido de producto digital.", "Dominio de Figma y prototipado.", "Experiencia en design systems.", "Inglés intermedio-avanzado."] },
  "Jefe de Turno": { mod: "Presencial", tipo: "Tiempo integral", pub: "hace 9 días",
    desc: "Liderarás la operación aeroportuaria durante tu turno, coordinando equipos para una experiencia impecable.",
    resp: ["Coordinar la operación de vuelos del turno.", "Liderar y apoyar a los equipos en tierra.", "Gestionar contingencias y desvíos.", "Asegurar los indicadores de puntualidad y servicio."],
    req: ["Experiencia en operaciones aeroportuarias.", "Habilidades de liderazgo de equipos.", "Inglés intermedio.", "Disponibilidad para turnos rotativos."] },
  "Instructor de Cabina": { mod: "Híbrida", tipo: "Tiempo integral", pub: "hace 7 días",
    desc: "Formarás a las nuevas generaciones de tripulantes, transmitiendo los estándares de seguridad y servicio de LATAM.",
    resp: ["Dictar la formación inicial y recurrente.", "Evaluar competencias de seguridad y servicio.", "Actualizar material y programas de entrenamiento.", "Acompañar el desempeño en vuelo."],
    req: ["Experiencia como Tripulante de Cabina.", "Certificación de instructor (deseable).", "Habilidades de comunicación y didáctica.", "Inglés intermedio."] },
};

const FLAGS: Record<string, string> = { "Santiago, CL": "🇨🇱", "Lima, PE": "🇵🇪", "São Paulo, BR": "🇧🇷", "Bogotá, CO": "🇨🇴", "Guayaquil, EC": "🇪🇨", "Quito, EC": "🇪🇨", "Miami, US": "🇺🇸", "Madrid, ES": "🇪🇸", "Frankfurt, DE": "🇩🇪", Remoto: "🌎" };
const AREA_LABELS: Record<string, string> = { TRIPULACIÓN: "Tripulación de cabina", PILOTOS: "Pilotos", MANTENIMIENTO: "Mantenimiento", TECNOLOGÍA: "Tecnología y datos", OPERACIONES: "Aeropuertos y operaciones", AEROPUERTOS: "Aeropuertos y operaciones" };

type VacancyBoardProps = { theme?: "Claro" | "Oscuro" };

export function VacancyBoard({ theme = "Claro" }: VacancyBoardProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const scope = "vac-scope";
  const data = useMemo(() => buildData(theme), [theme]);
  const html = useMemo(() => buildBoardHTML(data), [data]);
  const css = useMemo(() => scopedCss(scope, data.p), [data.p]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { p, light, rows, mapJobs, jobByCode, countryInfo, pinPx } = data;

    // ── helpers ──────────────────────────────────────────────────────────
    const rgba = (hex: string, a: number) => {
      const h = hex.replace("#", "");
      const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
      return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
    };
    const areaLabel = (area: string) => AREA_LABELS[area] || area;
    const flag = (ubic: string) => FLAGS[ubic] || "🌎";
    const key = (label: string) => {
      const e = (label || "").toUpperCase();
      if (e.indexOf("ABIERT") > -1) return "abierto";
      if (e.indexOf("CERR") > -1) return "cerrado";
      if (e.indexOf("LTIM") > -1) return "ultimos";
      return "nuevo";
    };
    const statusColor = (col: string, estado: string): string | null => {
      if (col !== "estado") return null;
      const k = key(estado);
      if (k === "abierto") return light ? "#17a06b" : "#5be2a0";
      if (k === "ultimos") return light ? "#c67a00" : "#ffb454";
      if (k === "cerrado") return light ? "#9096a2" : "#8F94A3";
      return light ? "#1B0088" : "#F4F4F6";
    };

    const detail = (row: Row | MapJob) => {
      let dd = DETAILS[(row as Row).cargo];
      if (!dd) {
        const ar = areaLabel(row.area);
        dd = {
          mod: (row as Row).modalidad || "Presencial",
          tipo: "Tiempo integral",
          pub: "hace " + (((row.cargo || "").length % 8) + 2) + " días",
          desc: "Súmate al equipo de " + ar + " de LATAM en " + (row.ubicacion || "la región") + " y sé protagonista de una operación de clase mundial, con foco en la seguridad y en la mejor experiencia para nuestros pasajeros.",
          resp: ["Ejecutar con excelencia las funciones propias del cargo.", "Colaborar con equipos multidisciplinarios de LATAM.", "Velar por el cumplimiento de los estándares de seguridad y servicio.", "Aportar a la mejora continua de los procesos del área."],
          req: ["Formación acorde a las exigencias del rol.", "Experiencia relevante en " + ar + ".", "Orientación al cliente y trabajo en equipo.", "Inglés intermedio (deseable)."],
        };
      }
      return Object.assign({ flag: flag(row.ubicacion), areaLabel: areaLabel(row.area), modalidad: (row as Row).modalidad }, dd);
    };

    // ── split-flap ───────────────────────────────────────────────────────
    const tileSkin = () => {
      const lvl = "Sutil";
      if (light) {
        if (lvl === "Sutil") return { background: "#eceef3", boxShadow: "inset 0 0 0 1px rgba(0,0,0,.05)" };
      }
      return { background: "rgba(255,255,255,.028)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04)" };
    };
    const styleTile = (t: HTMLElement, color: string | null, skin: { background: string; boxShadow: string }) => {
      const s = t.style;
      s.display = "inline-flex"; s.alignItems = "center"; s.justifyContent = "center";
      s.fontFamily = SM; s.flex = "0 0 auto";
      s.width = "13px"; s.height = "22px"; s.marginRight = "1.5px"; s.fontSize = "13.5px";
      s.borderRadius = "2px"; s.color = color || p.tileText;
      s.background = skin.background; s.boxShadow = skin.boxShadow;
    };
    const settleTile = (t: HTMLElement, col: string) => {
      const s = t.style;
      s.display = "inline-flex"; s.alignItems = "center"; s.justifyContent = "center";
      s.fontFamily = SM; s.flex = "0 0 auto";
      const skin = tileSkin();
      s.borderRadius = "3px"; s.boxShadow = skin.boxShadow; s.background = skin.background; s.marginRight = "1px";
      if (col === "area") { s.width = "13px"; s.height = "20px"; s.fontSize = "12.271px"; s.color = p.tileTextArea; }
      else { s.width = "13px"; s.height = "22px"; s.fontSize = "13.743px"; s.color = p.tileText; }
    };

    let raf = 0;
    let settleT: ReturnType<typeof setTimeout> | undefined;

    const settle = () => {
      root.querySelectorAll<HTMLElement>("[data-flap]").forEach((cell) => {
        const text = cell.getAttribute("data-text") || "";
        const col = cell.getAttribute("data-col") || "";
        const s = cell.style;
        s.letterSpacing = "normal";
        if (col === "estado") {
          const color = statusColor("estado", text);
          cell.textContent = "";
          Array.from(text).forEach((ch) => {
            const t = document.createElement("span");
            settleTile(t, "area");
            if (color) t.style.color = color;
            if (ch === " ") { t.style.background = "transparent"; t.style.width = "5px"; t.innerHTML = "&nbsp;"; cell.appendChild(t); return; }
            t.textContent = ch; cell.appendChild(t);
          });
          if (key(text) === "cerrado") {
            const rowA = cell.closest<HTMLElement>("a[data-row]");
            if (rowA) { rowA.style.opacity = ".5"; rowA.style.pointerEvents = "none"; }
          }
          return;
        }
        if (col === "cargo") {
          cell.textContent = text;
          s.fontFamily = LS; s.fontWeight = "700"; s.fontSize = "16.485px"; s.lineHeight = "18.062px"; s.color = p.cargoText;
          return;
        }
        cell.textContent = "";
        Array.from(text).forEach((ch) => {
          const t = document.createElement("span");
          settleTile(t, col);
          if (ch === " ") { t.style.background = "transparent"; t.style.width = "5px"; t.innerHTML = "&nbsp;"; cell.appendChild(t); return; }
          t.textContent = ch; cell.appendChild(t);
        });
      });
    };

    const runFlap = () => {
      if (raf) cancelAnimationFrame(raf);
      if (settleT) clearTimeout(settleT);
      const skin = tileSkin();
      const SCR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/:.-ÍÁÉÓÚÑ";
      const cells = Array.prototype.slice.call(root.querySelectorAll("[data-flap]")) as HTMLElement[];
      const tiles: { el: HTMLElement; target: string; delay: number; flip: number }[] = [];
      let maxEnd = 0;
      cells.forEach((cell) => {
        const rowA = cell.closest<HTMLElement>("a[data-row]");
        if (rowA) { rowA.style.opacity = ""; rowA.style.pointerEvents = ""; }
        let text = cell.getAttribute("data-text");
        if (text == null) { text = cell.textContent || ""; cell.setAttribute("data-text", text); }
        const col = cell.getAttribute("data-col") || "";
        const estado = cell.getAttribute("data-estado") || "";
        const ri = parseInt(cell.closest<HTMLElement>("a[data-row]")?.getAttribute("data-row") || "0", 10);
        const ci = parseInt(cell.getAttribute("data-ci") || "0", 10);
        const color = statusColor(col, estado);
        cell.textContent = "";
        cell.style.letterSpacing = "";
        cell.style.fontFamily = SM;
        cell.style.color = "";
        Array.from(text).forEach((ch, i) => {
          const t = document.createElement("span");
          styleTile(t, color, skin);
          if (ch === " ") { t.innerHTML = "&nbsp;"; cell.appendChild(t); return; }
          cell.appendChild(t);
          const delay = ri * 68 + ci * 40 + i * 32;
          const flip = 250 + i * 15;
          maxEnd = Math.max(maxEnd, delay + flip);
          tiles.push({ el: t, target: ch, delay, flip });
        });
      });
      const start = performance.now();
      let lastScr = 0;
      const frame = (nowT: number) => {
        const t = nowT - start;
        const scr = nowT - lastScr > 45;
        if (scr) lastScr = nowT;
        let active = false;
        for (let k = 0; k < tiles.length; k++) {
          const o = tiles[k];
          const e = t - o.delay;
          if (e < 0) { active = true; continue; }
          if (e >= o.flip) { if (o.el.textContent !== o.target) o.el.textContent = o.target; continue; }
          active = true;
          if (scr) o.el.textContent = SCR[(Math.random() * SCR.length) | 0];
        }
        if (active) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      settleT = setTimeout(() => settle(), maxEnd + 160);
    };

    // ── drawer ───────────────────────────────────────────────────────────
    const highlightList = (attr: string, idx: number, color: string) => {
      root.querySelectorAll<HTMLElement>("a[data-row],a[data-mapjob]").forEach((a) => {
        const isMap = a.hasAttribute("data-mapjob");
        a.style.background = isMap ? p.cardBg : "";
        a.style.borderColor = isMap ? p.cardBd : "transparent";
      });
      if (attr === "data-mapjob") return;
      const el = root.querySelector<HTMLElement>("a[" + attr + '="' + idx + '"]');
      if (el) { el.style.background = rgba(color, 0.08); el.style.borderColor = rgba(color, 0.45); }
    };

    const populateDrawer = (row: Row | MapJob): string => {
      const dd = detail(row);
      const set = (sel: string, txt: string) => { const el = root.querySelector(sel); if (el) el.textContent = txt; };
      set("[data-d-title]", row.cargo);
      set("[data-d-loc]", row.ubicacion);
      set("[data-d-flag]", dd.flag);
      set("[data-d-mod]", dd.mod);
      set("[data-d-tipo]", dd.tipo);
      set("[data-d-pub]", "Publicado " + dd.pub);
      set("[data-d-desc]", dd.desc);
      set("[data-g-area]", dd.areaLabel);
      set("[data-g-ubic]", row.ubicacion);
      set("[data-g-mod]", dd.mod);
      set("[data-g-tipo]", dd.tipo);

      const color = statusColor("estado", row.estado) || "#5be2a0";
      const est = root.querySelector<HTMLElement>("[data-d-estado]");
      if (est) { est.textContent = row.estado; est.style.color = color; est.style.background = rgba(color, 0.14); est.style.borderColor = rgba(color, 0.42); }

      const fill = (sel: string, items: string[]) => {
        const ul = root.querySelector(sel);
        if (!ul) return;
        ul.innerHTML = "";
        items.forEach((txt) => {
          const li = document.createElement("li");
          li.style.cssText = "display:flex;gap:11px;align-items:flex-start;margin:0 0 10px";
          const dot = document.createElement("span");
          dot.style.cssText = "width:6px;height:6px;border-radius:50%;flex:0 0 auto;margin-top:7px;background:" + p.accent;
          const sp = document.createElement("span");
          sp.style.cssText = "font:400 14px/1.5 " + SG + ";color:" + p.dListText;
          sp.textContent = txt;
          li.appendChild(dot); li.appendChild(sp); ul.appendChild(li);
        });
      };
      fill("[data-d-resp]", dd.resp);
      fill("[data-d-req]", dd.req);

      const sc = root.querySelector<HTMLElement>("[data-scroll]");
      if (sc) sc.scrollTop = 0;
      const drawer = root.querySelector<HTMLElement>("[data-drawer]");
      const scrim = root.querySelector<HTMLElement>("[data-scrim]");
      if (drawer) drawer.style.transform = "translateX(0)";
      if (scrim) { scrim.style.opacity = "1"; scrim.style.pointerEvents = "auto"; }
      return color;
    };

    const openDrawer = (i: number) => {
      const row = rows[i];
      if (!row) return;
      const color = populateDrawer(row);
      highlightList("data-row", i, color);
    };
    const openMapJob = (idx: number) => {
      const row = mapJobs[idx];
      if (!row) return;
      const color = populateDrawer(row);
      highlightList("data-mapjob", idx, color);
    };
    const closeDrawer = () => {
      const drawer = root.querySelector<HTMLElement>("[data-drawer]");
      const scrim = root.querySelector<HTMLElement>("[data-scrim]");
      if (drawer) drawer.style.transform = "translateX(112%)";
      if (scrim) { scrim.style.opacity = "0"; scrim.style.pointerEvents = "none"; }
      root.querySelectorAll<HTMLElement>("a[data-row]").forEach((a) => { a.style.background = ""; a.style.borderColor = "transparent"; });
    };

    // ── map ──────────────────────────────────────────────────────────────
    const arcPath = (a: [number, number], b: [number, number]) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], dist = Math.hypot(dx, dy);
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - Math.max(14, dist * 0.22);
      return "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + b[0].toFixed(1) + " " + b[1].toFixed(1);
    };
    const selectPin = (code: string) => {
      root.querySelectorAll<HTMLElement>("[data-pin]").forEach((el) => {
        const on = el.getAttribute("data-pin") === code;
        el.style.transform = on ? "translate(-50%,-50%) scale(1.22)" : "translate(-50%,-50%)";
        el.style.zIndex = on ? "6" : "3";
        const label = el.children[1] as HTMLElement | undefined;
        if (label) { label.style.borderColor = on ? p.accent : p.divider; label.style.color = on ? p.accent : p.body; }
      });
      const arc = root.querySelector<SVGPathElement>("[data-active-arc]");
      const plane = root.querySelector<HTMLElement>("[data-plane]");
      if (arc && pinPx) {
        const hub = code === "SCL" ? "GRU" : "SCL";
        const a = pinPx[hub], b = pinPx[code];
        if (a && b) {
          arc.setAttribute("d", arcPath(a, b));
          arc.style.opacity = "0.9";
          if (plane) {
            const dx = b[0] - a[0], dy = b[1] - a[1], dist = Math.hypot(dx, dy);
            const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - Math.max(14, dist * 0.22);
            const mx = 0.25 * a[0] + 0.5 * cx + 0.25 * b[0];
            const my = 0.25 * a[1] + 0.5 * cy + 0.25 * b[1];
            const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90;
            plane.style.left = (mx / 1200) * 100 + "%";
            plane.style.top = (my / 650) * 100 + "%";
            plane.style.transform = "translate(-50%,-50%) rotate(" + ang.toFixed(1) + "deg)";
            plane.style.opacity = "1";
          }
        } else {
          arc.style.opacity = "0";
          if (plane) plane.style.opacity = "0";
        }
      }
    };
    const backToList = () => {
      const det = root.querySelector<HTMLElement>("[data-mapdetail]");
      const list = root.querySelector<HTMLElement>("[data-mapscroll]");
      if (det) det.style.display = "none";
      if (list) list.style.display = "block";
    };
    const openCountry = (code: string) => {
      const info = countryInfo && countryInfo[code];
      const jobs = (jobByCode && jobByCode[code]) || [];
      const det = root.querySelector<HTMLElement>("[data-mapdetail]");
      const list = root.querySelector<HTMLElement>("[data-mapscroll]");
      if (!det || !info) return;
      det.textContent = "";
      det.scrollTop = 0;

      const back = document.createElement("button");
      back.type = "button";
      back.style.cssText = "display:inline-flex;align-items:center;gap:8px;margin:0 4px 20px;padding:0;border:0;background:transparent;cursor:pointer;font:700 12px/1 " + SM + ";letter-spacing:.16em;text-transform:uppercase;color:" + p.label;
      back.textContent = "← Todos los destinos";
      back.addEventListener("mouseenter", () => (back.style.color = p.accent));
      back.addEventListener("mouseleave", () => (back.style.color = p.label));
      back.addEventListener("click", () => backToList());
      det.appendChild(back);

      const title = document.createElement("div");
      title.style.cssText = "margin:0 4px 6px;font:700 30px/1.05 " + SG + ";letter-spacing:-.01em;color:" + p.heading;
      title.textContent = info.name + (info.city ? " — " + info.city : "");
      det.appendChild(title);

      const sub = document.createElement("div");
      sub.style.cssText = "margin:0 4px 22px;font:700 12.5px/1 " + SM + ";letter-spacing:.2em;text-transform:uppercase;color:" + p.groupMeta;
      sub.textContent = info.code + " · " + jobs.length + " Vacantes activas";
      det.appendChild(sub);

      const listWrap = document.createElement("div");
      listWrap.style.cssText = "display:flex;flex-direction:column;gap:14px";
      jobs.forEach((job) => {
        const a = document.createElement("a");
        a.href = "#postular";
        a.style.cssText = "display:flex;align-items:center;gap:16px;text-decoration:none;padding:20px 22px;border-radius:16px;background:" + p.cardBg + ";border:1px solid " + p.cardBd + ";box-shadow:" + p.cardShadow + ";transition:background .16s ease,box-shadow .16s ease,transform .16s ease";
        a.addEventListener("mouseenter", () => { a.style.background = p.cardHoverBg; a.style.transform = "translateY(-1px)"; });
        a.addEventListener("mouseleave", () => { a.style.background = p.cardBg; a.style.transform = "none"; });
        a.addEventListener("click", (e) => { e.preventDefault(); openMapJob(job.mapIdx); });

        const txt = document.createElement("span");
        txt.style.cssText = "flex:1;min-width:0";
        const t = document.createElement("span");
        t.style.cssText = "display:block;font:600 17px/1.28 " + SG + ";color:" + p.heading;
        t.textContent = job.title;
        const s = document.createElement("span");
        s.style.cssText = "display:block;margin-top:5px;font:400 13.5px/1.35 " + SG + ";color:" + p.body;
        s.textContent = job.sub;
        txt.appendChild(t); txt.appendChild(s);

        const rid = document.createElement("span");
        rid.style.cssText = "flex:0 0 auto;font:700 11px/1 " + SM + ";letter-spacing:.1em;color:" + p.label;
        rid.textContent = job.reqId;

        const chev = document.createElement("span");
        chev.style.cssText = "flex:0 0 auto;display:inline-flex;color:" + p.accent;
        chev.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';

        a.appendChild(txt); a.appendChild(rid); a.appendChild(chev);
        listWrap.appendChild(a);
      });
      det.appendChild(listWrap);

      if (list) list.style.display = "none";
      det.style.display = "block";
    };
    const onPin = (code: string) => {
      selectPin(code);
      const jobs = jobByCode[code] || [];
      if (jobs.length === 1) { backToList(); openMapJob(jobs[0].mapIdx); return; }
      openCountry(code);
    };

    // ── view toggle ──────────────────────────────────────────────────────
    const toggleBtns = Array.prototype.slice.call(root.querySelectorAll("[data-view-btn]")) as HTMLElement[];
    const setView = (view: string) => {
      toggleBtns.forEach((b) => {
        const on = b.getAttribute("data-view-btn") === view;
        b.style.background = on ? p.chipActiveBg : "transparent";
        b.style.color = on ? p.chipActiveText : p.body;
        const lbl = b.querySelector<HTMLElement>("[data-view-label]");
        if (lbl) lbl.style.display = on ? "" : "none";
      });
      root.querySelectorAll<HTMLElement>("[data-view-panel]").forEach((panel) => {
        const on = panel.getAttribute("data-view-panel") === view;
        panel.style.display = on ? (panel.getAttribute("data-view-panel") === "mapa" ? "flex" : "") : "none";
      });
    };

    // ── wiring ───────────────────────────────────────────────────────────
    root.querySelectorAll<HTMLElement>("a[data-row]").forEach((a) => {
      a.addEventListener("click", (e) => { e.preventDefault(); openDrawer(parseInt(a.getAttribute("data-row") || "0", 10)); });
    });
    root.querySelectorAll<HTMLElement>("a[data-mapjob]").forEach((a) => {
      a.addEventListener("click", (e) => { e.preventDefault(); openMapJob(parseInt(a.getAttribute("data-mapjob") || "0", 10)); });
    });
    root.querySelectorAll<HTMLElement>("[data-pin]").forEach((el) => {
      el.addEventListener("click", () => onPin(el.getAttribute("data-pin") || ""));
    });
    const closeBtn = root.querySelector<HTMLElement>("[data-close]");
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    const scrim = root.querySelector<HTMLElement>("[data-scrim]");
    if (scrim) scrim.addEventListener("click", closeDrawer);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    document.addEventListener("keydown", onKey);
    toggleBtns.forEach((b) => b.addEventListener("click", () => setView(b.getAttribute("data-view-btn") || "lista")));

    setView("lista");

    // Dispara el split-flap cuando el tablero entra en viewport: así el efecto
    // "tablero de aeropuerto" se ve como animación de scroll, al llegar a la
    // sección, y no al montar el componente fuera de pantalla.
    let flapDone = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !flapDone) {
            flapDone = true;
            runFlap();
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(root);

    const tick = () => {
      const s = now();
      root.querySelectorAll<HTMLElement>("[data-clock]").forEach((el) => (el.textContent = s));
    };
    tick(); // rellena el placeholder de inmediato al montar
    const clk = setInterval(tick, 1000);

    return () => {
      clearInterval(clk);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (settleT) clearTimeout(settleT);
      document.removeEventListener("keydown", onKey);
    };
  }, [data]);

  return (
    <section aria-label="Vacantes con embarque abierto" style={{ width: "100%", background: "#ffffff", padding: "clamp(44px, 7vw, 72px) clamp(12px, 3vw, 20px)", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "1400px" }}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <Reveal amount={0.12} offset={40}>
          <div ref={rootRef} className={scope} dangerouslySetInnerHTML={{ __html: html }} />
        </Reveal>
      </div>
    </section>
  );
}
