import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './busqueda.css'
import Header from "../../componentes/header/header";
import Footer from "../../componentes/footer/footer";
import Usuario1 from "../../assets/imagenes/olivia.jpg";
import Usuario2 from "../../assets/imagenes/baddbunny.jpg";
import Usuario3 from "../../assets/imagenes/sabrina.jpg";

const Busqueda = () => {

  const navigate = useNavigate();

  // Datos basados en la imagen de referencia
  const tendencias = [
    { tag: "#OOTDMinimal", posts: "1.2k posts" },
    { tag: "#CottageCore", posts: "1.2k posts" },
    { tag: "#StreetwearSp", posts: "1.2k posts" },
    { tag: "#SecondHandFinds", posts: "1.2k posts" },
    { tag: "#Y2KRevival", posts: "1.2k posts" },
  ];

  const sugerencias = [
    { nombre: "Olivia Privv", username: "@notOlivia", avatar: Usuario1 },
    { nombre: "Benito", username: "@bad.bunny", avatar: Usuario2},
    { nombre: "Sabrina Carpintero", username: "@sabrinaC", avatar:Usuario3 },
  ];


  return (
    <div className="busqueda-page">
      
      <Header />

      <div className="busqueda-container">
        {/* PANEL IZQUIERDO: TENDENCIAS Y SUGERENCIAS */}
        <aside className="busqueda-sidebar">
          <section className="seccion-tendencias">
            <h3>Tendencias para ti</h3>
            <div className="lista-tendencias">
              {tendencias.map((item, index) => (
                <div key={index} className="tendencia-item">
                  <span className="tendencia-tag">{item.tag}</span>
                  <span className="tendencia-posts">{item.posts}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="seccion-sugerencias">
            <h3>Sugerencias</h3>
            <div className="lista-sugerencias">
              {sugerencias.map((user, index) => (
                <div key={index} className="sugerencia-item">
                  <img src={user.avatar} alt={user.nombre} />
                  <div className="user-meta">
                    <h4>{user.nombre}</h4>
                    <span>{user.username}</span>
                  </div>
                  <button className="btn-seguir">Seguir</button>
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* ÁREA PRINCIPAL: BARRA DE BÚSQUEDA */}
        <main className="busqueda-main">
          <div className="search-bar-wrapper">
            <span className="search-icon">🔍︎</span>
            <input 
              type="text" 
              placeholder="Buscar outfits, marcas, tendencias..." 
              className="input-busqueda-principal"
            />
          </div>
          
          {/* Aquí aparecerían los resultados de búsqueda */}
          <div className="busqueda-resultados-vacio">
            <p>Explora lo último en la comunidad GRWM ✧</p>
          </div>
        </main>
      </div>

      <Footer/>          

    </div>
  );
};

export default Busqueda;