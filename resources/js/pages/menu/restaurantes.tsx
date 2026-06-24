import { show } from '@/actions/App/Http/Controllers/MenuController';

interface Restaurante {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    img?: string;
}

interface Props {
    restaurantes: Restaurante[];
}

const logos = ['🍕', '🍔', '🌮', '🥗', '🍝', '🥘', '🍣', '🥩'];

export default function Restaurantes({ restaurantes }: Props) {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-[#57394c] to-[#330404] px-6 py-16 md:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Restaurantes Disponibles
                    </h1>
                    <p className="text-[#c6acab] text-lg max-w-xl mx-auto">
                        Elige tu restaurante favorito y disfruta de los mejores platillos
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-8 pb-16">
                {restaurantes.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-[#d6cdcd] p-12 text-center">
                        <p className="text-[#856868] text-lg">No hay restaurantes disponibles</p>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {restaurantes.map((restaurante, index) => (
                            <a
                                key={restaurante.id}
                                href={show({ restaurante: restaurante.id }).url}
                                className="group bg-white rounded-2xl shadow-lg border border-[#d6cdcd]/50 p-6 flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#b09695]"
                            >
                                <div className="w-16 h-16 rounded-xl bg-[#f5efef] flex items-center justify-center text-2xl shrink-0">
                                    {logos[index % logos.length]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-[#330404] group-hover:text-[#57394c] transition-colors">
                                        {restaurante.nombre}
                                    </h2>
                                    <p className="text-[#856868] mt-1 flex items-center gap-1.5">
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {restaurante.direccion}
                                    </p>
                                    <p className="text-[#856868] mt-0.5 flex items-center gap-1.5">
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {restaurante.telefono}
                                    </p>
                                </div>
                                <div className="shrink-0 text-[#b09695] group-hover:text-[#57394c] transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
