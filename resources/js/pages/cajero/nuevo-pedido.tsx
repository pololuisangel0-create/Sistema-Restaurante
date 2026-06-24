import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    categoria: string | null;
    stock: { cantidad_disponible: number; cantidad_min: number } | null;
}

interface Props {
    productos: Producto[];
    restaurante_id: number;
}

interface ItemCarrito {
    producto_id: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
}

export default function NuevoPedido({ productos, restaurante_id }: Props) {
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [nombreCliente, setNombreCliente] = useState('');
    const [cantidades, setCantidades] = useState<Record<number, number>>({});
    const [creando, setCreando] = useState(false);

    function getCantidad(productoId: number): number {
        return cantidades[productoId] || 1;
    }

    function incrementar(productoId: number, stockDisponible: number) {
        setCantidades(prev => {
            const actual = prev[productoId] || 1;
            if (actual >= stockDisponible) return prev;
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

        const existente = carrito.findIndex(i => i.producto_id === producto.id);
        if (existente >= 0) {
            const nuevo = [...carrito];
            nuevo[existente] = {
                ...nuevo[existente],
                cantidad: nuevo[existente].cantidad + cantidad,
            };
            setCarrito(nuevo);
        } else {
            setCarrito([...carrito, {
                producto_id: producto.id,
                nombre: producto.nombre,
                cantidad,
                precio_unitario: producto.precio,
            }]);
        }

        setCantidades(prev => ({ ...prev, [producto.id]: 1 }));
    }

    function removerDelCarrito(index: number) {
        setCarrito(carrito.filter((_, i) => i !== index));
    }

    function confirmarPedido() {
        if (carrito.length === 0 || !nombreCliente.trim()) return;

        setCreando(true);
        router.post('/cajero/pedidos', {
            nombre_cliente: nombreCliente,
            items: carrito.map(i => ({
                producto_id: i.producto_id,
                cantidad: i.cantidad,
                precio_unitario: i.precio_unitario,
            })),
        }, {
            onSuccess: () => {
                setCarrito([]);
                setNombreCliente('');
                setCreando(false);
            },
            onError: () => setCreando(false),
        });
    }

    const total = carrito.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark">Registrar Pedido</h1>
                <a
                    href="/cajero/pedidos/lista"
                    className="text-sm text-muted hover:text-dark transition-colors"
                >
                    Gestionar pedidos →
                </a>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <div className="overflow-x-auto rounded-xl shadow-sm border border-accent-light/30">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="text-left px-4 py-3 font-semibold">Producto</th>
                                    <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Categoría</th>
                                    <th className="text-left px-4 py-3 font-semibold">Precio</th>
                                    <th className="text-center px-4 py-3 font-semibold">Disponible</th>
                                    <th className="text-center px-4 py-3 font-semibold">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted">
                                            No hay productos disponibles
                                        </td>
                                    </tr>
                                ) : (
                                    productos.map((producto, index) => {
                                        const stock = producto.stock?.cantidad_disponible ?? 0;
                                        const min = producto.stock?.cantidad_min ?? 0;
                                        const disponible = stock > 0;
                                        const bajoStock = disponible && stock <= min;
                                        return (
                                            <tr
                                                key={producto.id}
                                                className={`border-t border-accent-light/20 transition-colors hover:bg-light/40 ${index % 2 === 0 ? 'bg-white' : 'bg-light/20'} ${!disponible ? 'opacity-60' : ''}`}
                                            >
                                                <td className="px-4 py-3 font-medium text-dark">{producto.nombre}</td>
                                                <td className="px-4 py-3 text-muted hidden md:table-cell">
                                                    {producto.categoria ? (
                                                        <span className="bg-accent-light/30 text-secondary px-2 py-0.5 rounded-full text-xs font-medium">
                                                            {producto.categoria}
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-dark">
                                                    Bs. {Number(producto.precio).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className={`inline-flex items-center justify-center min-w-[1.5rem] px-1.5 py-0.5 rounded-full text-xs font-bold ${
                                                            !disponible
                                                                ? 'bg-red-100 text-red-600'
                                                                : bajoStock
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-green-100 text-green-700'
                                                        }`}>
                                                            {stock}
                                                        </span>
                                                        {disponible ? (
                                                            <span className={`text-xs font-medium ${bajoStock ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                                {bajoStock ? 'Stock Bajo' : 'Disponible'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-medium text-red-500">Agotado</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {disponible ? (
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => decrementar(producto.id)}
                                                                disabled={getCantidad(producto.id) <= 1}
                                                                className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-40"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-bold text-dark">
                                                                {getCantidad(producto.id)}
                                                            </span>
                                                            <button
                                                                onClick={() => incrementar(producto.id, stock)}
                                                                disabled={getCantidad(producto.id) >= stock}
                                                                className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors disabled:opacity-40"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-light text-xs">—</span>
                                                    )}
                                                    {disponible && (
                                                        <button
                                                            onClick={() => agregarAlCarrito(producto)}
                                                            className="bg-primary hover:bg-primary-hover text-white px-2.5 py-1 rounded text-xs font-medium transition-all active:scale-95 ml-2"
                                                        >
                                                            Agregar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="w-full lg:w-80 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-accent-light/30 p-5 sticky top-6">
                        <h3 className="text-lg font-bold text-dark mb-4">
                            Pedido ({carrito.length})
                        </h3>

                        {carrito.length === 0 ? (
                            <div className="py-8 text-center text-muted text-sm">
                                Carrito vacío
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                    {carrito.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 pb-3 border-b border-accent-light/30 last:border-0">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-dark text-sm truncate">{item.nombre}</p>
                                                <p className="text-muted text-xs mt-0.5">
                                                    {item.cantidad} x Bs. {Number(item.precio_unitario).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="font-semibold text-dark text-sm">
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

                                <div className="mt-4 pt-4 border-t-2 border-primary">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-dark">Total</span>
                                        <span className="text-xl font-bold text-primary">Bs. {total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre del cliente"
                                        value={nombreCliente}
                                        onChange={(e) => setNombreCliente(e.target.value)}
                                        className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all mb-3"
                                    />
                                    <button
                                        onClick={confirmarPedido}
                                        disabled={creando || carrito.length === 0 || !nombreCliente.trim()}
                                        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]"
                                    >
                                        {creando ? 'Creando...' : 'Confirmar Pedido'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}