"use client";

const THUMB_CLASSES =
  "pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-indigo-latam " +
  "[&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(15,0,80,0.4)] " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 " +
  "[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 " +
  "[&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-indigo-latam";

interface SalaryRangeProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function SalaryRange({ min, max, step, value, onChange }: SalaryRangeProps): React.JSX.Element {
  const [low, high] = value;

  const handleLow = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const next = Math.min(Number(event.target.value), high);
    onChange([next, high]);
  };

  const handleHigh = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const next = Math.max(Number(event.target.value), low);
    onChange([low, next]);
  };

  return (
    <div className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-indigo-latam/15" />
      <input
        type="range"
        aria-label="Salario mínimo"
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={handleLow}
        className={THUMB_CLASSES}
      />
      <input
        type="range"
        aria-label="Salario máximo"
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={handleHigh}
        className={THUMB_CLASSES}
      />
    </div>
  );
}
