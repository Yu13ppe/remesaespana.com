import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Table,
  Input,
} from 'reactstrap';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Usado para la "X"
import { useDataContext } from '../Context/dataContext';
import { NavBar } from '../Components/NavBar';
import { Spinner } from '../Components/Spinner';
import { NotFound404 } from './NotFound404';

function UserNyVerificated() {
  const { accessAdminToken, url } = useDataContext();
  const [users, setUsers] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [admin, setAdmin] = useState(null); // Estado para el rol del administrador
  const [isLoading, setIsLoading] = useState(true);

  // Obtener datos del administrador
  const fetchAdminData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByTokenAdmin/${accessAdminToken.access_token}`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setAdmin(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, url]);

  // Obtener los datos de los usuarios
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/users`, {
        headers: {
          Authorization: `Bearer ${accessAdminToken.access_token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [accessAdminToken, url]);

  useEffect(() => {
    fetchAdminData();
    fetchData();
    setTimeout(() => {
      setIsLoading(false);
    }, 900); // Simula que la carga demora 900 ms
  }, [fetchAdminData, fetchData]);

  // Filtrar usuarios por búsqueda y estado
  useEffect(() => {
    const result = users.filter(user => {
      const fullName = `${user.use_name} ${user.use_lastName} ${user.use_dni} ${user.use_email}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) && user.use_verif === 'N';
    });
    setFilteredUsuarios(result);
  }, [users, searchQuery]);

  // Manejar búsqueda
  const handleSearch = event => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reiniciar a la primera página al buscar
  };

  // Paginación
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsuarios.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  const renderPageNumbers = () => {
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => paginate(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </Button>
      );
    }

    return (
      <>
        {startPage > 1 && (
          <>
            <Button onClick={() => paginate(1)}>1</Button>
            {startPage > 2 && <span>...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span>...</span>}
            <Button onClick={() => paginate(totalPages)}>{totalPages}</Button>
          </>
        )}
      </>
    );
  };

  // Renderizar componente
  if (!admin) {
    return <Spinner />; // Mostrar spinner mientras carga el rol del administrador
  }

  if (admin.adm_role !== 'A' && admin.adm_role !== 'C') {
    return <NotFound404 />; // Mostrar NotFound404 si el rol no es válido
  }

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <NavBar />
          <div className='userContent'>
            <h1 className='titleUser'>Usuarios</h1>
            <div className="container">
              <div className='row m-5 col-12'>
                <div className='d-flex align-items-center col-12'>
                  <Input
                    type="text"
                    className="form-control search-input"
                    defaultValue={searchQuery}
                    onChange={handleSearch}
                    placeholder="Buscar Usuario..."
                  />
                </div>
              </div>
            </div>

            {/* Tabla De Usuarios */}
            <Table success bordered hover responsive striped className='userTable table-success'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Telefono</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Verificacion</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.use_id}>
                    <th scope="row">{user.use_id}</th>
                    <td>{user.use_name}</td>
                    <td>{user.use_lastName}</td>
                    <td>{user.use_phone}</td>
                    <td>{user.use_dni ? user.use_dni : <p>No se encontraron resultados</p>}</td>
                    <td>{user.use_email}</td>
                    <td>
                      {user.use_verif === 'N' ? (
                        <FaTimes style={{ color: "red", fontSize: "1.5em" }} />
                      ) : (
                        <FaTimes style={{ color: "green", fontSize: "1.5em" }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Paginación */}
            <div className='pagination'>
              {renderPageNumbers()}
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export { UserNyVerificated };
