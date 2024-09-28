import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home = () => {
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
            <li>
              <Link href="/Home">Inicio</Link>
            </li>
            <li>
              <Link href="/Home">Asignarturas</Link>
            </li>
            <li>
              <Link href="/Home">Planta Docente</Link>
            </li>
            <li>
              <Link href="/Home">Informes</Link>
            </li>
            <li>
              <Link href="/Home">Historico</Link>
            </li>
            <li>
              <Link href="/Home">Perfil</Link>
            </li>
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

export default Home;
