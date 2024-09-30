import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

// Convertimos la función a async para futuras operaciones asíncronas
export default async function Home() {
  // Aquí podrías agregar una llamada asíncrona si es necesario en el futuro, como fetch a una API
  // const data = await fetchData();

  return (
    <div className={styles.container}>
      {/* Barra Superior */}
      <div className={styles.topBar}>
        <p> Administrador </p>
      </div>

      {/* Barra de Navegación */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          {/* Enlaces de Navegación */}
          <ul className={styles.navLinks}>
            <li>
              <Link href="/inicio">Inicio</Link>
            </li>
            <li>
              <Link href="/asignatura">Asignaturas</Link>
            </li>
            <li>
              <Link href="/docentes">Planta Docente</Link>
            </li>
            <li>
              <Link href="/informes">Informes</Link>
            </li>
            <li>
              <Link href="/historico">Histórico</Link>
            </li>
            <li>
              <Link href="/perfil">Perfil</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Barra de Título */}
      <div className={styles.titleBar}>
        <h1>Gestión ICOC</h1>
      </div>

      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/img/Logo Civil_PNG.webp" // Ruta desde la carpeta public
          alt="Logo"
          width={1000}
          height={500}
          className={styles.logoImage}
        />
      </div>
    </div>
  );
}
