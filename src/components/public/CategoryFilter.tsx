import { Categoria } from '../../types'

interface Props {
    categorias: Categoria[]
    selected: number | null
    onSelect: (id: number | null) => void
}

export default function CategoryFilter({ categorias, selected, onSelect }: Props) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
                onClick={() => onSelect(null)}
                className={`shrink-0 px-4 py-2 rounded-[6px] text-sm font-medium border transition-all duration-hover ${
                    selected === null
                        ? 'border-accent text-accent bg-transparent'
                        : 'border-border text-text-muted bg-transparent hover:border-accent/50 hover:text-accent'
                }`}
            >
                Todos
            </button>
            {categorias.map((cat) => (
                <button
                    key={cat.id_categoria}
                    onClick={() => onSelect(cat.id_categoria)}
                    className={`shrink-0 px-4 py-2 rounded-[6px] text-sm font-medium border transition-all duration-hover ${
                        selected === cat.id_categoria
                            ? 'border-accent text-accent bg-transparent'
                            : 'border-border text-text-muted bg-transparent hover:border-accent/50 hover:text-accent'
                    }`}
                >
                    {cat.nombre}
                </button>
            ))}
        </div>
    )
}
