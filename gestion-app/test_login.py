from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

# Configurar opciones de Chrome sin --user-data-dir
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Inicializar Chrome
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # Ir al sitio
    driver.get("http://localhost:3004/")
    time.sleep(1)
    driver.get("http://localhost:3004/login")
    time.sleep(1)

    # Ingresar credenciales
    driver.find_element(By.NAME, "email").send_keys("admin1@uach.cl")
    driver.find_element(By.NAME, "password").send_keys("admin123")

    # Clic en el botón de login
    driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()

    # Esperar unos segundos para cargar la página
    time.sleep(3)
    print("✅ Prueba de login completada")

except Exception as e:
    print(f"❌ Error en la prueba: {e}")

finally:
    driver.quit()
