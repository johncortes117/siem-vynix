# Centinela - Proyecto SIEM

## Descripción General

Centinela es un proyecto de Sistema de Información y Gestión de Eventos de Seguridad (SIEM) diseñado para proporcionar una visión centralizada de la postura de seguridad de una organización. Recopila, analiza y correlaciona datos de eventos de diversas fuentes para identificar amenazas potenciales, actividades anómalas y vulnerabilidades de seguridad.

## Características Principales (Ejemplo)

*   **Recopilación de Logs Centralizada:** Agrega logs de múltiples fuentes (servidores, firewalls, aplicaciones, etc.).
*   **Correlación de Eventos en Tiempo Real:** Identifica patrones y relaciones entre eventos para detectar incidentes de seguridad.
*   **Visualización de Datos:** Paneles e informes intuitivos para monitorizar la actividad de seguridad.
*   **Gestión de Alertas:** Notificaciones configurables para eventos críticos.
*   **Análisis de Vulnerabilidades:** (Si aplica) Integración con herramientas de escaneo de vulnerabilidades.
*   **Generación de Informes:** Informes personalizables sobre el estado de la seguridad y cumplimiento.

## Tecnologías Utilizadas (Ejemplo)

*   **Frontend:** Next.js, TypeScript, Tailwind CSS, Shadcn/ui
*   **Backend:** (Especificar si aplica, ej: Node.js, Python, Wazuh API)
*   **Bases de Datos:** (Especificar si aplica)

## Primeros Pasos

### Prerrequisitos

*   Node.js (versión X.X.X o superior)
*   pnpm (o npm/yarn)
*   (Cualquier otro software o servicio necesario, ej: Wazuh Manager)

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://URL_DEL_REPOSITORIO_AQUI
    ```
2.  Navega al directorio del proyecto:
    ```bash
    cd siem-vynix
    ```
3.  Instala las dependencias:
    ```bash
    pnpm install
    ```
## Uso

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

PROYECTO DE SEGURIDAD INFORMATICA - CARRERA DE COMPUTACIÓN - UPEC