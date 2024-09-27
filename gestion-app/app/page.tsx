import React from 'react';
import Image from 'next/image';
import styles from './styles/Main.module.css';

const mainPage = () => {
  return (
    <div className={styles.container}>
      {/* Barra Superior */}
      <div className={styles.topBar}>
        <p > Administrador </p>
      </div>

      {/* Barra de Navegación */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          {/* Logo en la esquina izquierda */}
          {/*<div className={styles.logo}>
            <Image
              src="/img/LogoICOC.png" // Ruta desde la carpeta public
              alt="Logo"
              width={150} // Ajusta según sea necesario
              height={50} // Ajusta según sea necesario
              className={styles.logoImage}
            />
          </div>*/}

          {/* Enlaces de Navegación */}
          <ul className={styles.navLinks}>
          </ul>
        </div>
      </nav>
      <div>
              {/* Barra de Título */}
      <div className={styles.titleBar}>
        <h1>Gestión ICOC</h1>
      </div>
          <div className={styles.logo}>
            <Image
              src="/img/Logo Civil_PNG.webp" // Ruta desde la carpeta public
              alt="Logo"
              width={1000} // Ajusta según sea necesario
              height={500} // Ajusta según sea necesario
              className={styles.logoImage}
            />
          </div>
      </div>
    </div>
  );
};

export default mainPage;
