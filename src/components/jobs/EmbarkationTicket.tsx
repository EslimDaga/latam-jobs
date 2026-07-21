"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion";

/**
 * EmbarkationTicket — "Pase de Embarque" del proceso de selección LATAM.
 *
 * Portado 1:1 desde el diseño de Figma (node 12:1130). Es un ticket de avión
 * dividido por una perforación: a la izquierda el itinerario de 7 etapas, a la
 * derecha el talón con el detalle de la etapa activa y un código de barras.
 * Al pasar el cursor (o tocar) una etapa se muestra su detalle; al hacer click
 * se fija (pin). Las flechas del teclado navegan entre etapas.
 */

type Step = {
  code: string;
  title: string;
  phase: string;
  desc: string;
};

const STEPS: Step[] = [
  {
    code: "POS",
    title: "Postulación",
    phase: "Aplicación",
    desc: 'Entra a nuestra plataforma "Trabaja con Nosotros", completa tus datos y postula al rol que más te apasione. ¡El primer paso es el más importante!',
  },
  {
    code: "VAL",
    title: "Validaciones Iniciales",
    phase: "Revisión",
    desc: "Revisaremos tu perfil para asegurarnos de que tu experiencia y formación se alineen con lo que el puesto necesita. Si todo calza, ¡avanzamos!",
  },
  {
    code: "PRU",
    title: "Pruebas",
    phase: "Evaluación",
    desc: "Te enviaremos unas pruebas online para conocer mejor tus habilidades, conocimientos y competencias. Esto nos ayuda a entender cómo encajas con el rol y qué herramientas traes contigo.",
  },
  {
    code: "ENT",
    title: "Entrevistas",
    phase: "Conversación",
    desc: "Conversarás con nuestro equipo de Atracción de Talento y con los líderes del área. Queremos conocer tu historia, qué esperas de nosotros y confirmar juntos si somos el match perfecto.",
  },
  {
    code: "CPL",
    title: "Etapas Complementarias",
    phase: "Verificación",
    desc: "Según el puesto al que postules, realizaremos algunas validaciones de cierre, como exámenes médicos o revisiones específicas. Queremos dejar todo listo y seguro para lo que viene.",
  },
  {
    code: "OFR",
    title: "Propuesta de Trabajo",
    phase: "Oferta",
    desc: "Si eres la persona seleccionada, ¡te daremos la gran noticia! Recibirás una propuesta formal con todos los detalles y beneficios del cargo. Estaremos contigo para resolver cualquier duda.",
  },
  {
    code: "EMB",
    title: "Embarque LATAM",
    phase: "Bienvenida",
    desc: "Darás inicio a tu experiencia en LATAM. Te acompañaremos en tu proceso de integración para que conozcas nuestra cultura, conectes con tu equipo y comiences este nuevo viaje con todo lo necesario para despegar.",
  },
];

const BAR_WIDTHS = [3, 2, 4, 2, 3, 5, 2, 3, 2, 4, 3, 2, 5, 2, 3, 4, 2, 3, 2, 4, 3, 2, 5, 2];

const INTER = "var(--font-inter), sans-serif";
const BARLOW = "var(--font-barlow), sans-serif";

function LatamLogo() {
  return (
    <svg width="132" height="40" viewBox="0 0 200 61" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }} aria-label="LATAM">
      <path d="M129.67 47.1185V60.8415H131.831V47.1185H129.67ZM167.394 47.1185V60.8415H178.479V58.8397H169.555V54.5463H177.326V52.7025H169.555V48.9887H178.188V47.1317H167.394V47.1185ZM75.9673 47.1185V60.8415H78.1286V47.1185H75.9673ZM111.676 60.8547H121.754V58.9977H113.837V47.1317H111.676V60.8547ZM95.1145 54.8492C93.5366 54.8492 91.9454 54.4146 90.9377 53.8483V48.6989H96.5599C99.2914 48.6989 100.299 50.1344 100.299 51.4119C100.299 53.2689 98.8538 54.8492 95.1145 54.8492ZM61.7129 55.4155H55.3747L58.5438 48.9755L61.7129 55.4155ZM144.507 60.8547V49.555L154.015 60.2752C154.307 60.7098 154.731 60.8415 155.314 60.8415H156.614V47.1185H154.598V57.9836L145.224 47.698C144.932 47.2634 144.653 47.1317 143.924 47.1317H142.479V60.8547H144.507ZM90.9377 60.8547V55.8501C91.9454 56.4164 93.3907 56.7062 94.9687 56.7062C95.8306 56.7062 96.414 56.7062 97.13 56.5613L100.007 60.8547H102.315L99.1455 55.995C101.161 55.139 102.46 53.4269 102.46 51.4251C102.46 48.857 100.299 46.9868 96.414 46.9868H88.7763V60.8547H90.9377ZM64.3119 60.8547H66.46L59.9892 47.698C59.6974 47.2634 59.419 47.1317 58.9814 47.1317H57.4035L50.641 60.8547H52.8023L54.5261 57.2856H62.5881L64.3119 60.8547ZM194.325 46.842C190.586 46.842 188.132 48.4224 188.132 50.8456C188.132 53.1372 190.002 53.9932 193.025 54.5595L194.471 54.8492C196.632 55.2838 197.786 55.995 197.786 57.1408C197.786 58.2866 196.632 59.1426 193.755 59.1426C191.169 59.1426 189.14 58.2866 188.57 57.8519L188 59.8538C188.57 60.1435 190.585 60.9995 193.609 60.9995C197.64 60.9995 199.947 59.4323 199.947 56.9959C199.947 54.7044 197.931 53.5586 194.762 52.9923L193.317 52.7025C191.01 52.2679 190.294 51.8465 190.294 50.7007C190.294 49.555 191.593 48.6989 194.179 48.6989C196.34 48.6989 197.918 49.1335 198.647 49.4101L199.085 47.698C198.21 47.4083 196.619 46.842 194.325 46.842Z" fill="white" />
      <path d="M114.156 32.1309H120.229V15.3262L130.837 14.6282V10.2953H103.548V14.6282L114.156 15.3262V32.1309ZM70.3318 32.1309L72.8247 27.1H58.0797V10.2953H51.768V32.1309H70.3318ZM93.8018 23.689H85.6205L89.7575 14.9443L93.8018 23.689ZM148.698 23.689H140.503L144.64 14.9443L148.698 23.689ZM176.451 26.7971C176.689 27.5741 177.617 28.1141 178.638 28.1141H184.95L189.631 15.2603L194.073 32.1441H200L195.094 12.7844C194.63 10.8484 193.529 10.3085 191.739 10.3085H185.573L181.131 23.0832L177.617 12.2313C177.153 10.8484 176.291 10.2953 174.886 10.2953H167.951L162.262 32.1309H168.269L172.632 15.2472L176.451 26.7971ZM152.835 32.1309H159.465L149.016 11.6781C148.472 10.6772 147.929 10.2821 146.682 10.2821H140.914L129.922 32.1177H136.631L138.58 28.0878H150.899L152.835 32.1309ZM97.8593 32.1309H104.569L94.12 11.6781C93.5764 10.6772 93.0327 10.2821 91.773 10.2821H86.005L75.0126 32.1177H81.7088L83.658 28.0878H95.9764L97.8593 32.1309Z" fill="white" />
      <path d="M8.97702 54.3097L14.3605 52.3606C15.4876 51.9523 15.4876 52.8479 15.4876 54.1912V56.6539C15.4876 58.6426 14.8114 58.8797 13.9229 59.2089L8.97702 61V54.3097Z" fill="white" />
      <path d="M8.97702 43.4049L22.6479 38.4662C23.775 38.0579 23.775 38.9535 23.775 40.2968V42.7464C23.775 44.7482 23.0988 44.9852 22.2104 45.3145L8.97702 50.0951V43.4049Z" fill="white" />
      <path d="M7.84984 27.8506L0.901671 25.3352C3.57628e-07 25.0059 0 23.7943 0 23.3597C0 23.3597 -1.3113e-06 24.8216 1.33924 24.3343L35.4171 12.0205C38.1088 11.0459 38.1088 10.2952 36.9818 9.88698C38.1088 10.2952 38.1088 10.2952 38.1088 13.5614C38.1088 16.6826 38.1088 17.723 36.7696 18.2103L10.0908 27.8506C8.97692 28.2589 8.97692 28.2589 7.84984 27.8506Z" fill="white" />
      <path d="M36.9951 20.805C38.1222 21.2132 38.1222 21.9639 35.4304 22.9385L8.97702 32.4998V39.1769L36.7829 29.1283C38.1222 28.641 38.1222 27.6006 38.1222 24.4793C38.1222 21.2001 38.1222 21.2001 36.9951 20.805Z" fill="white" />
      <path d="M2.91739 15.1556L14.8247 19.4621L24.0669 16.117L1.80356 8.07023C0.238892 7.50393 0.0134746 7.42491 0.0134746 8.53117V11.4285C0.000214741 14.102 2.02897 14.8395 2.91739 15.1556Z" fill="#ED1650" />
      <path d="M36.9954 20.8053L33.3092 19.462L24.0671 22.8071L29.9147 24.9275L35.4308 22.9388C38.1225 21.9511 38.1225 21.2004 36.9954 20.8053Z" fill="#ED1650" />
      <path d="M36.9952 9.88733C36.9952 9.88733 12.3318 0.971355 10.7672 0.405052C9.20252 -0.161251 8.9771 -0.24027 8.9771 0.865996V3.76336C8.9771 6.43683 10.9926 7.16117 11.8943 7.49042L29.9277 14.0095L35.4438 12.0208C38.1223 11.0463 38.1223 10.2956 36.9952 9.88733Z" fill="#ED1650" />
      <path d="M1.35251 24.3352L8.97693 21.5827L1.80335 18.9882C0.238685 18.4219 0.0132679 18.3429 0.0132679 19.4492V23.3606C8.09133e-06 23.3606 8.9407e-06 24.8224 1.35251 24.3352Z" fill="#ED1650" />
    </svg>
  );
}

export function EmbarkationTicket(): React.JSX.Element {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  const active = hovered != null ? hovered : pinned;
  const hasActive = active != null;
  const idx = hasActive ? (active as number) : 0;
  const cur = STEPS[idx];
  const last = STEPS.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const fwd = e.key === "ArrowDown" || e.key === "ArrowRight";
        setPinned((prevPinned) => {
          const currentActive = prevPinned != null ? prevPinned : hovered != null ? hovered : -1;
          return fwd
            ? Math.min(STEPS.length - 1, currentActive + 1)
            : Math.max(0, (currentActive < 0 ? 1 : currentActive) - 1);
        });
        setHovered(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hovered]);

  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "22px",
        background: "#ffffff",
        fontFamily: INTER,
        padding: "50px 20px",
        boxSizing: "border-box",
      }}
    >
      <Reveal from="up">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "rgba(15,0,79,0.62)",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <span>Proceso de Selección</span>
          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(15,0,79,0.4)" }} />
          <span>LATAM</span>
        </div>
      </Reveal>

      <Reveal from="up" delay={0.12} offset={40}>
      <div
        style={{
          position: "relative",
          width: "1000px",
          maxWidth: "92vw",
          borderRadius: "26px",
          boxShadow: "0 34px 80px rgba(27,0,136,0.28), 0 0 0 1px rgba(15,0,79,0.06)",
          overflow: "hidden",
          background: "#0F004F",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Itinerario (talón principal) */}
          <div
            style={{
              flex: "1 1 auto",
              padding: "30px 34px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              minWidth: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <LatamLogo />
                <span style={{ fontSize: "12px", letterSpacing: "2px", color: "#A7A2E0", textTransform: "uppercase", fontWeight: 600 }}>
                  Pase de Embarque
                </span>
              </div>
              <span style={{ fontSize: "12px", letterSpacing: "2px", color: "#A7A2E0", fontWeight: 700, textTransform: "uppercase" }}>
                Itinerario · 7 Etapas
              </span>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.12)" }} />

            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  top: "24px",
                  bottom: "24px",
                  width: "1px",
                  background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.25) 0 5px, transparent 5px 10px)",
                }}
              />

              {STEPS.map((s, i) => {
                const on = hasActive && i === active;
                const isLast = i === last;
                return (
                  <div
                    key={s.code}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      setPinned((st) => (st === i ? null : i));
                      setHovered(null);
                    }}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      height: "48px",
                      padding: "0 14px 0 8px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      background: on ? "rgba(255,255,255,0.06)" : "transparent",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span style={{ width: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isLast ? (
                        <span style={{ fontSize: "16px", color: "#E8114B", lineHeight: 1 }}>✈</span>
                      ) : (
                        <span
                          style={{
                            width: on ? "14px" : "10px",
                            height: on ? "14px" : "10px",
                            borderRadius: "50%",
                            background: on ? "#E8114B" : "rgba(255,255,255,0.32)",
                            boxShadow: on ? "0 0 0 4px rgba(232,17,75,0.22)" : "none",
                            transition: "all 0.2s ease",
                          }}
                        />
                      )}
                    </span>
                    <span
                      style={{
                        width: "54px",
                        flexShrink: 0,
                        fontFamily: BARLOW,
                        fontWeight: 700,
                        fontSize: "21px",
                        letterSpacing: "0.5px",
                        color: on ? "#E8114B" : "#EAE8FA",
                        transition: "color 0.2s",
                      }}
                    >
                      {s.code}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "14.5px",
                        fontWeight: 600,
                        color: on ? "#ffffff" : "#C9C5F0",
                        transition: "color 0.2s",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.title}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        color: on ? "#A7A2E0" : "#7F7AC8",
                        transition: "color 0.2s",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Perforación */}
          <div style={{ position: "relative", width: "1px", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, borderLeft: "2px dashed rgba(255,255,255,0.16)" }} />
            <div style={{ position: "absolute", top: "-18px", left: "-18px", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff" }} />
            <div style={{ position: "absolute", bottom: "-18px", left: "-18px", width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff" }} />
          </div>

          {/* Talón de embarque (detalle) */}
          <div style={{ flex: "0 0 300px", padding: "30px 28px", display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                {/* Resumen (sin etapa activa) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    opacity: hasActive ? 0 : 1,
                    transition: "opacity 0.22s ease",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "1.5px", color: "#7F7AC8", textTransform: "uppercase" }}>Ruta</span>
                    <span style={{ fontSize: "17px", fontWeight: 700, color: "#ffffff", lineHeight: 1.35 }}>Postulación &gt; Embarque LATAM</span>
                  </div>
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.16)" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "1.5px", color: "#7F7AC8", textTransform: "uppercase" }}>Destino</span>
                    <span style={{ fontSize: "17px", fontWeight: 700, color: "#ffffff", lineHeight: 1.35 }}>Tu próximo gran viaje empieza aquí</span>
                  </div>
                  <p style={{ margin: "auto 0 0", fontSize: "12px", lineHeight: 1.5, color: "#7F7AC8" }}>
                    Pasa el cursor o toca una etapa del itinerario para ver su detalle.
                  </p>
                </div>

                {/* Detalle (etapa activa) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    opacity: hasActive ? 1 : 0,
                    transition: "opacity 0.22s ease",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "44px", color: "#E8114B", lineHeight: 1 }}>{cur.code}</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", color: "#A7A2E0" }}>
                      ETAPA {idx + 1} / {STEPS.length}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "#E8114B",
                        background: "rgba(232,17,75,0.16)",
                        padding: "3px 9px",
                        borderRadius: "100px",
                      }}
                    >
                      {cur.phase}
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>{cur.title}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: "#D8D5F4" }}>{cur.desc}</p>
                </div>
              </div>

              {/* Código de barras */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "stretch" }}>
                <div style={{ height: 0, borderTop: "3px dotted rgba(255,255,255,0.3)", marginBottom: "6px" }} />
                <div style={{ display: "flex", gap: "2px", height: "38px", width: "100%", alignItems: "stretch" }}>
                  {BAR_WIDTHS.map((w, i) => (
                    <span key={i} style={{ width: `${w}px`, background: "rgba(255,255,255,0.55)", flexShrink: 0 }} />
                  ))}
                </div>
                <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#7F7AC8" }}>LA 2025 07 01</span>
              </div>
            </div>

            {/* Etiqueta vertical */}
            <div style={{ flexShrink: 0, display: "flex", gap: "12px", alignItems: "stretch" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "14px" }}>
                <span style={{ flex: 1, width: "1px", background: "rgba(255,255,255,0.28)" }} />
                <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: 1, transform: "rotate(-90deg)", padding: "6px 0", display: "inline-block" }}>✈</span>
                <span style={{ flex: 1, width: "1px", background: "rgba(255,255,255,0.28)" }} />
              </div>
              <span
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: "#A7A2E0",
                  textAlign: "center",
                }}
              >
                Talón de Embarque
              </span>
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}
