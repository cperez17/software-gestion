from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import tempfile

# Crear un directorio temporal para evitar conflictos de perfil
temp_user_data_dir = tempfile.mkdtemp()

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
options.add_argument(f"--user-data-dir={temp_user_data_dir}")  # perfil único temporal
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Inicializar Chrome
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    driver.get("http://localhost:3004/")
    time.sleep(1)
    driver.get("http://localhost:3004/login")
    time.sleep(1)

    driver.find_element(By.NAME, "email").send_keys("admin1@uach.cl")
    driver.find_element(By.NAME, "password").send_keys("admin123")
    driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()

    time.sleep(3)
    print("✅ Prueba de login completada")

except Exception as e:
    print(f"❌ Error en la prueba: {e}")

finally:
    driver.quit()
