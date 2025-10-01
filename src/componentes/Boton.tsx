
interface BotonProps {
    texto: string;
    bgColor?: string;
    textColor?: string;
}

export default function Boton({ texto, bgColor, textColor }: BotonProps) {   
    const defaultClassName = "cursor-pointer px-4 py-2 rounded-lg transition-all";
    const defaultBgColor = bgColor ? bgColor : "bg-black hover:bg-black/70";
    const defaultTextColor = textColor ? textColor : "text-white";

    const classNameFinal = `${defaultClassName} ${defaultBgColor} ${defaultTextColor}`;
    return (
        <button className={classNameFinal}>{texto}</button>
    )
}