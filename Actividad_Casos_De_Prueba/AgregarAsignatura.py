from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.alert import Alert
import time

# Configuración del navegador
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

# Inicializar el driver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    # 1. Iniciar sesión como director
    driver.get("http://localhost:3004/login")
    time.sleep(1)
    driver.find_element(By.NAME, "email").send_keys("admin@uach.cl")
    driver.find_element(By.NAME, "password").send_keys("ADMIN123")
    driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]").click()
    time.sleep(2)

    # 2. Navegar a la sección de administración de profesores
    driver.get("http://localhost:3004/asignaturas")
    time.sleep(2)
    
    # 3. Hacer clic en el botón "Agregar Asignatura"
    add_subject_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Agregar Asignatura')]")
    add_subject_button.click()
    time.sleep(1)

    # 4. Llenar el formulario en el modal
    # Nombre de la asignatura
    driver.find_element(By.ID, "course_name").send_keys("MÉTODOS Y MODELOS DE INGENIERÍA DE SOFTWARE")
        
    # Código
    driver.find_element(By.ID, "code").send_keys("INFO290")
        
    # Créditos
    driver.find_element(By.ID, "credits").send_keys("7")
        
    # Semestre (Seleccionar semestre 10)
    semester_select = driver.find_element(By.ID, "semester_id")
    semester_select.click()
    time.sleep(1)
    semester_option = driver.find_element(By.XPATH, "//option[@value='40']")  # Semestre 10
    semester_option.click()

    # 5. Hacer clic en el botón "Guardar"
    save_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Guardar')]")
    save_button.click()
    time.sleep(3)

    print("✅ Asignatura agregada correctamente.")


except Exception as e:
    print(f"❌ Error en la prueba: {e}")

finally:
    driver.quit()
