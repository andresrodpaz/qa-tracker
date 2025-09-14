# Guía de Despliegue - QTrack

## 1. Resumen

Esta guía proporciona instrucciones completas para desplegar QTrack en diferentes entornos, desde desarrollo local hasta producción empresarial.

## 2. Requisitos del Sistema

### 2.1 Requisitos Mínimos
- **CPU**: 2 cores, 2.4 GHz
- **RAM**: 4 GB
- **Almacenamiento**: 20 GB SSD
- **Red**: 100 Mbps
- **OS**: Ubuntu 20.04+, CentOS 8+, Windows Server 2019+

### 2.2 Requisitos Recomendados (Producción)
- **CPU**: 4+ cores, 3.0 GHz
- **RAM**: 16+ GB
- **Almacenamiento**: 100+ GB SSD NVMe
- **Red**: 1 Gbps
- **OS**: Ubuntu 22.04 LTS

### 2.3 Dependencias de Software
- **Node.js**: 18.x o superior
- **Docker**: 24.x o superior
- **Docker Compose**: 2.x o superior
- **PostgreSQL**: 15.x o superior (si no usa Docker)
- **Redis**: 7.x o superior (si no usa Docker)

## 3. Despliegue con Docker (Recomendado)

### 3.1 Configuración Rápida
\`\`\`bash
# 1. Clonar repositorio
git clone https://github.com/your-org/qtrack.git
cd qtrack

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con sus configuraciones

# 3. Levantar servicios
docker-compose up -d

# 4. Verificar estado
docker-compose ps
\`\`\`

### 3.2 Servicios Incluidos
- **qtrack**: Aplicación principal (Puerto 3000)
- **postgres**: Base de datos PostgreSQL (Puerto 5432)
- **redis**: Cache y sesiones (Puerto 6379)
- **nginx**: Proxy reverso (Puerto 80/443)
- **prometheus**: Métricas (Puerto 9090)
- **grafana**: Dashboards (Puerto 3001)

### 3.3 Configuración de Variables de Entorno
\`\`\`bash
# Base de datos
DATABASE_URL=postgresql://qtrack:password@postgres:5432/qtrack
REDIS_URL=redis://redis:6379

# Aplicación
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Monitoreo
PROMETHEUS_ENABLED=true
GRAFANA_ADMIN_PASSWORD=admin123

# Seguridad
SESSION_SECRET=your-session-secret
ENCRYPTION_KEY=your-encryption-key
\`\`\`

## 4. Despliegue Manual

### 4.1 Preparación del Entorno
\`\`\`bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Instalar Redis
sudo apt-get install redis-server
\`\`\`

### 4.2 Configuración de Base de Datos
\`\`\`sql
-- Crear usuario y base de datos
CREATE USER qtrack WITH PASSWORD 'secure_password';
CREATE DATABASE qtrack OWNER qtrack;
GRANT ALL PRIVILEGES ON DATABASE qtrack TO qtrack;
\`\`\`

### 4.3 Instalación de la Aplicación
\`\`\`bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con configuraciones de producción

# Ejecutar migraciones
npm run db:migrate

# Sembrar datos iniciales
npm run db:seed

# Construir aplicación
npm run build

# Iniciar en producción
npm start
\`\`\`

## 5. Configuración de Nginx

### 5.1 Configuración Básica
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

### 5.2 Configuración SSL
\`\`\`bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d your-domain.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
\`\`\`

## 6. Despliegue en Kubernetes

### 6.1 Configuración de Namespace
\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: qtrack
\`\`\`

### 6.2 Deployment Principal
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qtrack-app
  namespace: qtrack
spec:
  replicas: 3
  selector:
    matchLabels:
      app: qtrack
  template:
    metadata:
      labels:
        app: qtrack
    spec:
      containers:
      - name: qtrack
        image: qtrack:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: qtrack-secrets
              key: database-url
\`\`\`

### 6.3 Servicio y Ingress
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: qtrack-service
  namespace: qtrack
spec:
  selector:
    app: qtrack
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: qtrack-ingress
  namespace: qtrack
spec:
  rules:
  - host: qtrack.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: qtrack-service
            port:
              number: 80
\`\`\`

## 7. Monitoreo y Logging

### 7.1 Configuración de Prometheus
\`\`\`yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'qtrack'
    static_configs:
      - targets: ['localhost:3000']
\`\`\`

### 7.2 Dashboards de Grafana
- **Sistema**: CPU, memoria, disco, red
- **Aplicación**: Requests/s, tiempo de respuesta, errores
- **Base de Datos**: Conexiones, queries, performance
- **Usuarios**: Sesiones activas, acciones por minuto

### 7.3 Alertas
\`\`\`yaml
# alertmanager.yml
groups:
- name: qtrack
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    annotations:
      summary: "Alta tasa de errores en QTrack"
\`\`\`

## 8. Backup y Recuperación

### 8.1 Backup Automatizado
\`\`\`bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/qtrack"

# Backup de base de datos
pg_dump -h localhost -U qtrack qtrack > $BACKUP_DIR/db_$DATE.sql

# Backup de archivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /app/uploads

# Limpiar backups antiguos (>30 días)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
\`\`\`

### 8.2 Procedimiento de Recuperación
\`\`\`bash
# Restaurar base de datos
psql -h localhost -U qtrack -d qtrack < backup_file.sql

# Restaurar archivos
tar -xzf files_backup.tar.gz -C /

# Reiniciar servicios
docker-compose restart
\`\`\`

## 9. Seguridad

### 9.1 Configuración de Firewall
\`\`\`bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
\`\`\`

### 9.2 Configuración SSL/TLS
- Usar certificados válidos (Let's Encrypt recomendado)
- Configurar HSTS headers
- Implementar CSP (Content Security Policy)
- Usar HTTPS para todas las comunicaciones

### 9.3 Hardening del Sistema
\`\`\`bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Configurar fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban

# Deshabilitar root login SSH
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
\`\`\`

## 10. Troubleshooting

### 10.1 Problemas Comunes

#### Error de Conexión a Base de Datos
\`\`\`bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Verificar logs
sudo tail -f /var/log/postgresql/postgresql-*.log

# Probar conexión
psql -h localhost -U qtrack -d qtrack
\`\`\`

#### Problemas de Memoria
\`\`\`bash
# Verificar uso de memoria
free -h
docker stats

# Limpiar cache de Docker
docker system prune -a
\`\`\`

#### Problemas de Red
\`\`\`bash
# Verificar puertos
netstat -tlnp | grep :3000

# Verificar conectividad
curl -I http://localhost:3000
\`\`\`

### 10.2 Logs Importantes
- **Aplicación**: `/var/log/qtrack/app.log`
- **Nginx**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **PostgreSQL**: `/var/log/postgresql/postgresql-*.log`
- **Docker**: `docker-compose logs -f`

## 11. Mantenimiento

### 11.1 Tareas Regulares
- **Diario**: Verificar logs y métricas
- **Semanal**: Actualizar dependencias menores
- **Mensual**: Backup completo y prueba de restauración
- **Trimestral**: Actualización de seguridad y revisión de configuración

### 11.2 Actualizaciones
\`\`\`bash
# Actualizar aplicación
git pull origin main
npm install
npm run build
docker-compose up -d --build

# Verificar estado
docker-compose ps
curl -I http://localhost:3000/health
\`\`\`

---

**Versión del Documento**: 2.0  
**Última Actualización**: Diciembre 2024  
**Próxima Revisión**: Marzo 2025
