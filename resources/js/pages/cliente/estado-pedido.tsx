import { useForm } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
}

interface DetallePedido {
    id: number;
    cantidad: number;
    precio_unitario: number;
    producto: Producto;
}

interface Pedido {
    id: number;
    codigo_pedido: number;
    nombre_cliente: string;
    estado: 'pendiente' | 'aceptado' | 'preparando' | 'listo';
    total: number;
    created_at: string;
    detalles: DetallePedido[];
}

interface Restaurante {
    id: number;
    nombre: string;
}

interface Props {
    restaurante: Restaurante;
    pedido: Pedido | null;
    codigoBuscado: string | null;
}

const estadoConfig: Record<string, { label: string; color: string; bg: string }> = {
    pendiente: { label: 'Tu pedido está en espera', color: 'bg-amber-400', bg: 'bg-amber-50 border-amber-200' },
    aceptado: { label: 'Tu pedido fue aceptado', color: 'bg-sky-500', bg: 'bg-sky-50 border-sky-200' },
    preparando: { label: 'Tu pedido se está preparando', color: 'bg-orange-500', bg: 'bg-orange-50 border-orange-200' },
    listo: { label: '¡Tu pedido está listo!', color: 'bg-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
};

export default function EstadoPedido({ restaurante, pedido, codigoBuscado }: Props) {
    const { data, setData, get, processing } = useForm({
        codigo: codigoBuscado || '',
    });

    function handleBuscar(e: React.FormEvent) {
        e.preventDefault();
        get(`/estado-pedido/${restaurante.id}?codigo=${data.codigo}`);
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-[#57394c] to-[#330404] px-6 py-10 md:py-14">
                <div className="max-w-xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Estado de Pedido
                    </h1>
                    <p className="text-[#c6acab]">
                        Restaurante: <span className="font-semibold text-white">{restaurante.nombre}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6 -mt-6 pb-16">
                <form onSubmit={handleBuscar} className="bg-white rounded-xl shadow-lg border border-[#d6cdcd]/50 p-5 mb-8">
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Escribe tu código de pedido"
                            value={data.codigo}
                            onChange={(e) => setData('codigo', e.target.value)}
                            className="flex-1 rounded-lg border border-[#d6cdcd] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#57394c]/30 focus:border-[#57394c] transition-all"
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#57394c] hover:bg-[#63444a] text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
                        >
                            {processing ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </form>

                {codigoBuscado && !pedido && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm flex items-start gap-3">
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            No se encontró un pedido con código <strong>{codigoBuscado}</strong>
                        </div>
                    </div>
                )}

                {pedido && (
                    <div className="bg-white rounded-xl shadow-lg border border-[#d6cdcd]/50 overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#330404]">
                                    Código: <span className="text-[#57394c]">{pedido.codigo_pedido}</span>
                                </h2>
                                <span className={`${estadoConfig[pedido.estado].color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                                    {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                </span>
                            </div>

                            <div className={`${estadoConfig[pedido.estado].bg} border rounded-lg px-4 py-3 mb-6`}>
                                <p className="text-sm font-medium">
                                    {estadoConfig[pedido.estado].label}
                                </p>
                            </div>

                            <div className="mb-4">
                                <p className="text-[#856868] text-sm mb-0.5">Cliente</p>
                                <p className="font-medium text-[#330404]">{pedido.nombre_cliente}</p>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-[#d6cdcd]/30 mb-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-[#f5efef] text-[#856868]">
                                            <th className="text-left px-3 py-2 font-medium">Producto</th>
                                            <th className="text-left px-3 py-2 font-medium">Cantidad</th>
                                            <th className="text-left px-3 py-2 font-medium">Precio U.</th>
                                            <th className="text-left px-3 py-2 font-medium">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedido.detalles.map((detalle) => (
                                            <tr key={detalle.id} className="border-t border-[#d6cdcd]/20">
                                                <td className="px-3 py-2 text-[#330404]">{detalle.producto.nombre}</td>
                                                <td className="px-3 py-2 text-[#856868]">{detalle.cantidad}</td>
                                                <td className="px-3 py-2 text-[#856868]">Bs. {Number(detalle.precio_unitario).toFixed(2)}</td>
                                                <td className="px-3 py-2 font-medium text-[#330404]">
                                                    Bs. {(detalle.cantidad * Number(detalle.precio_unitario)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-[#57394c]/5 border border-[#57394c]/15 rounded-lg px-4 py-3 flex items-center justify-between">
                                <span className="font-semibold text-[#330404]">Total</span>
                                <span className="text-xl font-bold text-[#57394c]">Bs. {Number(pedido.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
