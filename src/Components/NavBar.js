import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import logo from '../Assets/Images/remesalogo.png'
import slogan from '../Assets/Images/sloganremesa.png'
import { Link } from 'react-router-dom'
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { useDataContext } from '../Context/dataContext'
import { FiLogOut } from 'react-icons/fi'
import { clearLocalStorage } from '../Hooks/useLocalStorage'

function NavBar() {
  const { logged, accessAdminToken, url } = useDataContext()
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);

  const fetchDataAdmin = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByTokenAdmin/${accessAdminToken.access_token}`);
      setAdmin(response.data);
    } catch (error) {
    }
  }, [setAdmin, accessAdminToken, url]);

  const clearLocal = () => {
    clearLocalStorage();
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  }

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (event) => {
      // Prevent the mini-infobar from appearing on mobile.
      event.preventDefault();
      console.log("👍", "beforeinstallprompt", event);
      // Stash the event so it can be triggered later.
      window.deferredPrompt = event;
      // Remove the 'hidden' class from the install button container.
      setIsReadyForInstall(true);
    });
    fetchDataAdmin();
  }, [fetchDataAdmin]);

  async function downloadApp() {
    console.log("👍", "butInstall-clicked");
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      console.log("oops, no prompt event guardado en window");
      return;
    }
    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    console.log("👍", "userChoice", result);
    window.deferredPrompt = null;
    setIsReadyForInstall(false);
  }

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div className='Nav'>
      <Link to='/'>
        <div className='nav__logo'>
          <img src={logo}
            alt='remesaespana'
          />
          <img className='slogan' src={slogan}
            alt='sloganremesaespana'
          />
        </div>
      </Link>
      <div className='MenuPrincipal'>
        <div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {logged ?
          admin.adm_role === 'A' ? (
            <ul className={` ${menuOpen ? "open slide-in" : menuOpen === false ? "slide-out" : ""}`}>
              <Link className='' to='/Relation'>
                <li className=''>Relación</li>
              </Link>
              <Link className='' to='/CurrencyUpdate'>
                <li className=''>Tasa</li>
              </Link>
              <Link className='' to='/Banks'>
                <li className=''>Bancos</li>
              </Link>
              <Link className='' to='/Dashboard'>
                <Button className='log-btn'>Panel</Button>
              </Link>
              {isReadyForInstall && <li className='btn download-btn' onClick={downloadApp}>Descargar APP</li>}
              <FiLogOut style={{ fontSize: '2em', marginTop: '.2em', color: '#409192', cursor: 'pointer' }} onClick={clearLocal} />            </ul>
          ) : admin.adm_role === 'B' ? (
            <ul className={` ${menuOpen ? "open slide-in" : menuOpen === false ? "slide-out" : ""}`}>
              <Link className='' to='/'>
                <li className=''>Inicio</li>
              </Link>
              <Link className='' to='/Faqs'>
                <li className=''>Faqs</li>
              </Link>
              {isReadyForInstall && <li className='btn download-btn' onClick={downloadApp}>Descargar APP</li>}
              <Link className='' to='/Dashboard'>

                <Button className='log-btn'>Panel</Button>
              </Link>
              <FiLogOut style={{ fontSize: '2em', marginTop: '.2em', color: '#409192', cursor: 'pointer' }} onClick={clearLocal} />            </ul>
          ) : admin.adm_role === 'C' ? (
            <ul className={` ${menuOpen ? "open slide-in" : menuOpen === false ? "slide-out" : ""}`}>
              <Link className='' to='/'>
                <li className=''>Inicio</li>
              </Link>
              <Link className='' to='/Faqs'>
                <li className=''>Faqs</li>
              </Link>
              {isReadyForInstall && <li className='btn download-btn' onClick={downloadApp}>Descargar APP</li>}

              <Link className='' to='/Dashboard'>
                <Button className='log-btn'>Panel</Button>
              </Link>
              <FiLogOut style={{ fontSize: '2em', marginTop: '.2em', color: '#409192', cursor: 'pointer' }} onClick={clearLocal} />            </ul>
          ) : (
            <ul className={` ${menuOpen ? "open slide-in" : menuOpen === false ? "slide-out" : ""}`}>
              <Link className='' to='/'>
                <li className=''>Inicio</li>
              </Link>
              <Link className='' to='/Faqs'>
                <li className=''>Faqs</li>
              </Link>
              <Link className='' to='/Movements'>
                <li className=''>Movimientos</li>
              </Link>
              {isReadyForInstall && <ul className='log-btn' onClick={downloadApp}>Descargar APP</ul>}
              <Link className='' to='/Changes'>
                <Button className='log-btn'>Cambios</Button>
              </Link>
              <FiLogOut style={{ fontSize: '2em', marginTop: '.2em', color: '#409192', cursor: 'pointer' }} onClick={clearLocal} />
            </ul>
          ) : (
            <ul className={` ${menuOpen ? "open slide-in" : menuOpen === false ? "slide-out" : ""}`}>
              <Link className='' to='/'>
                <li className=''>Inicio</li>
              </Link>
              <Link className='' to='/Faqs'>
                <li className=''>Faqs</li>
              </Link>
              {isReadyForInstall && <li className='btn download-btn' onClick={downloadApp}>Descargar APP</li>}

              <a className='' href='https://wa.me/+34722850962'>
                <li className=''>Contacto</li>
              </a>
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle className='log-btn'>Acceder</DropdownToggle>
                <DropdownMenu>
                  <Link className='' to='/Register'>
                    <DropdownItem>Registrarse</DropdownItem>
                  </Link>
                  <DropdownItem divider /> 
                  <Link className='' to='/Login'>
                    <DropdownItem>Ingresar</DropdownItem>
                  </Link>
                </DropdownMenu>
              </Dropdown>
            </ul>
          )
        }
      </div >
    </div>
  )
}

export { NavBar }