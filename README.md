# daw_tp_final
Trabajo final para la materia Desarrollo Web que forma parte de la especialidad en Internet de las Cosas de la Universidad de Buenos Aires.

![status](https://img.shields.io/badge/status-running-green.svg?colorB=00C106) ![readme](https://img.shields.io/badge/readme-OK-green.svg?colorB=00C106) ![database](https://img.shields.io/badge/database-OK-green.svg?colorB=00C106) ![commits](https://img.shields.io/badge/commits-13-blue.svg)  ![techs](https://img.shields.io/badge/techs-nodejs-html5-javascript—css.svg)

## Autor
Atilio Cesar Errecaborde

## Estructura del proyecto
La estructura del proyecto está basada en el ejercicio 12 presenentado en clases y dentro del tema nodejs de la materia. 

daw_tp_final

  └───css
  
  └───db
  
  └───images
  
  └───js
  
  └───src
  
  └───ws
  
  | README.md
  
  | docker-compose.yml
  
  | favicon.ico
  
  | index.html
  
  | run_phpadmin.sh
  
  | serve_node_app_net.sh
  
  | start_mysql.sh


### Funcionalidades y características
- Mostrar todos los dispositivos Iot conectados
- Permitir filtrar los dispositivos por tipo
- Apagar/Encender dipositivos.


## Ejecutar el proyecto con Docker Compose

  En la raiz del proyecto, iniciar la aplicación con el siguiente comando:

     docker-compose up
  
  Si la aplicación se inicio correctamente, estará disponible en http://localhost:8000.
  En http://localhost:8085 se debería poder acceder a PHPMyAdmin.

  Para detener toda la aplicación ejecute el siguiente comando:

      docker-compose down 
  
  
  El detalle de la configuración de los servicios en Docker Compose está disponible en:
  [`notes.txt`](https://github.com/atilioe101/daw_tp_final/blob/master/doc/notes.txt)


  Para mas detalles puede examinar el archivo:
  [`docker-compose.yml`](https://github.com/atilioe101/daw_tp_final/blob/master/docker-compose.yml)
  
  
## Ejecutar el proyecto sin Docker Compose  

  1.  El primer paso será detener todos los contenedores corriendo en la máquina ejecutando 
      el siguiente comando:

            docker stop $(docker ps -a -q)
      
  2.  El siguiente paso será chequear la red de Docker que se utilizará para conectar los
      contenedores entre sí con el siguiente comando:

            docker network ls | grep mysql-net
        
  3.  Si el comando anterior no arroja info, será necesario crearla con el siguiente comando:

            docker network create --driver bridge mysql-net
      
  4.  Con la red creada será necesario ejecutar el contenedor con la base de datos. Para eso,
      dentro del directorio raíz del proyecto ejecutar el siguiente comando, pasándole como
      argumento la red a utilizar y el directorio donde se encuentra la base de datos.

            ./start_mysql.sh mysql-net "$PWD"/db
      
  5.  A continuación correr el gestor de base de datos PHPMyAdmin con el siguiente comando,
      especificando la red de Docker, el nombre del servidor de base de datos y el puerto.

            ./run_phpadmin.sh mysql-net mysql-server 8085
      

## Cargar la base de datos

Para construir la base de datos, 
utilizar el script [`smart_home`](https://github.com/atilioe101/daw_tp_final/blob/master/db/dumps/smart_home.sql)

## Instalación de dependencias

    Para instalar docker ejecute los siguientes comandos:

            Instalar dependencias
            ```
            sudo apt-get install \
            apt-transport-https \
            ca-certificates \
            curl \
            gnupg-agent \
            software-properties-common
            ```

            Realizar la instalación de Docker CE con el siguiente comando:
            ```
                sudo apt-get install docker-ce
            ```
            Reiniciar el servicio de Docker:
            ```
                sudo service docker restart
            ```

    Para instalar docker compose ejecute los siguientes comandos:

        Abrir una terminal y ejecutar el siguiente comando para descargar Docker Compose.
        ```
        sudo curl -L https://github.com/docker/compose/releases/download/1.17.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
        ```
        Una vez descargado, darle permisos de ejecución con el siguiente comando.
        ```
        sudo chmod +x /usr/local/bin/docker-compose
        ```

### Tecnologías usadas

La aplicación está estructurada utilizando
`nodejs`,`html5`,`javascript`,`css`.