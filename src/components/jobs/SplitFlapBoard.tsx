"use client";

import { useEffect, useState } from "react";

/**
 * Orden real de un tambor de aeropuerto: espacio primero, luego el alfabeto,
 * números y puntuación. La distancia dentro de este anillo es lo que decide
 * cuántos aletazos da cada celda, y eso es lo que produce el ritmo irregular
 * característico del tablero.
 */
const CHARSET = " ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ0123456789.,-'¿?¡!";
const BLANK_INDEX = 0;

/** Debe coincidir con `--sf-flip` en globals.css: cada aletazo son dos medios giros. */
const FLIP_MS = 26;
const TICK_MS = FLIP_MS * 2;

interface SplitFlapBoardProps {
  /** Cada string es una fila del tablero. Se centran sobre el ancho de la más larga. */
  rows: readonly string[];
  /** Texto real para lectores de pantalla, ya que las celdas son decorativas. */
  label: string;
  className?: string;
}

function normalize(value: string): string {
  return value
    .toUpperCase()
    .split("")
    .map((character) => (CHARSET.includes(character) ? character : " "))
    .join("");
}

function centerPad(value: string, width: number): string {
  const spare = width - value.length;
  const left = Math.floor(spare / 2);
  return " ".repeat(left) + value + " ".repeat(spare - left);
}

/**
 * Retardo inicial determinista (nada de Math.random: rompería la hidratación).
 * Mezcla fila y columna para que el barrido no se lea como una línea recta.
 */
function startDelay(row: number, column: number): number {
  return column * 16 + ((row * 53 + column * 17) % 7) * 20 + row * 70;
}

function Flap({ target, delayMs }: { target: string; delayMs: number }): React.JSX.Element {
  const targetIndex = Math.max(CHARSET.indexOf(target), 0);
  const [{ index, previous }, setPosition] = useState({ index: BLANK_INDEX, previous: BLANK_INDEX });

  useEffect(() => {
    if (index === targetIndex) return;

    const isFirstStep = index === BLANK_INDEX && previous === BLANK_INDEX;
    const timer = window.setTimeout(
      () => {
        setPosition((current) => ({
          index: (current.index + 1) % CHARSET.length,
          previous: current.index,
        }));
      },
      isFirstStep ? delayMs : TICK_MS,
    );

    return () => window.clearTimeout(timer);
  }, [index, previous, targetIndex, delayMs]);

  const settled = index === previous;
  const incoming = CHARSET[index];
  const outgoing = CHARSET[previous];

  return (
    <span className="sf-cell">
      <span className="sf-flap">
        <span className="sf-face sf-face--top">
          <span>{incoming}</span>
        </span>
        <span className="sf-face sf-face--bottom">
          <span>{outgoing}</span>
        </span>

        {/* En reposo inicial (espacio → espacio) no hay hoja en vuelo que animar. */}
        {settled ? null : (
          <>
            <span key={`t${index}`} className="sf-face sf-face--top sf-face--fold-out">
              <span>{outgoing}</span>
            </span>
            <span key={`b${index}`} className="sf-face sf-face--bottom sf-face--fold-in">
              <span>{incoming}</span>
            </span>
          </>
        )}
      </span>
    </span>
  );
}

/**
 * Cuánto tarda la última celda en llegar a su destino. Es determinista: retardo
 * de arranque + un aletazo por cada paso del tambor. Las esquinas barren su
 * gradiente de color en exactamente este tiempo, así el color acompaña al
 * tablero mientras se revela y aterriza justo cuando la última hoja cae.
 */
function settleDuration(grid: readonly string[]): number {
  const times = grid.flatMap((row, rowIndex) =>
    row.split("").map((character, column) => {
      const steps = Math.max(CHARSET.indexOf(character), 0);
      return steps === 0 ? 0 : startDelay(rowIndex, column) + steps * TICK_MS;
    }),
  );

  return Math.max(...times);
}

export function SplitFlapBoard({ rows, label, className }: SplitFlapBoardProps): React.JSX.Element {
  const normalized = rows.map(normalize);
  const width = Math.max(...normalized.map((row) => row.length));
  const grid = normalized.map((row) => centerPad(row, width));

  return (
    <div
      className={`sf-board ${className ?? ""}`}
      style={
        {
          "--sf-cols": width,
          "--sf-settle": `${settleDuration(grid)}ms`,
        } as React.CSSProperties
      }
    >
      <span className="sr-only">{label}</span>

      <div aria-hidden="true" className="sf-panel">
        <div className="sf-row sf-row--marker">
          {Array.from({ length: width }, (_, column) => (
            <span
              key={column}
              className={`sf-cell sf-cell--blank ${column === 0 || column === width - 1 ? "sf-cell--accent" : ""}`}
            />
          ))}
        </div>

        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sf-row">
            {row.split("").map((character, column) => (
              <Flap key={column} target={character} delayMs={startDelay(rowIndex, column)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
