import React from 'react';
import { NavBar } from '../Components/NavBar';
import { Footer } from '../Components/Footer';
import { Contact } from '../Components/Contact';

function Privacy() {
    return (
        <div>
            <NavBar />
            <Contact />
            <div className="privacy-main">
                <h1 className="text-center text-remesa">Política de Privacidad</h1>
                <p>Tu privacidad es importante para mí. En esta declaración de privacidad te explico qué datos personales recopilo de mis usuarios y cómo los utilizo. Te animo a leer detenidamente esta política antes de facilitar tus datos personales en esta web https://remesaespana.com.</p>

                <h3>Principios de Privacidad</h3>
                <p>En esta web se respeta y cuida los datos personales de los usuarios. Como usuario, debes saber que tus derechos están garantizados. Me esfuerzo por crear un espacio seguro y confiable. Estos son mis principios respecto a tu privacidad:</p>
                <ul>
                    <li>Nunca solicito información personal a menos que realmente sea necesaria para prestarte los servicios que requieras.</li>
                    <li>Nunca comparto información personal de mis usuarios con nadie, excepto para cumplir con la ley o en caso de tu autorización expresa.</li>
                    <li>Nunca utilizo tus datos personales con una finalidad diferente a la expresada en esta política de privacidad.</li>
                </ul>

                <h3>¿Cómo he obtenido tus datos?</h3>
                <p>Los datos personales que trato en remesaespana.com provienen de:</p>
                <ul>
                    <li>Formulario de contacto</li>
                    <li>Email</li>
                    <li>Dirección</li>
                    <li>Video identificación</li>
                </ul>

                <h3>¿Cuáles son tus derechos?</h3>
                <p>Las personas interesadas tienen derecho a:</p>
                <ul>
                    <li>Solicitar acceso a sus datos personales</li>
                    <li>Solicitar la rectificación o supresión</li>
                    <li>Solicitar la limitación de su tratamiento</li>
                    <li>Oponerse al tratamiento</li>
                    <li>Solicitar la portabilidad de los datos</li>
                </ul>

                <h3>Finalidades del Tratamiento de Datos</h3>
                <p>Los datos personales que recopilo tienen las siguientes finalidades:</p>
                <ul>
                    <li>Responder a consultas a través del formulario de contacto</li>
                    <li>Gestionar las solicitudes de servicios</li>
                    <li>Garantizar el cumplimiento de la ley y condiciones de uso</li>
                    <li>Mejorar los servicios ofrecidos en esta web</li>
                    <li>Gestionar la presencia en redes sociales</li>
                </ul>

                <h3>Legitimación para el Tratamiento de Datos</h3>
                <p>La base legal para el tratamiento de tus datos es el consentimiento que me has otorgado al aceptar esta política de privacidad y al proporcionarme tu información personal.</p>

                <h3>Duración de Conservación de los Datos</h3>
                <p>Los datos personales proporcionados se conservarán hasta que se solicite su supresión por parte del interesado o durante el tiempo que estipule la ley.</p>

                <h3>Destinatarios de los Datos</h3>
                <p>Comparto tus datos con los siguientes proveedores:</p>
                <ul>
                    <li>Hosting: Hostinger (UE)</li>
                    <li>Validación KYC: AmlBot (UE)</li>
                </ul>

                <h3>Secreto y Seguridad de los Datos</h3>
                <p>remesaespana.com se compromete al uso responsable y seguro de los datos personales, adoptando todas las medidas necesarias para evitar su acceso no autorizado o uso indebido.</p>

                <h3>Cambios en la Política de Privacidad</h3>
                <p>Me reservo el derecho a modificar esta política de privacidad para adaptarla a novedades legislativas. Cualquier cambio será anunciado en esta página antes de su implementación.</p>

                <h3>Correos Comerciales</h3>
                <p>De acuerdo con la LSSICE, no realizo prácticas de SPAM y no envío correos electrónicos sin tu consentimiento previo.</p>
            </div>

            <Footer />
        </div>
    );
}

export { Privacy };
