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
    # 1. Ir al inicio
    driver.get("http://localhost:3004/")

    # 2. Ir directamente al login
    driver.get("http://localhost:3004/login")

    # 3. Ingresar email
    email_input = driver.find_element(By.NAME, "email")
    email_input.send_keys("admin1@uach.cl")

    # 4. Ingresar contraseña
    password_input = driver.find_element(By.NAME, "password")
    password_input.send_keys("admin123")

    # 5. Clic en el botón de Login
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
    login_button.click()

    # 6. Espera para ver si inicia sesión correctamente (puedes ajustar según tu app)

    print("✅ Prueba de login completada")
except Exception as e:
    print(f"❌ Error en la prueba: {e}")
finally:
    driver.quit()


