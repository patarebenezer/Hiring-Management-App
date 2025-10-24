export type TriState = "mandatory" | "optional" | "off";

export default function ToggleGroup({
 value,
 onChange,
}: Readonly<{
 value: TriState;
 onChange: (v: TriState) => void;
}>) {
 return (
  <div className='chips'>
   {(["mandatory", "optional", "off"] as TriState[]).map((v) => (
    <button
     key={v}
     type='button'
     onClick={() => onChange(v)}
     className='chip'
     style={{
      borderColor: value === v ? "#4f46e5" : undefined,
      boxShadow:
       value === v ? "0 0 0 2px rgba(79,70,229,0.25) inset" : undefined,
     }}
     aria-pressed={value === v}
    >
     {v[0].toUpperCase() + v.slice(1)}
    </button>
   ))}
  </div>
 );
}
