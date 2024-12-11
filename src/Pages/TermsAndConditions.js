import React from 'react';
import { NavBar } from '../Components/NavBar';
import { Footer } from '../Components/Footer';
import { Contact } from '../Components/Contact';

function TermsAndConditions() {
	return (
		<div>
			<NavBar />
			<Contact />
			<main className="cookies-main">
				<h1 className="text-center text-remesa">Términos y Condiciones de Uso</h1>
				<h5>Fecha de entrada en vigencia: 28-09-2024</h5>

				<p>Por favor, lee atentamente estos términos y condiciones antes de utilizar el sitio web de RemesaEspana. Al registrarte y utilizar nuestros servicios, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con estos términos, te rogamos que no utilices nuestro sitio web ni nuestros servicios.</p>

				<h3>1. Registro</h3>
				<p>Para utilizar nuestros servicios, debes registrarte en nuestra plataforma <a href="https://remesaespana.com/">https://remesaespana.com/</a>, proporcionando tu nombre, apellido, número de teléfono, correo electrónico, dirección, y establecer una contraseña personal. Asegúrate de mantener tu información de registro actualizada en todo momento.</p>
				<p>Una vez registrado, procedemos a realizar un KYC (Conozca a su Cliente) con una herramienta que nos permite comprobar los datos de nuestros clientes protegiéndolos de la usurpación de identidad, validándolos con un documento de identidad vigente y video identificación facial.</p>
				<p>Una vez validada la información proporcionada, se activará tu usuario para que puedas disfrutar de todos los servicios que ofrece RemesaEspana.</p>
				<p>En caso de incongruencia en la información proporcionada, se podrá solicitar documentación adicional e incluso bloquear el perfil del Usuario.</p>
				<p>Eres responsable de mantener la confidencialidad de tu información de inicio de sesión y de todas las actividades que ocurran bajo tu cuenta. Si sospechas que tu cuenta ha sido comprometida, notifícanos de inmediato.</p>

				<h3>2. Cuenta de Usuario</h3>
				<p>Una vez registrado, el Usuario tendrá acceso a su cuenta de usuario que le permite almacenar todas las operaciones por fecha, moneda y nombre del beneficiario, así como guardar los datos de las cuentas bancarias en directorios para facilitar las operaciones, brindando más rapidez al enviar dinero.</p>
				<p>A través de la cuenta de usuario, el Usuario podrá consultar todos los datos de las operaciones realizadas y el estado en que se encuentra el envío, además de recibir notificaciones por email cuando se ha realizado un envío, así como comunicaciones referentes a la operativa o posibles incidencias.</p>

				<h3>3. Servicios de Cambio de Divisas</h3>
				<p><a href="https://remesaespana.com">https://remesaespana.com</a> proporciona servicios de cambio de divisas en euros. Los tipos de cambio y las tarifas aplicables se mostrarán en nuestro sitio web y podrán estar sujetos a cambios sin previo aviso.</p>
				<p>Al utilizar nuestros servicios, aceptas los tipos de cambio y las tarifas aplicables en el momento de la transacción.</p>
				<p>Te comprometes a proporcionar información precisa y veraz relacionada con las transacciones de cambio de divisas que realices a través de nuestro sitio web.</p>

				<h3>4. Uso Adecuado</h3>
				<p>Aceptas utilizar nuestro sitio web <a href="https://remesaespana.com">https://remesaespana.com</a> y servicios de manera legal y ética. No debes utilizar nuestros servicios para actividades ilegales o fraudulentas.</p>
				<p>No está permitido utilizar nuestro sitio web para distribuir contenido dañino, difamatorio, obsceno o cualquier otro material que sea inapropiado.</p>

				<h3>5. Responsabilidad y Exoneración de Responsabilidad</h3>
				<p>RemesaEspana no se hace responsable de los daños, pérdidas o perjuicios que puedan surgir como resultado del uso de nuestros servicios o de la información proporcionada en nuestro sitio web <a href="https://remesaespana.com">https://remesaespana.com</a>.</p>
				<p>No garantizamos la disponibilidad continua y sin interrupciones de nuestros servicios y nos reservamos el derecho de suspenderlos o interrumpirlos en cualquier momento sin previo aviso.</p>

				<h3>6. Privacidad</h3>
				<p>La recopilación y el uso de tus datos personales están sujetos a nuestra Política de Privacidad, que puedes consultar en nuestro sitio web <a href="https://remesaespana.com/Privacy">https://remesaespana.com/Privacy</a>. Es de suma importancia leerlas detenidamente y, si no estás de acuerdo, por favor no aceptes estos términos y condiciones, ya que no podremos prestarte el servicio.</p>

				<h3>7. Modificaciones de los Términos y Condiciones</h3>
				<p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente después de su publicación en nuestro sitio web <a href="https://remesaespana.com">https://remesaespana.com</a>.</p>

				<h3>8. Ley Aplicable</h3>
				<p>Estos términos y condiciones se rigen por las leyes de la Unión Europea y España. Cualquier disputa que surja en relación con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes en España.</p>

				<h3>9. Prevención del Blanqueo de Capitales y la Financiación del Terrorismo</h3>
				<p>Cuando el Usuario se registre en la Plataforma <a href="https://remesaespana.com">https://remesaespana.com</a> y posteriormente realice una operación, se solicitarán los documentos necesarios para la gestión del servicio de envío de dinero, así como la información y documentación personal necesaria para la correcta identificación y conocimiento del usuario. Esto incluye medidas de diligencia debida como: identificación formal, titularidad real, dirección, ocupación, origen de fondos, etc.</p>
				<p>Si se tuviera conocimiento de algún hecho u operación susceptible de estar relacionada con el blanqueo de capitales o con la financiación del terrorismo, se comunicará dicho hecho u operación a las autoridades competentes.</p>
				<p>RemesaEspana conservará la documentación de los clientes durante los plazos estipulados por la normativa de prevención del blanqueo de capitales y la financiación del terrorismo.</p>

				<h6>Gracias por elegir RemesaEspana. Si tienes alguna pregunta o inquietud, por favor contáctanos a través de info@remesaespana.com</h6>
			</main>

			<Footer />
		</div>
	);
}

export { TermsAndConditions };
