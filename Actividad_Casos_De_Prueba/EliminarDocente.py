from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.alert import Alert
import time

# Configuración del navegador
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

# Iniciar el driver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # 1. Ir al home
    driver.get("http://localhost:3004/")
    time.sleep(1)

    # 2. Ir al login
    driver.get("http://localhost:3004/login")
    time.sleep(1)

    # 3. Ingresar las credenciales
    driver.find_element(By.NAME, "email").send_keys("admin1@uach.cl")
    driver.find_element(By.NAME, "password").send_keys("ADMIN123")

    # 4. Click en Login
    login_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
    login_button.click()
    time.sleep(2)

    # 5. Ir a /docentes
    driver.get("http://localhost:3004/docentes")
    time.sleep(2)

    # 6. Click en "Ver información" del primer docente
    ver_info_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Ver Información')]")
    ver_info_button.click()

    # 7. Esperar a que el modal aparezca y sea visible
    modal = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//div[@class='estilos_modal__oSIDF']"))
    )
    print("✅ Modal cargado y visible")

    # 8. Esperar y hacer clic en el botón "Eliminar" dentro del modal
    eliminar_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[@class='estilos_modal__oSIDF']//button[contains(@class, 'estilos_deleteBtn__I33ib')]"))
    )
    eliminar_button.click()
    time.sleep(2)

    # 9. Manejar la alerta de confirmación
    # Esperar a que la alerta de confirmación esté presente
    WebDriverWait(driver, 10).until(EC.alert_is_present())

    # Aceptar la alerta de confirmación (hacer clic en "OK" o "Aceptar")
    alert = Alert(driver)
    alert.accept()
    print("✅ Confirmación de eliminación aceptada")
    # Esperar a ver si aparece actualmente el profesor
    time.sleep(2)

    print("✅ Prueba completada exitosamente")

except Exception as e:
    print(f"❌ Error en la prueba: {e}")

finally:
    driver.quit()
