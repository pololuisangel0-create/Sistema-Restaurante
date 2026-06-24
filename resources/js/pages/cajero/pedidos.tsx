import { router, usePage } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
}

interface DetallePedido {
    id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    producto: Producto;
}

interface Pedido {
    id: number;
    codigo_pedido: number;
    nombre_cliente: string;
    estado: 'pendiente' | 'aceptado' | 'preparando' | 'listo' | 'entregado';
    total: number;
    created_at: string;
    detalles: DetallePedido[];
}

interface Props {
    pedidos: Pedido[];
}

const estadoConfig: Record<string, { label: string; bg: string; next: string | null; nextLabel: string | null }> = {
    pendiente: { label: 'Pendiente', bg: 'bg-amber-400', next: 'aceptado', nextLabel: 'Aceptar' },
    aceptado: { label: 'Aceptado', bg: 'bg-sky-500', next: 'preparando', nextLabel: 'Preparando' },
    preparando: { label: 'Preparando', bg: 'bg-orange-500', next: 'listo', nextLabel: 'Listo' },
    listo: { label: 'Listo', bg: 'bg-emerald-500', next: 'entregado', nextLabel: 'Entregar' },
    entregado: { label: 'Entregado', bg: 'bg-teal-600', next: null, nextLabel: null },
};

export default function PedidosCajero({ pedidos }: Props) {
    const { flash } = usePage<any>().props;

    function cambiarEstado(pedidoId: number, nuevoEstado: 'aceptado' | 'preparando' | 'listo' | 'entregado') {
        router.put(`/pedidos/${pedidoId}`, {
            estado: nuevoEstado,
        });
    }

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            {flash?.warning && (
                <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-700 px-5 py-3 rounded-xl text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {flash.warning}
                </div>
            )}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark">Gestionar Pedidos</h1>
                <div className="flex gap-2">
                    <a
                        href="/cajero/pedidos"
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                    >
                        + Registrar Pedido
                    </a>
                </div>
            </div>

            {pedidos.length === 0 ? (
                <div className="text-center py-16 bg-light/30 rounded-xl border border-accent-light/30">
                    <p className="text-muted text-lg">No hay pedidos</p>
                    <p className="text-muted-light text-sm mt-1">Los pedidos aparecerán aquí cuando los clientes los realicen</p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {pedidos.map((pedido) => {
                        const config = estadoConfig[pedido.estado];
                        return (
                            <div
                                key={pedido.id}
                                className="bg-white rounded-xl shadow-sm border border-accent-light/30 overflow-hidden transition-all hover:shadow-md"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-dark">
                                                Código: <span className="text-primary">{pedido.codigo_pedido}</span>
                                            </h3>
                                            <p className="text-muted text-sm mt-0.5">
                                                Cliente: <span className="font-medium text-dark">{pedido.nombre_cliente}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`${config.bg} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                                                {config.label}
                                            </span>
                                            <span className="text-lg font-bold text-dark">Bs. {Number(pedido.total).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto rounded-lg border border-accent-light/20">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-accent-light/20 text-muted">
                                                    <th className="text-left px-3 py-2 font-medium">Producto</th>
                                                    <th className="text-left px-3 py-2 font-medium">Cantidad</th>
                                                    <th className="text-left px-3 py-2 font-medium">Precio U.</th>
                                                    <th className="text-left px-3 py-2 font-medium">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedido.detalles.map((detalle) => (
                                                    <tr key={detalle.id} className="border-t border-accent-light/10">
                                                        <td className="px-3 py-2 text-dark">{detalle.producto.nombre}</td>
                                                        <td className="px-3 py-2 text-muted">{detalle.cantidad}</td>
                                                        <td className="px-3 py-2 text-muted">Bs. {Number(detalle.precio_unitario).toFixed(2)}</td>
                                                        <td className="px-3 py-2 font-medium text-dark">
                                                            Bs. {(detalle.cantidad * Number(detalle.precio_unitario)).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="px-5 py-3 bg-light/20 border-t border-accent-light/20 flex gap-3">
                                    {config.next && config.nextLabel ? (
                                        <button
                                            onClick={() =>
                                                cambiarEstado(pedido.id, config.next as 'aceptado' | 'preparando' | 'listo' | 'entregado')
                                            }
                                            className={`
                                                px-5 py-2 rounded-lg text-white font-medium text-sm transition-all duration-200 active:scale-95 shadow-sm
                                                ${config.next === 'aceptado' ? 'bg-sky-500 hover:bg-sky-600' : ''}
                                                ${config.next === 'preparando' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                                                ${config.next === 'listo' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                                                ${config.next === 'entregado' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                                            `}
                                        >
                                            {config.nextLabel}
                                        </button>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium text-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Completado
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
