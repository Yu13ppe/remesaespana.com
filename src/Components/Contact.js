import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

function Contact() {
  return (
    <div className='ContactBody'>
    <a
      href='https://wa.me/+34722850962'
      className="btn-wsp"
      target="_blank"
      rel="noreferrer"
    >
      <FaWhatsapp className="icono" />
    </a>
    </div>  );
}

export { Contact };
