"use client";

interface ReadingPreferencesPreviewProps {
    fontSize?: number;
    fontFamily?: string;
    lineSpacing?: number;
    theme?: string;
    hasError: boolean;
}

export function ReadingPreferencesPreview({
    fontSize,
    fontFamily,
    lineSpacing,
    theme,
    hasError,
}: ReadingPreferencesPreviewProps) {
    const safeFontSize = fontSize && fontSize >= 10 && fontSize <= 20 ? fontSize : 14;
    const safeLineSpacing = lineSpacing && lineSpacing >= 1 && lineSpacing <= 5 ? lineSpacing : 1.5;
    const safeFontFamily = fontFamily ?? "Arial";
    const safeTheme = theme === "Oscuro" || theme === "Claro" ? theme : "Claro";

    return (
        <div
            className={`border rounded p-4 mt-6 ${safeTheme === "Oscuro" ? "bg-black text-white" : "bg-white text-black"
                }`}
            style={{
                fontSize: `${safeFontSize}px`,
                fontFamily: safeFontFamily,
                lineHeight: safeLineSpacing,
            }}
        >
            <h4 className="text-center font-semibold mb-2">Título: Tina la valiente</h4>
            <p>
                {hasError
                    ? "Corrige los valores para visualizar el ejemplo."
                    : "Tina era una tortuga que soñaba con rugir como un león y correr por la sabana con una melena dorada. Se pintaba rayas con lodo, practicaba rugidos frente al lago y hasta caminaba rápido… o al menos lo intentaba. Pero los otros animales solo sonreían, sabiendo que Tina tenía algo especial. Un día, una fuerte tormenta sorprendió a todos, y mientras los demás buscaban refugio, Tina ayudó con su caparazón a proteger a los más pequeños. Esa noche, no hubo rugido, pero sí muchos “gracias”. Tina entendió que no necesitaba ser un león para ser valiente. Desde entonces, caminó con la cabeza en alto, orgullosa de ser quien era. Porque a veces, ser tú mismo es lo más valiente que puedes ser."}
            </p>
        </div>
    );
}