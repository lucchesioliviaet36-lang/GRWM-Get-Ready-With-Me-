import React from 'react';
import './pagina_principal.css';

export default function Feed() {
  const historias = [
    { id: 1, usuario: 'Tu historia', img: 'https://i.pravatar.cc/150?img=11', esUsuario: true },
    { id: 2, usuario: 'clara.v', img: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, usuario: 'hugo_st', img: 'https://i.pravatar.cc/150?img=12' },
    { id: 4, usuario: 'sofia.art', img: 'https://i.pravatar.cc/150?img=9' },
    { id: 5, usuario: 'brian_m', img: 'https://i.pravatar.cc/150?img=13' },
    { id: 6, usuario: 'mora_closet', img: 'https://i.pravatar.cc/150?img=16' },
  ];

  const publicaciones = [
    {
      id: 1,
      usuario: 'clara.v',
      avatar: 'https://i.pravatar.cc/150?img=5',
      imagen: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800',
      precio: '€85',
      descripcion: 'Enamorada de este trench coat que conseguí en una tienda vintage de Berlín. Combina con todo ☕✨',
      likes: 340,
      comentarios: 42
    },
    {
      id: 2,
      usuario: 'hugo_st',
      avatar: 'https://i.pravatar.cc/150?img=12',
      imagen: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800',
      precio: null,
      descripcion: 'Paleta de grises y neutros para una tarde fresca en la ciudad. ¿Qué opinan de esta campera?',
      likes: 512,
      comentarios: 19
    }
  ];

  return (
    <div className="layout-container">
      {/* Sidebar Izquierdo */}
      <aside className="sidebar">
        <div className="card-box">
          <h3>Tendencias para ti</h3>
          <ul className="trends-list">
            <li><span>#OOTDMinimal</span> <small>1.2k posts</small></li>
            <li><span>#CottageCore</span> <small>1.2k posts</small></li>
            <li><span>#StreetwearSp</span> <small>1.2k posts</small></li>
            <li><span>#SecondHandFinds</span> <small>1.2k posts</small></li>
            <li><span>#Y2KRevival</span> <small>1.2k posts</small></li>
          </ul>
        </div>

        <div className="card-box">
          <h3>Sugerencias</h3>
          <ul className="suggestions-list">
            <li>
              <img src="https://i.pravatar.cc/150?img=32" alt="user" />
              <div>
                <strong>Lucía M.</strong>
                <small>@luciatrends</small>
              </div>
              <button className="btn-follow">Seguir</button>
            </li>
            <li>
              <img src="https://i.pravatar.cc/150?img=33" alt="user" />
              <div>
                <strong>Marcos V.</strong>
                <small>@marcos_fit</small>
              </div>
              <button className="btn-follow">Seguir</button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Feed Principal */}
      <main className="feed-content">
        {/* Historias */}
        <div className="stories-bar">
          {historias.map((item) => (
            <div key={item.id} className="story-item">
              <div className={`avatar-ring ${item.esUsuario ? 'user-story' : ''}`}>
                <img src={item.img} alt={item.usuario} />
              </div>
              <span>{item.usuario}</span>
            </div>
          ))}
        </div>

        {/* Grilla de Publicaciones */}
        <div className="posts-grid">
          {publicaciones.map((post) => (
            <article key={post.id} className="post-card">
              <div className="image-container">
                <img src={post.imagen} alt="Outfit" />
                {post.precio && <span className="price-tag">{post.precio}</span>}
              </div>
              
              <div className="post-header">
                <img src={post.avatar} alt={post.usuario} className="user-avatar" />
                <strong>{post.usuario}</strong>
              </div>

              <p className="post-description">{post.descripcion}</p>

              <div className="post-footer">
                <div className="stats">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comentarios}</span>
                </div>
                <button className="btn-save">🔖</button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}