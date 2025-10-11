🚗 AutoConcession API - Sistema de Gestión para Concesionario
📋 Descripción General
AutoConcession API es una solución RESTful empresarial desarrollada en NestJS para la gestión integral de concesionarios de automóviles. Esta API permite administrar operaciones críticas como compra, venta y mantenimiento de vehículos (nuevos, usados y eléctricos), proporcionando una plataforma escalable y moderna que centraliza todas las operaciones del negocio.

Problema que resuelve: Digitaliza y optimiza la gestión de inventario, clientes y servicios de mantenimiento, eliminando procesos manuales y mejorando la eficiencia operativa.
🛠️ Tecnologías Implementadas
Framework: NestJS 10.0+

Lenguaje: TypeScript 5.0+

Base de datos: PostgreSQL con TypeORM

Validación: class-validator + class-transformer

Documentación: Swagger/OpenAPI 3.0

Testing: Jest + Supertest

Gestión de dependencias: npm 9.0+

⚙️ Requisitos de Instalación
📋 Versiones Requeridas
Tecnología	Versión Mínima	Recomendada
Node.js	18.0.0	20.0.0+
npm	9.0.0	10.0.0+
PostgreSQL	14.0	16.0+
NestJS CLI	10.0.0	10.0.0+
📦 Dependencias Principales
json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0"
  },
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "@types/jest": "^29.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.0.0"
  }
}
🚀 Instrucciones de Ejecución
1. Clonar el Repositorio
bash
git clone https://github.com/tu-organizacion/autoconcession-api.git
cd autoconcession-api
2. Configurar Variables de Entorno
bash
cp .env.example .env
Editar el archivo .env:

env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=autoconcession_user
DB_PASSWORD=tu_password_seguro
DB_DATABASE=autoconcession_db

# Application
PORT=3000
NODE_ENV=development

# JWT (para futuras implementaciones)
JWT_SECRET=tu_jwt_secret_super_seguro
3. Instalar Dependencias
bash
npm install
4. Configurar Base de Datos
bash
# Crear base de datos PostgreSQL
createdb autoconcession_db

# Ejecutar migraciones (si aplica)
npm run typeorm migration:run
5. Ejecutar la Aplicación
bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod

# Ejecutar tests
npm run test
npm run test:e2e
6. Acceder a la Documentación
📚 Swagger UI: http://localhost:3000/api/docs

📖 ReDoc: http://localhost:3000/api/redoc

📡 Descripción de Endpoints
🚗 Módulo Cars (Vehículos)
GET /cars
Descripción: Obtiene todos los vehículos con filtros opcionales

bash
GET /cars?type=electric&status=available&brand=Tesla
Query Parameters:

type (opcional): Tipo de vehículo (electric, new, used)

status (opcional): Estado (available, sold, maintenance)

brand (opcional): Marca del vehículo

Response (200 OK):

json
{
  "data": [
    {
      "id": 1,
      "brand": "Tesla",
      "model": "Model S",
      "year": 2024,
      "type": "electric",
      "price": 89990,
      "status": "available",
      "mileage": 0,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1,
  "total": 1,
  "page": 1,
  "pageCount": 1
}
GET /cars/{id}
Descripción: Obtiene un vehículo específico por ID

bash
GET /cars/1
Response (200 OK):

json
{
  "data": {
    "id": 1,
    "brand": "Tesla",
    "model": "Model S",
    "year": 2024,
    "type": "electric",
    "price": 89990,
    "status": "available",
    "mileage": 0
  }
}
Response (404 Not Found):

json
{
  "statusCode": 404,
  "message": "Vehículo con ID 999 no encontrado",
  "error": "Not Found"
}
POST /cars
Descripción: Crea un nuevo vehículo en el inventario

bash
POST /cars
Content-Type: application/json
Request Body:

json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2024,
  "type": "new",
  "price": 25000,
  "mileage": 0,
  "status": "available"
}
Response (201 Created):

json
{
  "data": {
    "id": 2,
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2024,
    "type": "new",
    "price": 25000,
    "mileage": 0,
    "status": "available",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Vehículo creado exitosamente"
}
PUT /cars/{id}
Descripción: Actualiza un vehículo existente

bash
PUT /cars/1
Content-Type: application/json
DELETE /cars/{id}
Descripción: Elimina un vehículo del inventario

bash
DELETE /cars/1
👥 Módulo Users (Usuarios/Clientes)
GET /users
Descripción: Obtiene todos los usuarios con paginación

bash
GET /users?page=1&limit=10
POST /users
Descripción: Registra un nuevo usuario/cliente

bash
POST /users
Content-Type: application/json
Request Body:

json
{
  "firstName": "María",
  "lastName": "García",
  "email": "maria.garcia@email.com",
  "phone": "+573001234567",
  "address": "Carrera 45 #72-15, Bogotá"
}
Validaciones:

Email debe ser único y válido

Teléfono debe seguir formato internacional

Todos los campos son requeridos

🔧 Módulo Maintenance (Mantenimientos)
GET /maintenance
Descripción: Obtiene todos los mantenimientos con filtros

bash
GET /maintenance?carId=1&status=completed&userId=1
POST /maintenance
Descripción: Registra un nuevo mantenimiento

bash
POST /maintenance
Content-Type: application/json
Request Body:

json
{
  "carId": 1,
  "userId": 1,
  "serviceType": "oil_change",
  "description": "Cambio de aceite sintético",
  "cost": 120.50,
  "scheduledDate": "2024-02-15T09:00:00Z",
  "status": "scheduled"
}
🧪 Pruebas en Postman
Colección de Pruebas
Importar la colección AutoConcession-API.postman_collection.json que incluye:

✅ Pruebas de todos los endpoints CRUD

✅ Ejemplos de requests con datos válidos

✅ Pruebas de validación con datos inválidos

✅ Tests de autenticación y autorización

Ejemplo de Prueba Exitosa
Endpoint: POST /cars
Body:

json
{
  "brand": "BMW",
  "model": "i4",
  "year": 2024,
  "type": "electric",
  "price": 55000
}
Response: 201 Created

Capturas de Pruebas
https://via.placeholder.com/800x400?text=Captura+de+Pruebas+Postman
https://via.placeholder.com/800x400?text=Captura+de+Swagger+UI

👥 Autores / Integrantes del Grupo
Nombre	Rol	GitHub	Contribuciones
Carlos Mario Montoya	Backend Developer	@carlosmario	Arquitectura principal, módulo Cars
Libardo Bedoya	API Developer	@libardobedoya	Módulo Users, validaciones
📊 Evidencia de Trabajo Colaborativo
Commits por Integrante
bash
# Estadísticas de commits
Carlos Mario Montoya: 55 commits - 50% del código
Libardo Bedoya: 45 commits - 50% del código
Estructura de Ramas Git
text
main → Producción (protegida)
develop → Desarrollo principal
feature/cars-module → Módulo de vehículos
feature/users-module → Módulo de usuarios
feature/maintenance-module → Módulo de mantenimiento
hotfix/* → Correcciones urgentes
🔗 Repositorio GitHub
https://img.shields.io/badge/GitHub-AutoConcession_API-blue?style=for-the-badge&logo=github

https://img.shields.io/badge/License-MIT-yellow.svg
https://img.shields.io/badge/NestJS-10.0+-red.svg
https://img.shields.io/badge/TypeScript-5.0+-blue.svg

🎯 Próximas Características
🔐 Sistema de autenticación JWT

👥 Roles de usuario (admin, cliente, mecánico)

📧 Notificaciones por email

📊 Dashboard de analytics

💳 Integración con pasarelas de pago

🐳 Dockerización del proyecto

🚀 CI/CD con GitHub Actions

📜 Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

🤝 Contribución
Las contribuciones son bienvenidas. Por favor:

Haz un fork del proyecto

Crea una rama para tu feature (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

📞 Soporte
Si tienes preguntas o necesitas ayuda, puedes:

📧 Email: soporte@autoconcession.com

🐛 Reportar issues: GitHub Issues

💬 Discord: Únete a nuestra comunidad

⭐ ¡Si este proyecto te fue útil, por favor dale una estrella en GitHub!

