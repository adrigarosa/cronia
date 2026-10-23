# Especificación funcional y técnica

## Aplicación personal de organización y seguimiento

**Versión:** 1.0\
**Fecha:** 21 de octubre de 2026\
**Estado:** Especificación inicial acordada

------------------------------------------------------------------------

## 1. Descripción general

La aplicación es una herramienta personal de organización que reúne
cuatro funciones en un solo lugar:

1.  Gestor de tareas (TODO).
2.  Notas breves.
3.  Agenda de citas y eventos.
4.  Seguimiento de hábitos.

Los registros de estos cuatro tipos se mostrarán en una **cronología
unificada**, ordenados secuencialmente según los criterios de fecha y
ordenación que se definan en la interfaz.

La aplicación está pensada para un único usuario y debe poder utilizarse
sin conexión a Internet. También incluirá búsquedas, filtros y un
apartado de seguimiento con estadísticas por día, semana, mes y año.

### Objetivos principales

-   Centralizar tareas, notas, citas y hábitos.
-   Crear y consultar registros rápidamente.
-   Clasificar registros mediante categorías.
-   Buscar y filtrar el historial.
-   Consultar el progreso de tareas y hábitos.
-   Analizar la actividad a lo largo del tiempo.
-   Mantener los datos almacenados localmente y disponibles sin
    conexión.

## 2. Plataformas y entorno de desarrollo

### Equipo de desarrollo disponible

-   **Sistema operativo:** Windows 11.
-   **Procesador:** AMD Ryzen 7 8745HS con gráficos Radeon 780M.
-   **Memoria RAM:** 16 GB.
-   **Gráficos:** AMD Radeon 780M integrada.
-   **Almacenamiento:** SSD.
-   **Dispositivo de pruebas:** teléfono Android.
-   **Experiencia de programación:** intermedia.

### Tecnologías recomendadas

  -----------------------------------------------------------------------
  Área                    Tecnología propuesta    Uso
  ----------------------- ----------------------- -----------------------
  Aplicación              React Native con Expo   Desarrollo
                                                  multiplataforma

  Lenguaje                TypeScript              Tipado, mantenibilidad
                                                  y detección temprana de
                                                  errores

  Editor                  Visual Studio Code      Codificación y
                                                  depuración

  Navegación              Expo Router             Organización de
                                                  pantallas y rutas

  Persistencia móvil      SQLite mediante         Guardado local sin
                          `expo-sqlite`           servidor

  Diseño de interfaz      Figma, opcional         Prototipos y diseño de
                                                  pantallas

  Pruebas en Android      Expo Go inicialmente;   Vista previa y pruebas
                          development build       en dispositivo
                          cuando haga falta       

  Pruebas web             Navegador moderno       Comprobación de la
                                                  interfaz web

  Control de versiones    Git                     Historial y
                                                  recuperación de cambios

  Gráficos                Librería compatible con Visualización de
                          React Native y web, a   estadísticas
                          seleccionar durante la  
                          implementación          
  -----------------------------------------------------------------------

### Flujo de desarrollo

1.  Diseñar o ajustar una pantalla.
2.  Implementarla en TypeScript.
3.  Ejecutar el servidor de desarrollo de Expo.
4.  Visualizar los cambios en el teléfono Android mediante Expo Go
    cuando sean compatibles.
5.  Verificar la versión web en un navegador.
6.  Ejecutar pruebas y corregir errores.
7.  Guardar los cambios en Git.

Android Studio se podrá instalar como herramienta complementaria para
acceder al SDK de Android, ADB, registros nativos y emulador. No es
necesario mantener el emulador abierto durante el desarrollo cotidiano.

### Consideraciones de compatibilidad

-   El proyecto se desarrollará desde Windows 11.
-   Android y web son las plataformas objetivo.
-   La versión web debe probarse específicamente para confirmar su
    persistencia local y funcionamiento offline.
-   Expo SQLite ofrece soporte web con requisitos de configuración
    distintos a los de Android; la estrategia definitiva de
    almacenamiento web debe validarse con un prototipo.
-   No se requiere compilación nativa de iOS en la primera etapa.
-   Expo Go sirve para comenzar, pero algunas capacidades nativas pueden
    requerir una development build.

## 3. Principios funcionales

-   **Un único usuario:** no se requiere registro, inicio de sesión ni
    gestión de múltiples cuentas.
-   **Offline-first:** las funciones principales y los datos deben estar
    disponibles sin conexión.
-   **Persistencia local:** los registros deben conservarse al cerrar y
    volver a abrir la aplicación.
-   **Cronología unificada:** tareas, notas, eventos y registros de
    hábitos se consultan en un mismo listado.
-   **Tipos diferenciados:** cada tipo conserva sus propios campos y
    estados.
-   **Categorías compartidas:** los registros pueden asociarse a una o
    varias categorías.
-   **Historial:** los cambios de estado y los cumplimientos deben
    permitir obtener estadísticas coherentes.
-   **Sin mapas:** no se mostrarán mapas ni se integrarán servicios de
    geolocalización. El lugar de un evento será texto libre.

## 4. Tipos de registro

### 4.1 Tareas (TODO)

Las tareas representan acciones que el usuario debe realizar.

**Campos previstos:** - Identificador único. - Descripción. - Fecha de
creación. - Fecha límite o vencimiento, opcional. - Una o varias
categorías. - Estado. - Fecha de finalización, cuando corresponda. -
Prioridad, opcional; pendiente de confirmar.

**Estados acordados:** - Sin iniciar. - Iniciada o en progreso. -
Eliminada. - Culminada.

La eliminación debe tratarse de forma coherente con el historial y las
estadísticas. Se recomienda conservar las tareas eliminadas como
registros marcados como eliminados, en vez de borrarlas físicamente,
salvo que el usuario solicite su eliminación definitiva.

### 4.2 Notas breves

Las notas permiten guardar información rápida, ideas o reflexiones.

**Campos previstos:** - Identificador único. - Contenido o
descripción. - Fecha de creación. - Una o varias categorías. -
Clasificación de la nota.

**Clasificaciones acordadas:** - Importante. - Anécdota. -
Recordatorio. - Reflexión.

Estas clasificaciones son tipos o etiquetas de nota, no estados
equivalentes a los estados de las tareas.

### 4.3 Citas y eventos

Los eventos representan compromisos con una fecha y una hora de inicio y
fin.

**Campos acordados:** - Identificador único. - Descripción. - Fecha de
inicio. - Hora de inicio. - Fecha de fin. - Hora de fin. - Lugar en
texto libre, opcional. - Una o varias categorías. - Estado.

El lugar puede contener valores como «Oficina», «Casa», una dirección
escrita o «Google Meet». No habrá mapa, vista cartográfica,
geolocalización ni integración obligatoria con servicios externos.

**Estados acordados:** - Próximamente. - En curso. - Realizado o
culminado. - Cancelado, cuando el evento no se efectúe.

**Reglas recomendadas:** - «Próximamente» y «En curso» pueden derivarse
de la fecha y hora actuales. - «Realizado» y «Cancelado» deben reflejar
el resultado del evento y no inferirse únicamente a partir del reloj. -
Los eventos futuros no deben contabilizarse como incumplidos. - Deben
validarse las fechas y horas para evitar un fin anterior al inicio.

La forma exacta de gestionar eventos que terminan sin que el usuario
indique si se realizaron queda pendiente de concretar.

### 4.4 Hábitos y cumplimientos diarios

Se distinguirá entre la definición de un hábito y sus registros de
cumplimiento diarios.

**Definición del hábito:** - Identificador único. - Nombre o
descripción. - Una o varias categorías. - Fecha de inicio. - Frecuencia
o días previstos, si se configura. - Estado activo/inactivo para indicar
si se sigue haciendo seguimiento.

**Registro diario de cumplimiento:** - Identificador único. - Hábito
asociado. - Fecha local a la que corresponde. - Estado del día. - Fecha
y hora de creación o modificación, si procede. - Nota opcional, si se
decide incluirla.

**Estados acordados:** - Realizado. - Por realizar. - No realizado.

**Regla de fin de día:**

Si un hábito estaba previsto para un día y el usuario no registra su
cumplimiento, ese día debe pasar a «No realizado» al finalizar el día.

Como los sistemas operativos móviles pueden suspender una aplicación y
no garantizan que el código se ejecute exactamente a medianoche, la
aplicación debe reconciliar los días pendientes cuando vuelva a abrirse.
Puede añadirse una tarea en segundo plano como mejora, pero no debe ser
el único mecanismo que garantice la regla.

Se deben definir la zona horaria y el criterio de cierre del día.
También debe diferenciarse un día que todavía está en curso de un día ya
cerrado.

El cálculo de cumplimiento debe considerar únicamente los días en los
que el hábito estaba previsto. Los días anteriores al inicio,
posteriores a una pausa o fuera de la frecuencia configurada no deben
contarse automáticamente como incumplimientos.

## 5. Categorías

### Categorías predeterminadas

-   Personal.
-   Laboral.
-   Familiar.
-   Hogar.
-   Ocio.
-   Gastos.

El usuario podrá crear categorías adicionales.

### Reglas de categorías

-   Las categorías se comparten entre los cuatro tipos de registro.
-   Un registro puede pertenecer a una o varias categorías.
-   Las categorías deben poder utilizarse en búsquedas, filtros y
    estadísticas.
-   Debe evitarse que borrar una categoría elimine accidentalmente los
    registros relacionados.
-   La política de edición, archivo o eliminación de categorías
    personalizadas se concretará durante el diseño.

## 6. Cronología unificada e interfaz

La pantalla principal mostrará secuencialmente los registros de todos
los tipos.

Cada elemento debe permitir identificar rápidamente: - Tipo de
registro. - Descripción. - Fecha relevante. - Categoría o categorías. -
Estado o clasificación, cuando corresponda.

Las acciones y campos disponibles dependerán del tipo de registro.

Se recomienda incluir: - Acceso rápido para crear una tarea, nota,
cita/evento o hábito. - Filtros rápidos. - Acceso al detalle y edición
de cada registro. - Navegación hacia agenda, hábitos y seguimiento. -
Diseño adaptable a pantallas de móvil y navegador.

El criterio exacto de ordenación de la cronología ---por fecha de
creación, fecha planificada o una combinación configurable--- debe
concretarse antes de implementar el listado definitivo.

## 7. Búsqueda y filtros

La aplicación permitirá buscar o filtrar por:

-   Descripción o contenido.
-   Categoría.
-   Fecha o intervalo de fechas.
-   Tipo de registro.
-   Estado.

En el módulo de hábitos, el usuario podrá consultar: - Hábitos
cumplidos. - Hábitos no cumplidos. - Ambos estados. - Un intervalo de
fechas. - Un hábito específico, si hay varios.

Los filtros deben poder combinarse cuando tenga sentido; por ejemplo,
tipo de registro + categoría + intervalo de fechas.

La búsqueda debe funcionar con los datos locales y sin conexión.

## 8. Apartado Seguimiento y estadísticas

El seguimiento ofrece una visión de la actividad general por períodos.
**No se pretende medir ni distribuir las horas dedicadas a cada
actividad.** No se requiere cronómetro ni registro de duración real.

### Períodos

-   Día.
-   Semana.
-   Mes.
-   Año.

### Indicadores de tareas

-   Número de tareas creadas durante el período.
-   Tareas completadas.
-   Tareas sin iniciar.
-   Tareas iniciadas o en progreso.
-   Tareas eliminadas, mostradas por separado.
-   Evolución de tareas completadas entre períodos.

Las tareas aún pendientes no deben contabilizarse automáticamente como
fracasos. Debe definirse una regla de atribución temporal para que las
tareas antiguas no distorsionen los indicadores de tareas creadas en un
período.

### Indicadores de eventos

-   Eventos previstos.
-   Eventos realizados.
-   Eventos cancelados.
-   Eventos futuros, separados de los eventos cuyo resultado ya se
    conoce.
-   Distribución de eventos por categoría.

### Indicadores de hábitos

-   Días previstos.
-   Días realizados.
-   Días no realizados.
-   Días todavía abiertos o pendientes.
-   Porcentaje de cumplimiento en el período.
-   Evolución diaria, semanal, mensual y anual.
-   Calendario visual de cumplimiento.

Fórmula básica recomendada:

`Porcentaje de cumplimiento = días realizados / días previstos ya evaluables × 100`

Los días todavía abiertos no deben contarse como incumplimientos. Si no
existen días evaluables, la aplicación debe mostrar «Sin datos» en lugar
de un porcentaje engañoso.

### Indicadores por categoría y tipo

-   Número de registros por categoría.
-   Comparación entre categorías.
-   Distribución de registros por tipo.
-   Evolución de la actividad entre períodos.

Estas estadísticas describen la cantidad de actividad registrada; no
permiten afirmar cuánto tiempo se ha dedicado a cada categoría.

### Gráficos

Se podrán utilizar gráficos de barras, líneas, anillos o calendarios de
intensidad cuando ayuden a interpretar los datos. Los gráficos deben
acompañarse de cifras o etiquetas comprensibles y respetar el filtro de
período elegido.

## 9. Persistencia y arquitectura de datos

### Base de datos

Se propone SQLite como base de datos local para Android. El diseño
lógico debe permitir representar las siguientes entidades:

-   `records`: campos comunes a los registros.
-   `tasks`: datos específicos de las tareas.
-   `notes`: contenido y clasificación de notas.
-   `events`: fechas, horas y lugar en texto.
-   `habits`: definición y configuración de hábitos.
-   `habit_logs`: cumplimiento de cada hábito por día.
-   `categories`: categorías disponibles.
-   `record_categories`: relación entre registros y categorías.

Este esquema es conceptual; el modelo físico definitivo debe evitar
duplicar información y mantener integridad referencial.

Se pueden implementar los tipos mediante una tabla común de registros y
tablas específicas relacionadas, o mediante otra estructura equivalente
que mantenga los mismos principios. La elección definitiva se hará al
diseñar las migraciones.

### Requisitos de persistencia

-   Los datos deben sobrevivir al cierre de la aplicación y al reinicio
    del dispositivo.
-   Las operaciones de creación, edición y cambio de estado deben
    persistirse.
-   Se deben definir migraciones de base de datos para futuras
    versiones.
-   Debe existir una estrategia de copia de seguridad y restauración.
-   No se requiere backend, cuenta de usuario ni sincronización en la
    nube para el funcionamiento básico.

### Particularidad de la web

La persistencia web debe verificarse en un prototipo, ya que el soporte
de SQLite en navegador tiene requisitos técnicos diferentes de Android.

Queda por decidir cómo se compartirán los mismos datos entre la versión
Android y la web, si se requiere ese comportamiento. La aplicación puede
ser offline en ambas plataformas sin que eso implique automáticamente
que sus bases de datos locales se sincronicen entre dispositivos.

## 10. Privacidad, conectividad y servicios externos

-   La aplicación está diseñada para un solo usuario.
-   Las funciones principales deben operar offline.
-   No se necesita autenticación.
-   No se necesita servidor para el uso básico.
-   No se integrarán mapas ni servicios de geolocalización.
-   El campo «Lugar» de los eventos será texto libre.
-   Las notificaciones locales pueden valorarse como mejora futura; no
    forman parte de los requisitos mínimos acordados.
-   La aplicación no debe depender de una API externa para crear,
    editar, buscar o consultar estadísticas.

## 11. Pruebas y calidad

### Pruebas funcionales

-   Crear, editar y consultar cada tipo de registro.
-   Comprobar los estados permitidos de cada tipo.
-   Asignar una o varias categorías.
-   Crear categorías personalizadas.
-   Combinar filtros y realizar búsquedas.
-   Comprobar la ordenación cronológica.
-   Validar fechas y horas de eventos.
-   Verificar el cierre diario y la reconciliación de hábitos.
-   Confirmar que los días futuros o todavía abiertos no se marcan como
    incumplidos.
-   Validar los cálculos de estadísticas para cada período.

### Pruebas offline y persistencia

-   Usar la aplicación con el teléfono en modo avión.
-   Cerrar y volver a abrir la aplicación.
-   Reiniciar el dispositivo y verificar la conservación de datos.
-   Probar cambios de fecha y zona horaria.
-   Probar restauración de una copia de seguridad cuando esté
    implementada.
-   Verificar la persistencia en navegador por separado.

### Pruebas de interfaz

-   Pantallas pequeñas y grandes.
-   Navegación entre módulos.
-   Formularios y validación.
-   Listados extensos.
-   Estados vacíos y ausencia de resultados.
-   Accesibilidad básica y legibilidad.

## 12. Fases de implementación propuestas

### Fase 1 --- Fundamentos

-   Crear el proyecto Expo con TypeScript.
-   Configurar navegación y estilos.
-   Definir el modelo de datos.
-   Configurar SQLite y persistencia local en Android.
-   Incorporar las seis categorías predeterminadas.

### Fase 2 --- Registros y cronología

-   Crear, editar y consultar tareas.
-   Crear y editar notas.
-   Crear y editar eventos.
-   Crear hábitos y sus registros diarios.
-   Mostrar los registros en una cronología unificada.

### Fase 3 --- Búsqueda y filtros

-   Búsqueda por descripción.
-   Filtros por tipo, categoría, fecha y estado.
-   Filtros específicos para hábitos.

### Fase 4 --- Seguimiento

-   Resumen diario.
-   Vistas semanal, mensual y anual.
-   Indicadores de tareas, eventos y hábitos.
-   Gráficos por tipo y categoría.

### Fase 5 --- Robustez y web

-   Pruebas de uso offline.
-   Manejo de errores y validaciones.
-   Copia de seguridad y restauración.
-   Validación del almacenamiento web.
-   Definición de la transferencia de datos entre Android y web, si se
    necesita.

## 13. Decisiones pendientes de concretar

Los siguientes puntos no se consideran cerrados y deben decidirse antes
de implementar la parte correspondiente:

1.  **Uso de la web:** si será una versión de trabajo con sus propios
    datos locales o si deberá compartir los mismos registros con Android
    mediante exportación/importación u otro mecanismo offline.
2.  **Orden de la cronología:** fecha de creación, fecha planificada o
    una combinación.
3.  **Tareas:** si tendrán prioridad y qué reglas se aplicarán a
    vencimientos.
4.  **Eventos:** cómo tratar eventos pasados cuyo resultado no se haya
    indicado y si «realizado» y «culminado» serán un único estado.
5.  **Hábitos:** qué frecuencias estarán disponibles, cómo se
    gestionarán las pausas y cómo se corregirán cumplimientos atrasados.
6.  **Copia de seguridad:** formato, ubicación y comportamiento al
    restaurar datos.
7.  **Notificaciones:** si se añadirán recordatorios locales para
    tareas, eventos o hábitos.

## 14. Resumen de los requisitos acordados

-   Aplicación personal de un solo usuario.
-   Cuatro tipos de registro: tareas, notas, citas/eventos y hábitos.
-   Cronología unificada y secuencial.
-   Categorías predeterminadas: Personal, Laboral, Familiar, Hogar, Ocio
    y Gastos.
-   Posibilidad de crear categorías adicionales.
-   Registros asociados a una o varias categorías.
-   Búsqueda por descripción, categoría, fecha, tipo y estado.
-   Seguimiento de hábitos cumplidos y no cumplidos.
-   Cambio automático de hábitos previstos a «No realizado» al cerrar el
    día, garantizado mediante reconciliación al abrir la aplicación.
-   Eventos con fechas, horas, descripción y lugar en texto.
-   Sin mapas ni geolocalización.
-   Estadísticas diarias, semanales, mensuales y anuales.
-   Sin análisis de distribución de horas ni cronómetro.
-   Funcionamiento offline y persistencia local.
-   Desarrollo recomendado con Expo, React Native y TypeScript, con
    SQLite para persistencia.
-   Android como primera plataforma de validación y web como plataforma
    objetivo adicional.
