# ✈️ Mapa 3D de Vuelos sobre España

Esta es una aplicación web interactiva que muestra vuelos en tiempo real sobre España y sus alrededores en un mapa 3D.  
Está desarrollada con [Next.js](https://nextjs.org) y [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction), utilizando datos de la API de [OpenSky Network](https://opensky-network.org/).

---

## 🧩 Funcionalidades

- Visualización de aviones en tiempo real sobre España y proximidades.
- Representación 3D de la geografía con terreno y cielo estrellado.
- Control de cámara con **OrbitControls** para rotar, acercar y alejar.
- Lista de vuelos clicables para centrar la cámara en un avión específico.
- Rotación realista del avión según su dirección (heading).
- Actualización automática de la posición de los aviones cada 10 segundos.
- Posibilidad de añadir múltiples aviones de la API OpenSky.

---

## ⚙️ Tecnologías utilizadas

- **Next.js** – framework React para SSR y rutas API.
- **React Three Fiber** – renderizado de gráficos 3D en React.
- **Three.js** – motor gráfico 3D.
- **Drei** – componentes auxiliares para React Three Fiber (OrbitControls, Stars, useGLTF).
- **TypeScript** – tipado seguro de datos.
- **OpenSky Network API** – fuente de datos en tiempo real de vuelos.
- **Tailwind CSS** – diseño responsivo y estilos rápidos.

---

## 🏁 Instalación y ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
Instala dependencias:

bash
Copia codice
npm install
# o
yarn
# o
pnpm install
Ejecuta la aplicación en modo desarrollo:

bash
Copia codice
npm run dev
# o
yarn dev
# o
pnpm dev
Abre http://localhost:3000 en tu navegador.

🗂 Estructura principal

/pages
  index.tsx           # Página principal con el Canvas 3D
  /api
    hello.ts          # Ruta de prueba API
/components
  FlightList.tsx      # Componente lista de vuelos
/ThreeD
  Airplane.tsx        # Componente de avión 3D
  Terrain.tsx         # Componente de terreno 3D
  SunController.tsx   # Control del sol/luz
/utils
  mapUtils.ts         # Funciones de conversión lat/lon a coordenadas 3D
  ```
## 🌐 API OpenSky
Se utiliza la API pública de OpenSky para obtener estados de vuelo.
Ejemplo de endpoint usado:

https://opensky-network.org/api/states/all?lamin=34.0&lomin=-12.0&lamax=45.0&lomax=6.0
lamin / lomin / lamax / lomax delimitan la región geográfica.

Se filtran vuelos sin coordenadas o sin altitud.

Se calcula la rotación realista del avión según true_track.

## 📌 Uso de la aplicación
Los aviones se muestran en el mapa 3D según su latitud, longitud y altitud.

En la lista lateral, haz clic en un avión para centrar la cámara en él.

Usa el ratón para rotar la cámara, acercar o alejar.

La posición de los aviones se actualiza automáticamente cada 10 segundos.

## 🚀 Despliegue
La forma más sencilla de desplegar la aplicación es mediante Vercel:

Conecta el repositorio de GitHub.

Selecciona el proyecto Next.js.

Vercel detectará automáticamente la configuración.

La app se actualizará en producción automáticamente con cada commit.

## 📚 Recursos
Documentación Next.js

React Three Fiber

Three.js

OpenSky Network API

Tailwind CSS