import { useEffect, useState } from 'react';
import './modal_seguimiento.css';

const API_URL = "http://localhost:3000";

function ModalSeguimiento({
    idUsuario,
    pestanaInicial = 'seguidores',
    onCerrar,
    onSeleccionarUsuario
}) {
    const [pestanaActiva, setPestanaActiva] = useState(pestanaInicial);
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                setCargando(true);
                setError('');

                const respuesta = await fetch(
                    `${API_URL}/api/usuarios/${idUsuario}/${pestanaActiva}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje || 'No se pudo cargar la lista.');
                }

                setUsuarios(datos.usuarios || []);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                setError('No se pudo cargar la lista de usuarios.');
                setUsuarios([]);
            } finally {
                setCargando(false);
            }
        };

        if (idUsuario) {
            obtenerUsuarios();
        }
    }, [idUsuario, pestanaActiva, token]);

    const obtenerImagen = (imagen) => {
        if (!imagen) return null;

        if (
            imagen.startsWith('http') ||
            imagen.startsWith('blob:') ||
            imagen.startsWith('data:')
        ) {
            return imagen;
        }

        return `${API_URL}${imagen.startsWith('/') ? '' : '/'}${imagen}`;
    };

    const cambiarPestana = (pestana) => {
        setPestanaActiva(pestana);
    };

    return (
        <div className="modal-seguimiento-fondo" onClick={onCerrar}>
            <div
                className="modal-seguimiento"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="modal-seguimiento-cerrar"
                    onClick={onCerrar}
                    type="button"
                >
                    ×
                </button>

                <div className="modal-seguimiento-pestanas">
                    <button
                        type="button"
                        className={pestanaActiva === 'seguidores' ? 'activa' : ''}
                        onClick={() => cambiarPestana('seguidores')}
                    >
                        Seguidores
                    </button>

                    <button
                        type="button"
                        className={pestanaActiva === 'seguidos' ? 'activa' : ''}
                        onClick={() => cambiarPestana('seguidos')}
                    >
                        Siguiendo
                    </button>
                </div>

                <div className="modal-seguimiento-lista">
                    {cargando ? (
                        <p className="modal-seguimiento-mensaje">
                            Cargando usuarios...
                        </p>
                    ) : error ? (
                        <p className="modal-seguimiento-mensaje">
                            {error}
                        </p>
                    ) : usuarios.length === 0 ? (
                        <p className="modal-seguimiento-mensaje">
                            {pestanaActiva === 'seguidores'
                                ? 'Todavía no tiene seguidores.'
                                : 'Todavía no sigue a nadie.'}
                        </p>
                    ) : (
                        usuarios.map((usuario) => (
                            <button
                                type="button"
                                className="modal-seguimiento-usuario"
                                key={usuario.id_usuario}
                                onClick={() => onSeleccionarUsuario(usuario.id_usuario)}
                            >
                                {usuario.foto_perfil ? (
                                    <img
                                        src={obtenerImagen(usuario.foto_perfil)}
                                        alt=""
                                    />
                                ) : (
                                    <div className="modal-seguimiento-avatar">
                                        {usuario.nombre?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}

                                <div className="modal-seguimiento-datos">
                                    <strong>
                                        {[usuario.nombre, usuario.apellido]
                                            .filter(Boolean)
                                            .join(' ') || usuario.username}
                                    </strong>

                                    <span>@{usuario.username}</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModalSeguimiento;