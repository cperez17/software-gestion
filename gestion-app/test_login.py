from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import tempfile
import os

# Crear un directorio temporal para el perfil de Chrome (evita conflicto con perfiles existentes)
temp_profile = tempfile.mkdtemp()

# Configuración del navegador
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")  # Abrir en pantalla completa
options.add_argument(f"--user-data-dir={temp_profile}")  # Usar un perfil temporal

# Inicializa el navegador
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # 1. Ir al inicio
    driver.get("http://localhost:3004/")
    time.sleep(1)

    # 2. Ir al login
    driver.get("http://localhost:3004/login")
    time.sleep(1)

    # 3. Ingresar email
    email_input = driver.find_element(By.NAME, "email")
    email_input.send_keys("admin1@uach.cl")

    # 4. Ingresar contraseña
    password_input = driver.find_element(By.NAME, "password")
    password_input.send_keys("admin123")

    # 5. Hacer clic en el botón Login
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
    login_button.click()

    # 6. Esperar unos segundos para verificar si inicia sesión correctamente
    time.sleep(3)

    print("✅ Prueba de login completada")
except Exception as e:
    print(f"❌ Error en la prueba: {e}")
finally:
    driver.quit()
    # Opcional: limpiar el directorio temporal
    try:
        import shutil
        shutil.rmtree(temp_profile)
    except Exception:
        pass
