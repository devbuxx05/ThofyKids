import { Categoria } from '../../types'

interface Props {
    categorias: Categoria[]
    selected: number | null
    onSelect: (id: number | null) => void
}

export default function CategoryFilter({ categorias, selected, onSelect }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelect(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${selected === null
                        ? 'bg-accent text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent'
                    }`}
            >
                Todos
            </button>
            {categorias.map((cat) => (
                <button
                    key={cat.id_categoria}
                    onClick={() => onSelect(cat.id_categoria)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${selected === cat.id_categoria
                            ? 'bg-accent text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-accent hover:text-accent'
                        }`}
                >
                    {cat.nombre}
                </button>
            ))}
        </div>
    )
}
