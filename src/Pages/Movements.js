import React, { useState, useEffect, useCallback } from 'react'
import { Button, Table, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import axios from 'axios'
import { NavBar } from '../Components/NavBar';
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloseCircle, AiOutlinePound, AiOutlineDollar, AiOutlineEuro } from 'react-icons/ai';
import { PiHandCoinsBold } from 'react-icons/pi';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { useDataContext } from '../Context/dataContext';

function Movements() {
  const { accessToken, url } = useDataContext();
  const [movements, setMovements] = useState([]);
  const [select, setSelect] = useState([]);
  const [modalImageMov, setModalImageMov] = useState(false);
  const [user, setUser] = useState([])
  const toggleImageMov = () => setModalImageMov(!modalImageMov);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/movements`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setMovements(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setMovements, accessToken, url]);
  

  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${accessToken.access_token}`, {
        headers: {
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, accessToken, url]);

  useEffect(() => {
    fetchData();
    fetchDataUser();
  }, [fetchData,fetchDataUser]);

  return (
    <div>
      <NavBar />
      <h1>Movimientos</h1>
      <Table success bordered hover responsive striped className='userTable table-success'>
        <thead>
          <tr>
            <th>#</th>
            <th>Moneda</th>
            <th>Monto</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Comentario</th>
            <th>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {movements.filter((move) => move.User.use_id === user.use_id).reverse().map((move) => (
            // move.User.use_id === user.use_id ?
            <tr key={move.mov_id}>
              <th scope="row">{move.mov_id}</th>
              <td>
                {move.mov_currency === 'EUR' &&
                  <span style={{ fontSize: '1.1em' }}>
                    EUR
                    <AiOutlineEuro />
                  </span>
                }
                {move.mov_currency === 'GBP' &&
                  <span style={{ fontSize: '1.1em' }}>
                    GBP
                    <AiOutlinePound />
                  </span>
                }
                {move.mov_currency === 'USD' && 
                <span style={{ fontSize: '1.1em' }}>
                USD
                <AiOutlineDollar />
              </span>
                }
                {move.mov_currency === 'BS' && 
                <span style={{ fontSize: '1.1em' }}>
                BS
                <PiHandCoinsBold />
              </span>
                }
              </td>
              <td>{move.mov_amount}</td>
              <td>
                {(move.mov_type === 'Deposito') ? (<FaArrowDown color='green' />) : null}
                {(move.mov_type === 'Retiro') ? (<FaArrowUp color='red' />) : null}
              </td>
              <td>
                {move.mov_status === 'R' ? (
                  <AiOutlineCloseCircle style={{ color: 'red', fontSize: '2em' }} /> // Icono de reloj
                ) : move.mov_status === 'V' ? (
                  <AiOutlineCheckCircle style={{ color: 'green', fontSize: '2em' }} /> // Icono de equis
                ) : (
                  <AiOutlineClockCircle style={{ color: 'blue', fontSize: '2em' }} /> // Icono de check
                )}
              </td>
              <td>{move.mov_date}</td>
              <td>{move.mov_comment}</td>
              <td>
                {move.mov_img && move.mov_typeOutflow !== 'Efectivo' ?
                  <Button
                    color='primary'
                    onClick={() => {
                      toggleImageMov();
                      setSelect(move);
                    }}>
                    Ver Imagen
                  </Button>
                  :
                  <p>No se encontraron resultados</p>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modalImageMov} size='lg' centered toggle={toggleImageMov}>
        <ModalHeader toggle={toggleImageMov}>{user.use_name} {user.use_lastName}</ModalHeader>
        <ModalBody>
          <img style={{ width: '100%' }} alt='Imagen Retiro' src={`${url}/Movements/image/${select.mov_img}`}  />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleImageMov}>
            Volver
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export { Movements }