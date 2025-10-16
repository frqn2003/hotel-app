
interface BotonProps {
    texto: string;
    bgColor?: string;
    textColor?: string;
    onClick?: () => void;
}

export default function Boton({ texto, bgColor, textColor, onClick }: BotonProps) {   
    const defaultClassName = "cursor-pointer px-4 py-2 rounded-lg transition-all";
    const defaultBgColor = bgColor ? bgColor : "bg-[#251818] hover:bg-[#251818]/90";
    const defaultTextColor = textColor ? textColor : "text-white";

    const classNameFinal = `${defaultClassName} ${defaultBgColor} ${defaultTextColor}`;
    return (
        <button className={classNameFinal} onClick={onClick}>{texto}</button>
    )
}