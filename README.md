# 🚗 CDA

## 📌 Descripción  
**CDA** es una aplicación web para la gestión de clientes, vehículos, citas y servicios de un centro de diagnóstico automotriz.  
Incluye panel de administración, control de servicios, gestión de repuestos y usuarios con distintos roles.

---

## ⚙️ Instalación y Configuración

### 1. Restaurar Base de Datos  
En el proyecto encontrarás un archivo `.bak` adjunto.  
Restaura la base de datos en tu SQL Server.

### 2. Configuración del Backend  
- link Back: https://github.com/Wlfran/Back-CDA
- Abre el archivo `appsettings.json` del backend.  
- Modifica la **cadena de conexión** con los datos de tu servidor SQL Server.

### 3. Ejecución del Frontend  
- Instala las dependencias:  
  ```bash
  npm install
  ```  
- Ejecuta el proyecto:  
  ```bash
  ng serve -o
  ```  

### 4. Usuario de Prueba  
Al restaurar la base, tendrás disponible un usuario administrador:  

```
Usuario: Steven
Contraseña: 123
```

---

## 📊 Funcionamiento Paso a Paso

### 🔐 Login  
Tras iniciar sesión, accederás al **Dashboard**, donde verás:  
- Conteo de servicios realizados  
- Servicios en proceso  
- Servicios del día  
- Estadísticas generales  

En la parte inferior tendrás **6 botones principales**:

---

### 1️⃣ Nuevo Cliente  
Permite registrar un nuevo cliente junto con su vehículo.

---

### 2️⃣ Nueva Cita  
Aquí podrás:  
- Seleccionar cliente y vehículo  
- Añadir observaciones  
- Definir el precio máximo del servicio  
- Establecer fecha de la cita  
- Subir una foto de referencia  

---

### 3️⃣ Ver Servicios  
Vista interactiva con todo el consolidado de servicios:  
- Cliente, vehículo, fecha, estado, mecánico asignado  
- 3 botones dinámicos según el estado del servicio

#### 🔹 Estados del servicio:
1. **Solicitado**  
   - Botón **Asignar** → Lista de mecánicos disponibles  
   - Botón **Editar** → Modificar fecha y observaciones  

2. **Asignado**  
   - Botón **Editar** → Modificar detalles  
   - Botón **Gestionar** → Añadir observaciones, repuestos, cantidad, tiempo estimado y mano de obra  

3. **En Revisión**  
   - Botón **Finalizar Servicio** → Confirma la finalización y descarga un **PDF con la factura**  

---

### 4️⃣ Nuevo Repuesto  
- Solo accesible para administradores.  
- Permite crear y registrar repuestos disponibles en el sistema.

---

### 5️⃣ Usuarios  
- Solo accesible para administradores.  
- Permite crear usuarios de tipo **Administrador, Mecánico, Cliente, etc.**

---

### 6️⃣ Cerrar Sesión  
Botón para cerrar sesión de forma segura.

---

## 📂 Tecnologías Utilizadas
- **Backend:** .NET Core / Entity Framework  
- **Frontend:** Angular + Bootstrap + Material  
- **Base de Datos:** SQL Server  
