# Developer setup

Em um terminal:

HTTPS

```
git clone https://github.com/LuizBudeu/logic-gates.git
```

SSH
```
git clone git@github.com:LuizBudeu/logic-gates.git
```

```
cd logic-gates
```

## Servidor

Criar um virtual enviroment:
```
cd server

python -m venv env
```
Em CMD:
```
/env/Scripts/Activate.ps1
```


Em Linux:
```
source env/bin/activate
```

Instalar requerimentos e:
```
pip install -r requirements.txt
```

Iniciar servidor:
```
python manage.py runserver
```

## Frontend
Outro terminal:

```
cd front

npm install
```

Adicionar o `.env` em `./front`

adicione `REACT_APP_API_HOSTNAME_PORT="http://127.0.0.1:8000"` ao `.env`

Iniciar:
```
npm start
```

## Utilização

Backend API em `http://127.0.0.1:8000/`

Frontend em `http://localhost:3000/`


# 👥 Contribuidores

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Edu-Hiroshi"><img src="https://avatars.githubusercontent.com/u/97803912?s=400&u=14625cf4c91606d4787d983fd2692ee4db47ff4e&v=4" width="100px;" alt=""/><br /><sub><b>Eduardo Hiroshi Ito<br/>11806868</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/DamaralHenrique"><img src="https://avatars.githubusercontent.com/u/62445591?v=4" width="100px;" alt=""/><br /><sub><b>Henrique D'Amaral Matheus<br/>11345513</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/LuizBudeu"><img src="https://avatars.githubusercontent.com/u/68716701?v=4" width="100px;" alt=""/><br /><sub><b>Luiz Guilherme Budeu<br/> 11821639</b></sub></a><br /></td>
  </tr>
</table>