# Plantilla de un backend de ejemplo usado AWS SAM

Este es un ejemplo de un backend de una aplicación serverless usando AWS SAM.

## Recursos

Los recursos que se crean son:
- Rol de IAM para la función Lambda
- Función Lambda
- API Gateway
- Tabla de DynamoDB
- Bucket de S3

## Funcionalidad

La API Gateway tiene dos ruta:
- **POST /path1:** Realiza un CRUD en la tabla de DynamoDB
- **POST /path2:** Realiza un CRUD en el bucket de S3

## Tener en cuenta

Antes de desplegar la aplicación se debe tener en cuenta:
- Cambiar el nombre de los parametros `stack_name` y `s3_prefix` en el archivo `samconfig.toml` por el nombre de tu aplicación.
- Cambiar el parametro `AppName` en el archivo `samconfig.toml` y `template.yaml` por el nombre de tu aplicación.
- Cambiar la declaración de los resources en el archivo `template.yaml` por el nombre de tu aplicación:
  - `AppNameRole`
  - `AppNameApiGateway`
  - `AppNameTable`
  - `AppNameBucket`
  - `AppNameFunction`

## Instrucciones

> NOTA: Para poder ejecutar los comandos siguientes comandos se debe tener instalado SAM CLI y configurado las credenciales de AWS.

Para construir y desplegar la aplicación se debe ejecutar los siguientes comando:
```bash
sam build
sam deploy
```

Para eliminar la aplicación se debe ejecutar el siguiente comando:
```bash
sam delete
```