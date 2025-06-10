from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

# Configurar Chrome en modo headless para entorno CI
options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")

# Inicializar el navegador
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # Ir a la página de login
    driver.get("http://localhost:3004/login")
    time.sleep(2)  # Dar tiempo a que cargue

    # Ingresar credenciales
    driver.find_element(By.NAME, "email").send_keys("admin1@uach.cl")
    driver.find_element(By.NAME, "password").send_keys("admin123")

    # Clic en el botón de login
    driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()

    # Esperar redirección o carga
    time.sleep(3)

    # Validar que el login fue exitoso
    assert "dashboard" in driver.current_url.lower() or "logout" in driver.page_source.lower() or "bienvenido" in driver.page_source.lower()

    print("✅ Prueba de login completada con éxito")

except Exception as e:
    print(f"❌ Error en la prueba de login: {e}")

finally:
    driver.quit()


