# Contribuir a QTrack

¡Gracias por tu interés en contribuir a QTrack! Este documento proporciona pautas e información para contribuidores.

## Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Comenzando](#comenzando)
3. [Configuración de Desarrollo](#configuración-de-desarrollo)
4. [Pautas de Contribución](#pautas-de-contribución)
5. [Proceso de Pull Request](#proceso-de-pull-request)
6. [Estándares de Código](#estándares-de-código)
7. [Requisitos de Testing](#requisitos-de-testing)
8. [Documentación](#documentación)

## Código de Conducta

Estamos comprometidos a proporcionar un ambiente acogedor e inclusivo para todos los contribuidores. Por favor lee y sigue nuestro Código de Conducta.

### Nuestros Estándares

- Usar lenguaje acogedor e inclusivo
- Ser respetuoso de diferentes puntos de vista y experiencias
- Aceptar graciosamente críticas constructivas
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

## Comenzando

### Prerrequisitos

- Node.js 18.0 o superior
- PostgreSQL 13.0 o superior
- Redis 6.0 o superior
- Git

### Configuración de Desarrollo

1. **Fork y Clonar**
   \`\`\`bash
   git clone https://github.com/tu-usuario/qtrack.git
   cd qtrack
   \`\`\`

2. **Instalar Dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configuración de Entorno**
   \`\`\`bash
   cp .env.example .env
   # Editar .env con tu configuración
   \`\`\`

4. **Configuración de Base de Datos**
   \`\`\`bash
   npm run db:migrate
   npm run db:seed
   \`\`\`

5. **Iniciar Servidor de Desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

## Pautas de Contribución

### Tipos de Contribuciones

Damos la bienvenida a varios tipos de contribuciones:

- **Reportes de Bugs**: Ayúdanos a identificar y corregir problemas
- **Solicitudes de Características**: Sugiere nuevas características o mejoras
- **Contribuciones de Código**: Envía correcciones de bugs o nuevas características
- **Documentación**: Mejora o agrega documentación
- **Testing**: Agrega o mejora la cobertura de tests
- **Diseño**: Mejoras y sugerencias de UI/UX

### Antes de Comenzar

1. **Verificar Issues Existentes**: Busca issues o discusiones existentes
2. **Crear un Issue**: Para cambios significativos, crea un issue primero
3. **Discutir**: Interactúa con mantenedores y miembros de la comunidad
4. **Planificar**: Describe tu enfoque antes de codificar

### Convención de Nombres de Ramas

Usa nombres de ramas descriptivos:
- `feature/analisis-ia-tickets`
- `bugfix/error-validacion-login`
- `docs/actualizacion-documentacion-api`
- `refactor/servicio-autenticacion`

## Proceso de Pull Request

### 1. Preparación

\`\`\`bash
# Crear rama de característica
git checkout -b feature/nombre-de-tu-caracteristica

# Hacer tus cambios
# ... cambios de código ...

# Ejecutar tests
npm run test
npm run test:e2e

# Ejecutar linting
npm run lint:fix

# Build del proyecto
npm run build
\`\`\`

### 2. Pautas de Commit

Sigue el formato de commit convencional:

\`\`\`
tipo(alcance): descripción

[cuerpo opcional]

[pie opcional]
\`\`\`

**Tipos:**
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios de documentación
- `style`: Cambios de estilo de código (formateo, etc.)
- `refactor`: Refactorización de código
- `test`: Agregar o actualizar tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
\`\`\`
feat(tickets): agregar clasificación de tickets impulsada por IA

fix(auth): resolver error de validación de login para caracteres especiales

docs(api): actualizar documentación de endpoint de autenticación

test(tickets): agregar tests unitarios para flujo de creación de tickets
\`\`\`

### 3. Template de Pull Request

Al crear un pull request, incluye:

\`\`\`markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de Cambio
- [ ] Corrección de bug (cambio no disruptivo que corrige un problema)
- [ ] Nueva característica (cambio no disruptivo que agrega funcionalidad)
- [ ] Cambio disruptivo (corrección o característica que causaría que funcionalidad existente no funcione como se esperaba)
- [ ] Actualización de documentación

## Testing
- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] Tests E2E pasan
- [ ] Testing manual completado

## Capturas de Pantalla (si aplica)
Agregar capturas de pantalla para cambios de UI.

## Checklist
- [ ] El código sigue las pautas de estilo del proyecto
- [ ] Auto-revisión completada
- [ ] El código está comentado donde es necesario
- [ ] Documentación actualizada
- [ ] Tests agregados/actualizados
- [ ] Sin cambios disruptivos (o claramente documentados)
\`\`\`

### 4. Proceso de Revisión

1. **Verificaciones Automatizadas**: El pipeline CI/CD se ejecuta automáticamente
2. **Revisión de Código**: Los mantenedores revisan tu código
3. **Feedback**: Aborda cualquier cambio solicitado
4. **Aprobación**: Una vez aprobado, tu PR será fusionado

## Estándares de Código

### TypeScript/JavaScript

\`\`\`typescript
// Usar TypeScript para seguridad de tipos
interface DatosTicket {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  asignadoId?: string;
}

// Usar nombres de variables significativos
const esTicketVencido = (ticket: Ticket): boolean => {
  return ticket.fechaVencimiento && new Date(ticket.fechaVencimiento) < new Date();
};

// Agregar comentarios JSDoc para funciones complejas
/**
 * Calcula el puntaje de prioridad para clasificación de tickets basada en IA
 * @param contenido - El contenido del ticket a analizar
 * @param metadata - Metadata adicional del ticket
 * @returns Puntaje de prioridad entre 0-100
 */
async function calcularPuntajePrioridad(
  contenido: string, 
  metadata: MetadataTicket
): Promise<number> {
  // Implementación
}
\`\`\`

### Componentes React

\`\`\`tsx
// Usar componentes funcionales con TypeScript
interface PropsTarjetaTicket {
  ticket: Ticket;
  alActualizar: (ticket: Ticket) => void;
  className?: string;
}

export const TarjetaTicket: React.FC<PropsTarjetaTicket> = ({ 
  ticket, 
  alActualizar, 
  className 
}) => {
  // Usar nombres de estado significativos
  const [estaEditando, setEstaEditando] = useState(false);
  const [estaCargando, setEstaCargando] = useState(false);

  // Extraer lógica compleja a hooks personalizados
  const { actualizarTicket, estaActualizando } = useMutacionTicket();

  return (
    <Card className={cn("tarjeta-ticket", className)}>
      {/* JSX del componente */}
    </Card>
  );
};
\`\`\`

### CSS/Estilos

\`\`\`css
/* Usar clases de Tailwind CSS principalmente */
.tarjeta-ticket {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

/* Usar propiedades personalizadas CSS para temas */
:root {
  --color-primario: #3b82f6;
  --color-exito: #10b981;
  --color-advertencia: #f59e0b;
  --color-peligro: #ef4444;
}

/* Seguir metodología BEM para CSS personalizado */
.lista-tickets__item {
  /* Estilos */
}

.lista-tickets__item--seleccionado {
  /* Estilos de modificador */
}
\`\`\`

## Requisitos de Testing

### Tests Unitarios

\`\`\`typescript
// components/__tests__/TarjetaTicket.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TarjetaTicket } from '../TarjetaTicket';

describe('TarjetaTicket', () => {
  const ticketMock = {
    id: '1',
    titulo: 'Ticket de Prueba',
    estado: 'ABIERTO',
    prioridad: 'ALTA'
  };

  it('renderiza información del ticket correctamente', () => {
    render(<TarjetaTicket ticket={ticketMock} alActualizar={jest.fn()} />);
    
    expect(screen.getByText('Ticket de Prueba')).toBeInTheDocument();
    expect(screen.getByText('ALTA')).toBeInTheDocument();
  });

  it('llama alActualizar cuando el ticket es modificado', () => {
    const mockAlActualizar = jest.fn();
    render(<TarjetaTicket ticket={ticketMock} alActualizar={mockAlActualizar} />);
    
    fireEvent.click(screen.getByRole('button', { name: /editar/i }));
    // ... implementación del test
  });
});
\`\`\`

### Tests de Integración

\`\`\`typescript
// api/__tests__/tickets.integration.test.ts
import request from 'supertest';
import app from '../app';

describe('API de Tickets', () => {
  it('debería crear un nuevo ticket', async () => {
    const datosTicket = {
      titulo: 'Ticket de Prueba de Integración',
      descripcion: 'Descripción de prueba',
      prioridad: 'MEDIA'
    };

    const respuesta = await request(app)
      .post('/api/tickets')
      .send(datosTicket)
      .expect(201);

    expect(respuesta.body.ticket.titulo).toBe(datosTicket.titulo);
  });
});
\`\`\`

### Tests E2E

\`\`\`typescript
// e2e/flujo-tickets.spec.ts
import { test, expect } from '@playwright/test';

test('flujo completo de tickets', async ({ page }) => {
  await page.goto('/tickets');
  
  // Crear ticket
  await page.click('[data-testid="boton-nuevo-ticket"]');
  await page.fill('[data-testid="titulo-ticket"]', 'Ticket de Prueba E2E');
  await page.click('[data-testid="boton-crear"]');
  
  // Verificar creación
  await expect(page.locator('text=Ticket de Prueba E2E')).toBeVisible();
});
\`\`\`

### Requisitos de Cobertura de Tests

- **Tests Unitarios**: Cobertura mínima del 80%
- **Tests de Integración**: Cubrir todos los endpoints de API
- **Tests E2E**: Cubrir flujos críticos de usuario
- **Tests de Componentes**: Probar interacciones de usuario y casos límite

## Documentación

### Documentación de Código

\`\`\`typescript
/**
 * Servicio para gestionar operaciones de tickets con integración IA
 */
export class ServicioTicket {
  /**
   * Crea un nuevo ticket con análisis IA
   * @param datosTicket - La información del ticket
   * @param opciones - Opciones adicionales para creación de ticket
   * @returns Promise que resuelve al ticket creado con insights IA
   * @throws {ErrorValidacion} Cuando los datos del ticket son inválidos
   * @throws {ErrorServicioIA} Cuando el análisis IA falla
   */
  async crearTicket(
    datosTicket: DatosCrearTicket,
    opciones: OpcionesCreacionTicket = {}
  ): Promise<TicketConInsightsIA> {
    // Implementación
  }
}
\`\`\`

### Documentación de API

Usar OpenAPI/Swagger para documentación de API:

\`\`\`yaml
# api-docs.yaml
paths:
  /api/tickets:
    post:
      summary: Crear un nuevo ticket
      description: Crea un nuevo ticket con análisis IA opcional
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SolicitudCrearTicket'
      responses:
        201:
          description: Ticket creado exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RespuestaTicket'
\`\`\`

### Actualizaciones de README

Al agregar nuevas características, actualiza las secciones relevantes del README:
- Instrucciones de instalación
- Opciones de configuración
- Ejemplos de uso
- Cambios de API

## Proceso de Release

### Numeración de Versiones

Seguimos [Versionado Semántico](https://semver.org/):
- **MAJOR**: Cambios disruptivos
- **MINOR**: Nuevas características (compatible hacia atrás)
- **PATCH**: Correcciones de bugs (compatible hacia atrás)

### Checklist de Release

- [ ] Todos los tests pasando
- [ ] Documentación actualizada
- [ ] CHANGELOG.md actualizado
- [ ] Versión incrementada en package.json
- [ ] Tag de Git creado
- [ ] Notas de release preparadas

## Obtener Ayuda

### Recursos

- **Documentación**: Consulta el directorio `/docs`
- **Issues**: Busca issues existentes en GitHub
- **Discusiones**: Usa GitHub Discussions para preguntas
- **Discord**: Únete a nuestro servidor Discord de la comunidad

### Hacer Preguntas

Al pedir ayuda:
1. **Buscar Primero**: Consulta issues existentes y documentación
2. **Proporcionar Contexto**: Incluye código relevante, mensajes de error y detalles del entorno
3. **Ser Específico**: Describe claramente el problema y comportamiento esperado
4. **Incluir Pasos**: Proporciona pasos para reproducir el problema

### Reportar Bugs

Usa el template de reporte de bugs:

\`\`\`markdown
**Descripción del Bug**
Una descripción clara del bug.

**Pasos para Reproducir**
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

**Comportamiento Esperado**
Lo que esperabas que pasara.

**Capturas de Pantalla**
Si aplica, agregar capturas de pantalla.

**Entorno**
- SO: [ej., macOS, Windows, Linux]
- Navegador: [ej., Chrome, Firefox, Safari]
- Versión Node.js: [ej., 18.17.0]
- Versión QTrack: [ej., 1.2.3]
\`\`\`

## Reconocimiento

Los contribuidores serán reconocidos en:
- Archivo CONTRIBUTORS.md
- Notas de release
- Documentación del proyecto
- Destacados de la comunidad

¡Gracias por contribuir a QTrack! Tus esfuerzos ayudan a hacer este proyecto mejor para todos.
