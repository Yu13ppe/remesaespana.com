import React, { useState } from 'react';
import { Label } from 'reactstrap';
import { NavBar } from '../Components/NavBar';
import { Footer } from '../Components/Footer';
import { Contact } from '../Components/Contact';

function Faqs() {
  const [activeTabs, setActiveTabs] = useState([]);

  const handleTabClick = (index) => {
    if (activeTabs.includes(index)) {
      setActiveTabs(activeTabs.filter((tabIndex) => tabIndex !== index));
    } else {
      setActiveTabs([...activeTabs, index]);
    }
  };

  const faqData = [
    {
      question: '¿Qué bancos tienen para enviar a Venezuela?',
      answer: 'Tenemos disponibles cuentas en las siguientes entidades bancarias...',
      banks: ['Mercantil', 'Venezuela', 'Banesco', 'Provincial', 'Banco Nacional de crédito', 'Pago Movil'],
    },
    {
      question: '¿Entregan dólares en efectivo en Venezuela?',
      answer: 'Sí, entregamos en todo el territorio nacional. El mínimo necesario para entregar dólares en efectivo es de 100$ (cien dólares), consulta el porcentaje por tu estado.',
    },
    {
      question: '¿Reciben transferencias desde toda la Unión Europea?',
      answer: 'Sí. El pago se realiza cuando el monto enviado se hace efectivo en nuestra cuenta y según la tasa de dicho día.',
    },
    {
      question: '¿Reciben depósitos de cajeros?',
      answer: 'No. Disculpe las molestias, pero no recibimos depósitos en efectivo a través de cajeros.',
    },
    {
      question: '¿Cuantos minutos demora la transferencia a Venezuela?',
      answer: 'Nuestro tiempo de pago es de unos 20 minutos.',
    },
  ];

  return (
    <div>
      <NavBar />
      <Contact />
      <div className='BodyFaqs'>
        <div className='container-faqs'>
          {faqData.map((faq, index) => (
            <div className='Tab' key={index}>
              <input
                type="checkbox"
                name="acc"
                id={`acc${index + 1}`}
                checked={activeTabs.includes(index)}
                onChange={() => handleTabClick(index)}
              />
              <Label htmlFor={`acc${index + 1}`}>
                <h2>{index + 1}</h2>
                <h3>{faq.question}</h3>
              </Label>
              <div className={`content-faqs ${activeTabs.includes(index) ? 'open' : ''}`}>
                <p>{faq.answer}</p>
                {faq.banks && (
                  <ul>
                    {faq.banks.map((bank, bankIndex) => (
                      <li key={bankIndex}>{bank}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export { Faqs };