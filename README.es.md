# QTrack - Sistema Profesional de Gestión de QA

[![Pipeline CI/CD](https://github.com/qtrack/qtrack/workflows/CI/badge.svg)](https://github.com/qtrack/qtrack/actions)
[![Cobertura de Tests](https://codecov.io/gh/qtrack/qtrack/branch/main/graph/badge.svg)](https://codecov.io/gh/qtrack/qtrack)
[![Estado Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=qtrack&metric=alert_status)](https://sonarcloud.io/dashboard?id=qtrack)
[![Licencia: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

QTrack es un sistema integral de seguimiento de calidad y gestión de bugs impulsado por IA, diseñado para equipos de desarrollo modernos. Combina gestión inteligente de tickets, colaboración en tiempo real y analíticas avanzadas para optimizar tus procesos de aseguramiento de calidad.

## Características

### Características Principales
- **Gestión Inteligente de Tickets**: Clasificación de tickets impulsada por IA, sugerencia de prioridades y detección de duplicados
- **Colaboración en Tiempo Real**: Comentarios en vivo, indicadores de presencia y feeds de actividad
- **Dashboard Avanzado**: Analíticas comprehensivas con gráficos interactivos y métricas
- **Control de Acceso Basado en Roles**: Permisos granulares y controles de seguridad
- **Autenticación de Dos Factores**: Seguridad mejorada con soporte TOTP

### Características Impulsadas por IA
- **Clasificación Inteligente**: Categorización automática de tickets y asignación de prioridades
- **Detección de Duplicados**: Detección de similitud impulsada por IA para prevenir tickets duplicados
- **Análisis de Sentimientos**: Analizar el sentimiento de comentarios para mejores insights del equipo
- **Analíticas Predictivas**: Pronosticar tiempos de resolución e identificar cuellos de botella

### Características de Colaboración
- **Comentarios en Vivo**: Comentarios en tiempo real con reacciones e hilos
- **Indicadores de Presencia**: Ver quién está en línea y en qué están trabajando
- **Feeds de Actividad**: Seguir todas las actividades del proyecto en tiempo real
- **Notificaciones**: Sistema de notificaciones personalizable con múltiples canales

### Capacidades de Integración
- **Diseño API-First**: API REST comprehensiva para toda la funcionalidad
- **Soporte de Webhooks**: Notificaciones de eventos en tiempo real
- **Integraciones de Terceros**: Slack, GitHub, Jira y más
- **Soporte SSO**: Integración SAML, OAuth y LDAP

## Inicio Rápido

### Prerrequisitos
- Node.js 18+ y npm
- PostgreSQL 13+ o base de datos compatible
- Redis 6+ para caché y características en tiempo real
- (Opcional) Docker y Docker Compose

### Instalación

#### Opción 1: Docker Compose (Recomendado)
\`\`\`bash
# Clonar el repositorio
git clone https://github.com/qtrack/qtrack.git
cd qtrack

# Iniciar con Docker Compose
docker-compose up -d

# Acceder a QTrack en http://localhost:3000
\`\`\`

#### Opción 2: Instalación Manual
\`\`\`bash
# Clonar e instalar dependencias
git clone https://github.com/qtrack/qtrack.git
cd qtrack
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# Configurar la base de datos
npm run db:migrate
npm run db:seed

# Iniciar el servidor de desarrollo
npm run dev
\`\`\`

### Credenciales por Defecto
- **Admin**: admin@qtrack.com / admin123
- **QA Manager**: qa.manager@qtrack.com / manager123
- **QA Engineer**: qa.engineer@qtrack.com / engineer123
- **Developer**: developer@qtrack.com / dev123
- **Viewer**: viewer@qtrack.com / viewer123

## Documentación

- [Guía de Roles de Usuario](./docs/USER_ROLES_GUIDE.es.md) - Documentación completa de control de acceso basado en roles
- [Estrategia de QA](./docs/QA_STRATEGY.es.md) - Estrategia comprehensiva de aseguramiento de calidad
- [Evaluación de Riesgos](./docs/RISK_ASSESSMENT.es.md) - Análisis de riesgos y estrategias de mitigación
- [Plan de Pruebas](./docs/TEST_PLAN.es.md) - Procedimientos detallados de testing y estándares
- [Guía de Despliegue](./docs/deployment/README.es.md) - Instrucciones de despliegue en producción
- [Guía de Testing](./docs/testing/testing-guide.es.md) - Documentación completa del framework de testing

### English Documentation
- [User Roles Guide](./docs/USER_ROLES_GUIDE.md)
- [QA Strategy](./docs/QA_STRATEGY.md)
- [Risk Assessment](./docs/RISK_ASSESSMENT.md)
- [Test Plan](./docs/TEST_PLAN.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Testing Guide](./docs/testing/testing-guide.md)

## Arquitectura

QTrack está construido con tecnologías modernas:

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, TypeScript, arquitectura SOLID
- **Base de Datos**: PostgreSQL con Redis para caché
- **IA/ML**: Integración OpenAI GPT-4, modelos ML personalizados
- **Tiempo Real**: Conexiones WebSocket, Server-Sent Events
- **Testing**: Vitest, Playwright, Testing Library
- **Infraestructura**: Docker, Kubernetes, CI/CD con GitHub Actions

## Desarrollo

### Configurar Entorno de Desarrollo
\`\`\`bash
# Instalar dependencias
npm install

# Configurar hooks pre-commit
npm run prepare

# Iniciar servidores de desarrollo
npm run dev        # Frontend (Next.js)
npm run dev:api    # Backend API
npm run dev:db     # Base de datos (Docker)
\`\`\`

### Ejecutar Tests
\`\`\`bash
npm run test              # Tests unitarios (Vitest)
npm run test:e2e          # Tests E2E (Playwright)
npm run test:coverage     # Reporte de cobertura (80% threshold)
npm run test:all          # Suite completa de tests
npm run test:accessibility # Tests de accesibilidad
npm run test:performance  # Tests de rendimiento con Lighthouse
\`\`\`

### Calidad de Código
\`\`\`bash
npm run lint              # ESLint
npm run type-check        # TypeScript
npm run format            # Prettier
npm run audit             # Auditoría de seguridad
\`\`\`

## Despliegue

### Despliegue en Producción
\`\`\`bash
# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# O desplegar con Docker
docker build -t qtrack .
docker run -p 3000:3000 qtrack
\`\`\`

### Variables de Entorno
Variables de entorno clave para producción:

\`\`\`bash
# Base de datos
DATABASE_URL=postgresql://user:pass@host:5432/qtrack
REDIS_URL=redis://host:6379

# Autenticación
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-32-char-encryption-key

# Características IA
OPENAI_API_KEY=your-openai-key
AI_ENABLED=true

# Email
SMTP_HOST=smtp.example.com
SMTP_USER=your-email
SMTP_PASS=your-password
\`\`\`

## Contribuir

¡Damos la bienvenida a las contribuciones! Por favor consulta nuestra [Guía de Contribución](./CONTRIBUTING.es.md) para detalles.

### Flujo de Desarrollo
1. Hacer fork del repositorio
2. Crear una rama de característica (`git checkout -b feature/caracteristica-increible`)
3. Hacer tus cambios
4. Agregar tests para nueva funcionalidad
5. Asegurar que todos los tests pasen (`npm run test:all`)
6. Hacer commit de tus cambios (`git commit -m 'Agregar característica increíble'`)
7. Push a la rama (`git push origin feature/caracteristica-increible`)
8. Abrir un Pull Request

## Seguridad

QTrack toma la seguridad en serio. Por favor consulta nuestra [Política de Seguridad](./SECURITY.md) para reportar vulnerabilidades.

### Características de Seguridad
- **Autenticación**: Tokens JWT con mecanismo de refresh
- **Autorización**: Control de acceso basado en roles (RBAC)
- **Protección de Datos**: Encriptación en reposo y en tránsito
- **Validación de Entrada**: Sanitización comprehensiva de entrada
- **Limitación de Tasa**: Limitación de tasa para API y autenticación
- **Headers de Seguridad**: Headers de seguridad recomendados por OWASP

## Rendimiento

QTrack está optimizado para rendimiento:
- **Frontend**: División de código, carga perezosa, bundles optimizados
- **Backend**: Optimización de consultas de base de datos, estrategias de caché
- **Tiempo Real**: Conexiones WebSocket eficientes
- **CDN**: Optimización y entrega de assets estáticos

## Monitoreo

Monitoreo y observabilidad integrados:
- **Health Checks**: Monitoreo de salud de aplicación y dependencias
- **Métricas**: Métricas compatibles con Prometheus
- **Logging**: Logging estructurado con IDs de correlación
- **Tracing**: Soporte de tracing distribuido
- **Alertas**: Reglas de alerta configurables

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](./LICENSE) para detalles.

## Soporte

- **Documentación**: [docs.qtrack.dev](https://docs.qtrack.dev)
- **Comunidad**: [GitHub Discussions](https://github.com/qtrack/qtrack/discussions)
- **Issues**: [GitHub Issues](https://github.com/qtrack/qtrack/issues)
- **Email**: support@qtrack.dev

## Reconocimientos

- Construido con [Next.js](https://nextjs.org/) y [React](https://reactjs.org/)
- Componentes UI de [Radix UI](https://www.radix-ui.com/)
- Estilos con [Tailwind CSS](https://tailwindcss.com/)
- Iconos de [Lucide](https://lucide.dev/)
- IA impulsada por [OpenAI](https://openai.com/)

---

Hecho con ❤️ por el equipo QTrack
