import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/PedidoController';
import { restaurantes } from '@/actions/App/Http/Controllers/MenuController';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    categoria: string | null;
    stock: {
        cantidad_disponible: number;
    } | null;
}

interface Restaurante {
    id: number;
    nombre: string;
}

interface Props {
    restaurante: Restaurante;
    productos: Producto[];
}

interface ItemCarrito {
    producto_id: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
}

export default function MenuShow({ restaurante, productos }: Props) {
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [nombreCliente, setNombreCliente] = useState('');
    const [cantidades, setCantidades] = useState<Record<number, number>>({});
    const { flash } = usePage<any>().props;
    const { processing } = useForm({
        nombre_cliente: '',
        restaurante_id: restaurante.id,
        items: [] as Array<{ producto_id: number; cantidad: number; precio_unitario: number }>,
    });

    function getCantidad(productoId: number): number {
        return cantidades[productoId] || 1;
    }

    function incrementar(productoId: number, max: number) {
        setCantidades(prev => {
            const actual = prev[productoId] || 1;
            if (actual >= max) return prev;
            return { ...prev, [productoId]: actual + 1 };
        });
    }

    function decrementar(productoId: number) {
        setCantidades(prev => {
            const actual = prev[productoId] || 1;
            if (actual <= 1) return prev;
            return { ...prev, [productoId]: actual - 1 };
        });
    }

    function agregarAlCarrito(producto: Producto) {
        const cantidad = getCantidad(producto.id);

        setCarrito([...carrito, {
            producto_id: producto.id,
            nombre: producto.nombre,
            cantidad,
            precio_unitario: producto.precio,
        }]);

        setCantidades(prev => ({ ...prev, [producto.id]: 1 }));
    }

    function removerDelCarrito(index: number) {
        setCarrito(carrito.filter((_, i) => i !== index));
    }

    function confirmarPedido() {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        if (!nombreCliente.trim()) {
            alert('Debes escribir tu nombre');
            return;
        }

        const itemsData = carrito.map((item) => ({
            producto_id: item.producto_id,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
        }));

        fetch(store().url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({
                nombre_cliente: nombreCliente,
                restaurante_id: restaurante.id,
                items: itemsData,
            }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.codigo_pedido) {
                alert(`¡Pedido confirmado!\n\nTu código: ${data.codigo_pedido}\n\nTotal: Bs. ${data.total}`);
                setCarrito([]);
                setNombreCliente('');
            }
        })
        .catch(() => alert('Error al confirmar el pedido'));
    }

    const categorias = [...new Set(productos.map(p => (p.categoria?.trim() || '__sin_categoria__')))].sort();
    const productosPorCategoria: Record<string, Producto[]> = {};
    for (const cat of categorias) {
        productosPorCategoria[cat] = productos.filter(p => (p.categoria?.trim() || '__sin_categoria__') === cat);
    }
    const etiquetaCategoria = (cat: string) => cat === '__sin_categoria__' ? 'Sin categoría' : cat;

    const total = carrito.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gradient-to-br from-[#57394c] to-[#330404] px-6 py-10 md:py-14">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <a
                        href={restaurantes().url}
                        className="text-[#c6acab] hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </a>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">{restaurante.nombre}</h1>
                        <p className="text-[#c6acab] text-sm mt-0.5">Menú disponible</p>
                    </div>
                </div>
            </div>

            {flash?.success && (
                <div className="max-w-6xl mx-auto px-6 mt-6">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl text-sm flex items-center gap-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {flash.success}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-8">
                        {categorias.map(cat => (
                            <div key={cat}>
                                <h3 className="text-lg font-bold text-[#330404] mb-3 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#57394c] rounded-full inline-block" />
                                    {etiquetaCategoria(cat)}
                                </h3>
                                <div className="overflow-x-auto rounded-xl shadow-sm border border-[#d6cdcd]/50">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-[#57394c] text-white">
                                                <th className="text-left px-4 py-3 font-semibold">Producto</th>
                                                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Descripción</th>
                                                <th className="text-left px-4 py-3 font-semibold">Precio</th>
                                                <th className="text-center px-4 py-3 font-semibold">Disp.</th>
                                                <th className="text-center px-4 py-3 font-semibold">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productosPorCategoria[cat].map((producto, index) => {
                                                const disponible = producto.stock && producto.stock.cantidad_disponible > 0;
                                                const stock = producto.stock?.cantidad_disponible ?? 0;
                                                return (
                                                    <tr
                                                        key={producto.id}
                                                        className={`border-t border-[#d6cdcd]/20 transition-colors hover:bg-[#f5efef] ${index % 2 === 0 ? 'bg-white' : 'bg-[#f5efef]/30'} ${!disponible ? 'opacity-60' : ''}`}
                                                    >
                                                        <td className="px-4 py-3 font-medium text-[#330404]">{producto.nombre}</td>
                                                        <td className="px-4 py-3 text-[#856868] hidden md:table-cell">{producto.descripcion ?? '-'}</td>
                                                        <td className="px-4 py-3 font-semibold text-[#330404]">Bs. {Number(producto.precio).toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            {disponible ? (
                                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                                                    Disponible
                                                                </span>
                                                            ) : (
                                                                <span className="text-[#ad9b9b] text-xs font-medium">Agotado</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {disponible ? (
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <button
                                                                        onClick={() => decrementar(producto.id)}
                                                                        disabled={getCantidad(producto.id) <= 1}
                                                                        className="w-7 h-7 flex items-center justify-center rounded-md bg-[#57394c] text-white text-sm font-bold hover:bg-[#63444a] transition-colors active:scale-90 disabled:opacity-40"
                                                                    >
                                                                        −
                                                                    </button>
                                                                    <span className="w-8 text-center text-sm font-bold text-[#330404]">
                                                                        {getCantidad(producto.id)}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => incrementar(producto.id, stock)}
                                                                        disabled={getCantidad(producto.id) >= stock}
                                                                        className="w-7 h-7 flex items-center justify-center rounded-md bg-[#57394c] text-white text-sm font-bold hover:bg-[#63444a] transition-colors active:scale-90 disabled:opacity-40"
                                                                    >
                                                                        +
                                                                    </button>
                                                                    <button
                                                                        onClick={() => agregarAlCarrito(producto)}
                                                                        className="bg-[#57394c] hover:bg-[#63444a] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ml-1"
                                                                    >
                                                                        Agregar
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[#ad9b9b] text-xs">—</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-[#d6cdcd]/50 p-5 sticky top-6">
                            <h3 className="text-lg font-bold text-[#330404] flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-[#57394c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                </svg>
                                Tu Carrito
                            </h3>

                            {carrito.length === 0 ? (
                                <div className="py-8 text-center">
                                    <svg className="w-12 h-12 mx-auto text-[#d6cdcd] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-[#ad9b9b] text-sm">Carrito vacío</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                        {carrito.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-[#d6cdcd]/30 last:border-0">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-[#330404] text-sm truncate">{item.nombre}</p>
                                                    <p className="text-[#856868] text-xs mt-0.5">
                                                        {item.cantidad} x Bs. {Number(item.precio_unitario).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="font-semibold text-[#330404] text-sm">
                                                        Bs. {(item.cantidad * item.precio_unitario).toFixed(2)}
                                                    </p>
                                                    <button
                                                        onClick={() => removerDelCarrito(idx)}
                                                        className="text-red-400 hover:text-red-600 text-xs mt-0.5 transition-colors"
                                                    >
                                                        Quitar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-4 border-t-2 border-[#57394c]">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-[#330404]">Total</span>
                                            <span className="text-xl font-bold text-[#57394c]">Bs. {total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            value={nombreCliente}
                                            onChange={(e) => setNombreCliente(e.target.value)}
                                            className="w-full rounded-lg border border-[#d6cdcd] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#57394c]/30 focus:border-[#57394c] transition-all mb-3"
                                        />
                                        <button
                                            onClick={confirmarPedido}
                                            disabled={processing}
                                            className="w-full bg-[#57394c] hover:bg-[#63444a] text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]"
                                        >
                                            Confirmar Pedido
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
