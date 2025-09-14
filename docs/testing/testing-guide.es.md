# Guía de Pruebas - QTrack

## 1. Introducción

Esta guía proporciona instrucciones completas para ejecutar todas las pruebas en QTrack, desde pruebas unitarias hasta pruebas de rendimiento y seguridad.

## 2. Configuración del Entorno de Pruebas

### 2.1 Requisitos Previos
\`\`\`bash
# Instalar dependencias
npm install

# Configurar variables de entorno de prueba
cp .env.test.example .env.test

# Instalar navegadores para Playwright
npx playwright install
\`\`\`

### 2.2 Estructura de Pruebas
\`\`\`
tests/
├── api/                 # Pruebas de API (Jest)
├── e2e/                 # Pruebas End-to-End (Playwright)
├── unit/                # Pruebas unitarias (Vitest)
├── integration/         # Pruebas de integración
├── performance/         # Pruebas de rendimiento
└── security/           # Pruebas de seguridad
\`\`\`

## 3. Pruebas Unitarias (Vitest)

### 3.1 Ejecutar Pruebas Unitarias
\`\`\`bash
# Ejecutar todas las pruebas unitarias
npm run test

# Con interfaz visual
npm run test:ui

# Con cobertura de código
npm run test:coverage

# Modo watch para desarrollo
npm run test:watch

# Ejecutar pruebas específicas
npm run test -- auth
npm run test -- components/login
\`\`\`

### 3.2 Configuración de Cobertura
- **Threshold mínimo**: 80%
- **Archivos incluidos**: `src/**/*.{ts,tsx}`
- **Archivos excluidos**: `src/**/*.d.ts`, `src/test/**/*`

### 3.3 Ejemplo de Prueba Unitaria
\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/auth/login-form'

describe('LoginForm', () => {
  it('should render login form correctly', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    render(<LoginForm />)
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })
})
\`\`\`

## 4. Pruebas End-to-End (Playwright)

### 4.1 Ejecutar Pruebas E2E
\`\`\`bash
# Ejecutar todas las pruebas E2E
npm run test:e2e

# Con interfaz visual
npm run test:e2e:ui

# En modo headed (ver navegador)
npm run test:e2e:headed

# Modo debug
npm run test:e2e:debug

# Ejecutar en navegador específico
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
\`\`\`

### 4.2 Configuración de Navegadores
- **Chromium**: Pruebas principales
- **Firefox**: Compatibilidad cross-browser
- **WebKit**: Compatibilidad Safari
- **Mobile Chrome**: Pruebas móviles
- **Mobile Safari**: Pruebas iOS

### 4.3 Ejemplo de Prueba E2E
\`\`\`typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid="email"]', 'admin@qtrack.com')
    await page.fill('[data-testid="password"]', 'admin123')
    await page.click('[data-testid="login-button"]')
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[data-testid="email"]', 'invalid@email.com')
    await page.fill('[data-testid="password"]', 'wrongpassword')
    await page.click('[data-testid="login-button"]')
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials')
  })
})
\`\`\`

## 5. Pruebas de API (Jest)

### 5.1 Ejecutar Pruebas de API
\`\`\`bash
# Ejecutar todas las pruebas de API
npm run test:api

# Con cobertura
npm run test:api:coverage

# Ejecutar pruebas específicas
npm run test:api -- tickets
npm run test:api -- auth
\`\`\`

### 5.2 Ejemplo de Prueba de API
\`\`\`typescript
import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/tickets'

describe('/api/tickets', () => {
  it('should return tickets for authenticated user', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token'
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty('tickets')
    expect(Array.isArray(data.tickets)).toBe(true)
  })

  it('should create new ticket with valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        authorization: 'Bearer valid-token',
        'content-type': 'application/json'
      },
      body: {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: 'HIGH',
        type: 'BUG'
      }
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(201)
    const data = JSON.parse(res._getData())
    expect(data.ticket).toHaveProperty('id')
    expect(data.ticket.title).toBe('Test Ticket')
  })
})
\`\`\`

## 6. Pruebas de Integración

### 6.1 Ejecutar Pruebas de Integración
\`\`\`bash
# Ejecutar pruebas de integración
npm run test:integration

# Con base de datos de prueba
npm run test:integration:db
\`\`\`

### 6.2 Configuración de Base de Datos de Prueba
\`\`\`bash
# Crear base de datos de prueba
createdb qtrack_test

# Ejecutar migraciones
DATABASE_URL=postgresql://user:pass@localhost:5432/qtrack_test npm run db:migrate

# Sembrar datos de prueba
DATABASE_URL=postgresql://user:pass@localhost:5432/qtrack_test npm run db:seed:test
\`\`\`

## 7. Pruebas de Rendimiento

### 7.1 Lighthouse CI
\`\`\`bash
# Ejecutar auditoría de rendimiento
npm run test:performance

# Generar reporte detallado
npm run lighthouse:report
\`\`\`

### 7.2 Métricas de Rendimiento
- **Performance Score**: >90
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3.0s

### 7.3 Pruebas de Carga
\`\`\`bash
# Instalar Artillery
npm install -g artillery

# Ejecutar pruebas de carga
artillery run tests/load/load-test.yml

# Generar reporte
artillery run --output report.json tests/load/load-test.yml
artillery report report.json
\`\`\`

## 8. Pruebas de Accesibilidad

### 8.1 Ejecutar Pruebas de Accesibilidad
\`\`\`bash
# Pruebas automáticas de accesibilidad
npm run test:accessibility

# Con axe-core
npm run test:axe
\`\`\`

### 8.2 Estándares de Accesibilidad
- **WCAG 2.1 Level AA**: Cumplimiento completo
- **Contraste de color**: Ratio mínimo 4.5:1
- **Navegación por teclado**: Soporte completo
- **Screen readers**: Compatibilidad con NVDA, JAWS, VoiceOver

### 8.3 Ejemplo de Prueba de Accesibilidad
\`\`\`typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/dashboard')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should be navigable with keyboard', async ({ page }) => {
    await page.goto('/login')
    
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="email"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="password"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="login-button"]')).toBeFocused()
  })
})
\`\`\`

## 9. Pruebas de Seguridad

### 9.1 Ejecutar Pruebas de Seguridad
\`\`\`bash
# Auditoría de dependencias
npm audit

# Pruebas de seguridad con Snyk
npm run test:security

# Análisis estático de código
npm run test:security:static
\`\`\`

### 9.2 Verificaciones de Seguridad
- **Dependencias vulnerables**: 0 vulnerabilidades críticas/altas
- **Inyección SQL**: Prevención con consultas parametrizadas
- **XSS**: Sanitización de entrada y CSP headers
- **CSRF**: Tokens CSRF en formularios
- **Autenticación**: 2FA y políticas de contraseñas fuertes

## 10. Pruebas de Regresión

### 10.1 Suite de Regresión Completa
\`\`\`bash
# Ejecutar todas las pruebas de regresión
npm run test:regression

# Suite rápida (smoke tests)
npm run test:smoke

# Suite completa (todas las pruebas)
npm run test:full
\`\`\`

### 10.2 Automatización en CI/CD
\`\`\`yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Run security tests
        run: npm run test:security
\`\`\`

## 11. Reportes y Métricas

### 11.1 Generación de Reportes
\`\`\`bash
# Reporte de cobertura HTML
npm run test:coverage:html

# Reporte de Playwright
npm run test:e2e:report

# Reporte consolidado
npm run test:report
\`\`\`

### 11.2 Métricas de Calidad
- **Cobertura de código**: >90%
- **Tasa de éxito de pruebas**: >98%
- **Tiempo de ejecución**: <10 minutos suite completa
- **Flakiness rate**: <2%

## 12. Debugging y Troubleshooting

### 12.1 Debug de Pruebas Unitarias
\`\`\`bash
# Ejecutar con debugger
npm run test:debug

# Ejecutar prueba específica con logs
npm run test -- --reporter=verbose auth.test.ts
\`\`\`

### 12.2 Debug de Pruebas E2E
\`\`\`bash
# Modo debug con Playwright
npm run test:e2e:debug

# Generar screenshots en fallos
npm run test:e2e -- --screenshot=only-on-failure

# Generar videos
npm run test:e2e -- --video=retain-on-failure
\`\`\`

### 12.3 Problemas Comunes

#### Pruebas Flaky
\`\`\`typescript
// Usar waitFor para elementos dinámicos
await page.waitForSelector('[data-testid="loading"]', { state: 'hidden' })
await page.waitForSelector('[data-testid="content"]', { state: 'visible' })

// Retry automático para operaciones inestables
await expect(async () => {
  await page.click('[data-testid="submit"]')
  await expect(page.locator('[data-testid="success"]')).toBeVisible()
}).toPass({ timeout: 10000 })
\`\`\`

#### Timeouts
\`\`\`typescript
// Aumentar timeout para operaciones lentas
test('slow operation', async ({ page }) => {
  test.setTimeout(60000) // 60 segundos
  
  await page.goto('/slow-page')
  await expect(page.locator('[data-testid="result"]')).toBeVisible({ timeout: 30000 })
})
\`\`\`

---

**Versión del Documento**: 2.0  
**Última Actualización**: Diciembre 2024  
**Próxima Revisión**: Marzo 2025
