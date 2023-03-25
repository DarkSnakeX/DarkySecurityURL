# DarkySecurityURL
Un bot de discord que usa la API de VirusTotal para mirar si los enlaces pueden ser maliciosos o no.

# Descripcion
Este bot analiza todos los mensajes que envian los usuarios y cuando encuentra un enlace lo analiza usando
la API de Virustotal, en cuanto hay al menos un indicio de que la URL/enlace que ha pasado puede ser maliciosa
se envia un mensaje al respecto, en caso contrario envia otro mensaje avisando de su aparente fiabilidad.

# Requisitos
- Tener una API valida de Virustotal
- Tener un token valido de Discord para crear bots
- Instalar la dependencia de node-fetch y discord.js (14.8.0 actualmente)

# Por hacer
- Analizar tambien archivos
- Añadir opcion de poder borrar los mensajes y/o penalizar/avisar al usuario que ha pasado dicho enlace malicioso
- Añadir comandos para analizar URLs
- ???

# Aviso
Este bot es meramente educativo para enseñar sobre ciberseguridad en discord y el uso de la API de Virustotal en Javascript.
Se recuerda tambien que al usar la API de Virustotal toda URL que se analiza se almacena de forma PUBLICA en la base de datos de Virustotal, por lo que no se recomienda usar este bot en servidores privados o de confianza.
