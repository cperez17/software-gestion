from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

# Configuración del navegador
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")  # abrir pantalla completa (opcional)

# Inicializa el navegador
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # 1. Ir al inicio
    driver.get("http://localhost:3004/")
    time.sleep(1)  # espera para que cargue

    # 2. Ir directamente al login
    driver.get("http://localhost:3004/login")
    time.sleep(1)

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
    time.sleep(3)

    print("✅ Prueba de login completada")
except Exception as e:
    print(f"❌ Error en la prueba: {e}")
finally:
    driver.quit()