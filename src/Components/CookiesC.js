import React, { useEffect } from 'react';
import Cookies from '../Assets/Images/cookie.svg'
import { Link } from 'react-router-dom'


function CookiesC() {
  useEffect(() => {
    const botonAceptarCookies = document.getElementById('btn-aceptar-cookies');
    const avisoCookies = document.getElementById('aviso-cookies');
    const fondoAvisoCookies = document.getElementById('fondo-aviso-cookies');
    const dataLayer = window.dataLayer || [];

    if (!localStorage.getItem('cookies-aceptadas')) {
      avisoCookies.classList.add('activo');
      fondoAvisoCookies.classList.add('activo');
    } else {
      dataLayer.push({ event: 'cookies-aceptadas' });
    }

    botonAceptarCookies.addEventListener('click', () => {
      avisoCookies.classList.remove('activo');
      fondoAvisoCookies.classList.remove('activo');

      localStorage.setItem('cookies-aceptadas', true);

      dataLayer.push({ event: 'cookies-aceptadas' });
    });
  }, []);

  return (
    <div className='CookiesBody'>
      {/* Inicio del contenido de aviso de cookies */}
      <div className="aviso-cookies" id="aviso-cookies">
      <img src={Cookies}
          rel="noreferrer"
          alt='cookie'
          className='galleta'
        />
        <h3 className="titulo">Cookies</h3>
        <p className="parrafo">Utilizamos cookies propias y de terceros para mejorar nuestros servicios.</p>
        <button className="boton" id="btn-aceptar-cookies">De acuerdo</button>
        <Link className="enlace" to='/Cookies'>Aviso de Cookies</Link>
      </div>
      <div className="fondo-aviso-cookies" id="fondo-aviso-cookies"></div>
    </div>
  );
}

export { CookiesC };
