import { router } from '@inertiajs/react';
import { useState } from 'react';

interface DetallePedido {
    id: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    producto: { id: number; nombre: string; precio: number };
}

interface PedidoEntregado {
    id: number;
    codigo_pedido: number;
    nombre_cliente: string;
    total: number;
    created_at: string;
    detalles: DetallePedido[];
}

interface Periodo {
    from: string;
    to: string;
    ingresos: number;
    gastos: number;
    costo_ventas: number;
    ganancia_bruta: number;
    ganancia_neta: number;
}

interface Props {
    periodo: Periodo;
    pedidos: PedidoEntregado[];
}

export default function ReportesIndex({ periodo, pedidos }: Props) {
    const [from, setFrom] = useState(periodo.from);
    const [to, setTo] = useState(periodo.to);

    function filtrar() {
        router.get('/reportes', { from, to });
    }

    const netaPositiva = periodo.ganancia_neta >= 0;

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            <h1 className="text-2xl font-bold text-dark mb-6">Reportes</h1>

            <div className="bg-white rounded-xl shadow-sm border border-accent-light/30 p-5 mb-6">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Desde</label>
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="rounded-lg border border-accent-light/50 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Hasta</label>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="rounded-lg border border-accent-light/50 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                    <button
                        onClick={filtrar}
                        className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
                    >
                        Filtrar
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-accent-light/30 p-5 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <span className="text-muted text-xs">Ingresos</span>
                        <p className="text-xl font-bold text-emerald-600">Bs. {Number(periodo.ingresos).toFixed(2)}</p>
                    </div>
                    <div>
                        <span className="text-muted text-xs">Gastos</span>
                        <p className="text-xl font-bold text-red-500">Bs. {Number(periodo.gastos).toFixed(2)}</p>
                    </div>
                    <div>
                        <span className="text-muted text-xs">Costo de Ventas</span>
                        <p className="text-xl font-bold text-amber-600">Bs. {Number(periodo.costo_ventas).toFixed(2)}</p>
                    </div>
                    <div>
                        <span className="text-muted text-xs">Ganancia Neta</span>
                        <p className={`text-xl font-bold ${netaPositiva ? 'text-emerald-600' : 'text-red-500'}`}>
                            {netaPositiva ? '+' : '-'}Bs. {Math.abs(Number(periodo.ganancia_neta)).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl shadow-sm border border-accent-light/30">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="text-left px-4 py-3 font-semibold">Código</th>
                            <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                            <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Productos</th>
                            <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                            <th className="text-right px-4 py-3 font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                                    No hay pedidos entregados en este periodo
                                </td>
                            </tr>
                        ) : (
                            pedidos.map((pedido, index) => (
                                <tr
                                    key={pedido.id}
                                    className={`border-t border-accent-light/20 transition-colors hover:bg-light/40 ${index % 2 === 0 ? 'bg-white' : 'bg-light/20'}`}
                                >
                                    <td className="px-4 py-3 font-medium text-dark">{pedido.codigo_pedido}</td>
                                    <td className="px-4 py-3 text-muted">{pedido.nombre_cliente}</td>
                                    <td className="px-4 py-3 text-muted hidden sm:table-cell">
                                        {pedido.detalles.map((d) => `${d.cantidad}x ${d.producto.nombre}`).join(', ')}
                                    </td>
                                    <td className="px-4 py-3 text-muted text-xs">
                                        {new Date(pedido.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-dark">
                                        Bs. {Number(pedido.total).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
