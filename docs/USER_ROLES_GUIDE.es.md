# Guía de Roles de Usuario - QTrack

## 1. Resumen de Roles

QTrack implementa un sistema de control de acceso basado en roles (RBAC) con cinco niveles de usuario distintos, cada uno con permisos y responsabilidades específicas.

### 1.1 Jerarquía de Roles
\`\`\`
ADMIN (Administrador del Sistema)
├── MANAGER (Gerente de QA)
│   ├── QA (Ingeniero QA Senior)
│   │   ├── DEV (Desarrollador/Tester)
│   │   └── USER (Usuario Final)
\`\`\`

## 2. Definiciones de Roles

### 2.1 ADMIN - Administrador del Sistema
**Descripción**: Control total del sistema con acceso a todas las funcionalidades administrativas.

**Permisos**:
- ✅ Gestión completa de usuarios (crear, editar, eliminar, cambiar roles)
- ✅ Configuración del sistema y parámetros globales
- ✅ Acceso a todas las métricas y reportes
- ✅ Gestión de integraciones y configuraciones de seguridad
- ✅ Backup y restauración de datos
- ✅ Auditoría completa del sistema

**Responsabilidades**:
- Mantenimiento del sistema
- Gestión de usuarios y permisos
- Configuración de políticas de seguridad
- Monitoreo del rendimiento del sistema

### 2.2 MANAGER - Gerente de QA
**Descripción**: Supervisión de equipos QA y gestión de proyectos de calidad.

**Permisos**:
- ✅ Gestión de usuarios de su equipo (crear, editar QA/DEV/USER)
- ✅ Acceso a dashboards ejecutivos y métricas de equipo
- ✅ Gestión completa de proyectos y test suites
- ✅ Aprobación de releases y cambios críticos
- ✅ Configuración de workflows y procesos
- ✅ Reportes avanzados y análisis de tendencias

**Responsabilidades**:
- Supervisión de equipos QA
- Planificación de estrategias de testing
- Revisión y aprobación de planes de prueba
- Gestión de recursos y asignaciones

### 2.3 QA - Ingeniero QA Senior
**Descripción**: Ejecución de pruebas, gestión de casos de prueba y aseguramiento de calidad.

**Permisos**:
- ✅ Creación y gestión de casos de prueba
- ✅ Ejecución de test suites y reportes de resultados
- ✅ Gestión completa de tickets de defectos
- ✅ Acceso a métricas de calidad y cobertura
- ✅ Colaboración en tiempo real (comentarios, actividad)
- ✅ Configuración de automatización de pruebas

**Responsabilidades**:
- Diseño y ejecución de casos de prueba
- Identificación y reporte de defectos
- Validación de correcciones
- Mantenimiento de documentación de QA

### 2.4 DEV - Desarrollador/Tester
**Descripción**: Desarrollo de software y ejecución de pruebas básicas.

**Permisos**:
- ✅ Ejecución de casos de prueba asignados
- ✅ Creación de tickets de defectos básicos
- ✅ Acceso a métricas personales y de equipo
- ✅ Colaboración en comentarios y discusiones
- ✅ Actualización de estado de tickets asignados
- ❌ No puede eliminar casos de prueba críticos

**Responsabilidades**:
- Ejecución de pruebas unitarias e integración
- Reporte de bugs encontrados durante desarrollo
- Colaboración con equipo QA
- Mantenimiento de código de pruebas

### 2.5 USER - Usuario Final
**Descripción**: Acceso limitado para visualización y pruebas de aceptación de usuario.

**Permisos**:
- ✅ Visualización de dashboards básicos
- ✅ Ejecución de pruebas de aceptación asignadas
- ✅ Creación de tickets de feedback/sugerencias
- ✅ Acceso a documentación de usuario
- ❌ Sin acceso a configuraciones del sistema
- ❌ Sin acceso a métricas detalladas

**Responsabilidades**:
- Pruebas de aceptación de usuario (UAT)
- Feedback sobre usabilidad
- Reporte de problemas de usuario final
- Validación de requisitos de negocio

## 3. Usuarios de Prueba

### 3.1 Administradores (ADMIN)
\`\`\`
Email: admin@qtrack.com
Password: admin123
Nombre: System Administrator
Departamento: IT Operations
\`\`\`

\`\`\`
Email: superadmin@qtrack.com
Password: super123
Nombre: Super Admin
Departamento: System Management
\`\`\`

### 3.2 Gerentes (MANAGER)
\`\`\`
Email: manager@qtrack.com
Password: manager123
Nombre: QA Manager
Departamento: Quality Assurance
\`\`\`

\`\`\`
Email: qa.lead@qtrack.com
Password: lead123
Nombre: QA Team Lead
Departamento: Quality Assurance
\`\`\`

\`\`\`
Email: project.manager@qtrack.com
Password: pm123
Nombre: Project Manager
Departamento: Project Management
\`\`\`

### 3.3 Ingenieros QA (QA)
\`\`\`
Email: qa.engineer@qtrack.com
Password: qa123
Nombre: Senior QA Engineer
Departamento: Quality Assurance
\`\`\`

\`\`\`
Email: qa.specialist@qtrack.com
Password: specialist123
Nombre: QA Specialist
Departamento: Quality Assurance
\`\`\`

\`\`\`
Email: automation.qa@qtrack.com
Password: auto123
Nombre: Automation QA Engineer
Departamento: Test Automation
\`\`\`

\`\`\`
Email: performance.qa@qtrack.com
Password: perf123
Nombre: Performance QA Engineer
Departamento: Performance Testing
\`\`\`

### 3.4 Desarrolladores (DEV)
\`\`\`
Email: developer@qtrack.com
Password: dev123
Nombre: Software Developer
Departamento: Development
\`\`\`

\`\`\`
Email: frontend.dev@qtrack.com
Password: frontend123
Nombre: Frontend Developer
Departamento: Frontend Development
\`\`\`

\`\`\`
Email: backend.dev@qtrack.com
Password: backend123
Nombre: Backend Developer
Departamento: Backend Development
\`\`\`

\`\`\`
Email: fullstack.dev@qtrack.com
Password: fullstack123
Nombre: Fullstack Developer
Departamento: Development
\`\`\`

\`\`\`
Email: mobile.dev@qtrack.com
Password: mobile123
Nombre: Mobile Developer
Departamento: Mobile Development
\`\`\`

### 3.5 Usuarios Finales (USER)
\`\`\`
Email: user@qtrack.com
Password: user123
Nombre: End User
Departamento: Business Operations
\`\`\`

\`\`\`
Email: business.user@qtrack.com
Password: business123
Nombre: Business User
Departamento: Business Analysis
\`\`\`

\`\`\`
Email: client.user@qtrack.com
Password: client123
Nombre: Client User
Departamento: Client Services
\`\`\`

\`\`\`
Email: stakeholder@qtrack.com
Password: stake123
Nombre: Stakeholder
Departamento: Business Strategy
\`\`\`

\`\`\`
Email: guest.user@qtrack.com
Password: guest123
Nombre: Guest User
Departamento: External
\`\`\`

## 4. Matriz de Permisos

| Funcionalidad | ADMIN | MANAGER | QA | DEV | USER |
|---------------|-------|---------|----|----|------|
| Gestión de Usuarios | ✅ | ✅* | ❌ | ❌ | ❌ |
| Configuración Sistema | ✅ | ❌ | ❌ | ❌ | ❌ |
| Crear Test Suites | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ejecutar Pruebas | ✅ | ✅ | ✅ | ✅ | ✅* |
| Gestionar Defectos | ✅ | ✅ | ✅ | ✅* | ❌ |
| Ver Métricas | ✅ | ✅ | ✅ | ✅* | ✅* |
| Reportes Avanzados | ✅ | ✅ | ✅* | ❌ | ❌ |
| Configurar Automatización | ✅ | ✅ | ✅ | ❌ | ❌ |

*Permisos limitados o específicos del rol

## 5. Escenarios de Prueba por Rol

### 5.1 Escenarios ADMIN
- Crear y gestionar usuarios de todos los roles
- Configurar integraciones del sistema
- Acceder a métricas globales y reportes ejecutivos
- Realizar backup y restauración de datos
- Configurar políticas de seguridad

### 5.2 Escenarios MANAGER
- Supervisar equipos y asignar tareas
- Revisar y aprobar planes de prueba
- Generar reportes de progreso para stakeholders
- Gestionar recursos y cronogramas
- Configurar workflows de equipo

### 5.3 Escenarios QA
- Diseñar y ejecutar casos de prueba complejos
- Gestionar ciclos completos de testing
- Reportar y hacer seguimiento de defectos
- Colaborar con desarrolladores en resolución
- Mantener documentación de QA

### 5.4 Escenarios DEV
- Ejecutar pruebas unitarias y de integración
- Reportar bugs encontrados durante desarrollo
- Actualizar estado de tickets asignados
- Colaborar en revisiones de código
- Mantener pruebas automatizadas

### 5.5 Escenarios USER
- Realizar pruebas de aceptación de usuario
- Proporcionar feedback sobre usabilidad
- Reportar problemas desde perspectiva de usuario
- Validar requisitos de negocio
- Acceder a documentación de usuario

---

**Versión del Documento**: 2.0  
**Última Actualización**: Diciembre 2024  
**Próxima Revisión**: Marzo 2025
