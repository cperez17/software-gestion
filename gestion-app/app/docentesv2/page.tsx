"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.css';

const DocentesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false); // Estado para controlar el formulario de agregar

  const handleAddClick = () => {
    setShowAddForm(true); // Muestra el formulario cuando se hace clic en el botón Agregar
  };

  const handleCloseClick = () => {
    setShowAddForm(false); // Cierra el formulario cuando se hace clic en "Cerrar"
  };

  return (
    <div className={styles.container}>
      {/* Contenido principal */}
      <div className={styles.mainContainer}>
        {/* Barra de búsqueda */}
        <div className={styles.searchBar}>
          <input type="text" placeholder="Nombre" className={styles.inputField} />
          <input type="text" placeholder="Rut" className={styles.inputField} />
          <input type="text" placeholder="Grado" className={styles.inputField} />
          <button className={styles.cancelButton}>Cancelar</button>
          <button className={styles.searchButton}>Buscar</button>

          {/* Botones Agregar y Eliminar */}
          <div className={styles.actionButtons}>
            <button className={styles.addButton} onClick={handleAddClick}>Agregar</button>
            <button className={styles.deleteButton}>Eliminar</button>
          </div>
        </div>

        {/* Lista de Profesores */}
        <div className={styles.professorsList}>
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className={styles.professorCard}>
              <p><strong>Nombre:</strong> xxxxxxx</p>
              <p><strong>Rut:</strong> xxxxxxx</p>
              <p><strong>Grado:</strong> xxxxxxx</p>
              <button className={styles.infoButton}>Ver información</button>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de agregar profesor como modal */}
      {showAddForm && (
        <div className={styles.modalBackground}>
          <div className={styles.addFormContainer}>
            <h2>Agregar Profesor</h2>
            <form className={styles.addForm}>
              <label>
                Nombre:
                <input type="text" placeholder="Nombre" />
              </label>
              <label>
                Rut:
                <input type="text" placeholder="20.xxx.xxx-x" />
              </label>
              <label>
                Grado:
                <input type="text" placeholder="Información adicional" />
              </label>
              <div className={styles.formButtons}>
                <button type="button" className={styles.addButton}>Agregar</button>
                <button type="button" className={styles.closeButton} onClick={handleCloseClick}>Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocentesPage;