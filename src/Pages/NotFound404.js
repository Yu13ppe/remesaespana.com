import React from 'react';
import { Link } from 'react-router-dom';

function NotFound404() {
  return (
    <div className='page_404'>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='col-sm-12 col-sm-offset-1 textcenter'>
              <h1 className='text-center'>404</h1>
              <div className='content_box_404'>
                <h3 className='h2 text-center'>Parece que te has perdido</h3>
                <p className='text-center'>
                  La pagina que deseas visitar no esta disponible
                </p>
                <div className='four_zero_four_bg'>
                  <Link className='Linkss' to='/home'>Regresa al Inicio </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NotFound404 };

