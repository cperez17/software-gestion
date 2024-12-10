import Image from 'next/image';
import styles from './styles/Main.module.css';

// Convertimos la función a async para futuras operaciones asíncronas
export default async function main() {
  // Aquí podrías agregar una llamada asíncrona si es necesario en el futuro, como fetch a una API
  // const data = await fetchData();

  return (
    <div className={styles.container}>
      {/* Barra de Título */}
      <div className={styles.titleBar}>
        <h1>Gestión ICOC</h1>
      </div>

      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/img/inst-obras.png"
          alt="Logo"
          width={2000}
          height={2000}
          className={styles.logoImage}
        />
      </div>
    </div>
  );
}