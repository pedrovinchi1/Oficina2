# Sistema de Emissão de Certificados

Este projeto é referente à matéria de Oficina de Integração 2 e consiste na criação de um sistema de emissão de certificados utilizando Python (FastAPI) e HTML (CSS, DOM).

## Tecnologias Utilizadas

- Python (FastAPI)
- HTML
- CSS
- JavaScript
- SQLAlchemy
- PostgreSQL
- Pytest
- React (para testes com Jest)

## Estrutura do Projeto
. ├── pycache/ ├── .vscode/ │ ├── extensions.json │ └── settings.json ├── app/ │ ├── __init__.py │ ├── auth.py │ ├── crud.py │ ├── database.py │ ├── main.py │ ├── models.py │ ├── schemas.py │ ├── static/ │ │ ├── scripts.js │ │ └── style.css │ ├── templates/ │ │ ├── alunocadastrado.html │ │ ├── cadastroaluno.html │ │ ├── cadastroprofessor.html │ │ ├── cadastrooficina.html │ │ ├── dashboard.html │ │ ├── index.html │ │ ├── oficinacadastrada.html │ │ ├── presenca.html │ │ └── professorcadastrado.html │ ├── test_auth.py │ ├── test_criar_oficina.py │ ├── test_lista_oficina.py │ ├── test_login.py │ ├── test_main.py │ ├── test_professores.py │ └── test_utils.py ├── certificados/ │ └── certificados.sqlproj ├── Documentação/ │ └── README.md ├── jest.config.js ├── jest.setup.js ├── package.json └── App.test.js

## Instruções de Inicialização

### Pré-requisitos

- Python 3.8+
- PostgreSQL
- Node.js (para testes com Jest)

### Configuração do Banco de Dados

1. Crie um banco de dados PostgreSQL e atualize a URL de conexão no arquivo `app/database.py`:
    ```python
    SQLALCHEMY_DATABASE_URL = "postgresql://<usuario>:<senha>@localhost:5432/<certificados>"
    ```

2. Execute as migrações para criar as tabelas no banco de dados:
    ```sh
    python -m app.database
    ```

### Instalando Dependências

1. Crie um ambiente virtual e ative-o:
    ```sh
    python -m venv venv
    source venv/bin/activate  # No Windows use `venv\Scripts\activate`
    ```

2. Instale as dependências do projeto:
    ```sh
    pip install -r requirements.txt
    ```

### Executando o Servidor

1. Inicie o servidor FastAPI:
    ```sh
    uvicorn app.main:app --reload
    ```

2. Acesse a aplicação em [http://localhost:8000](http://localhost:8000).

### Executando Testes

1. Para executar os testes com Pytest:
    ```sh
    pytest
    ```

2. Para executar os testes com Jest:
    ```sh
    npm install
    npm test
    ```

## Contribuição

Sinta-se à vontade para contribuir com este projeto. Para isso, siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas alterações ([git commit -m 'Adiciona nova feature'](http://_vscodecontentref_/34)).
4. Faça um push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob os termos da licença MIT.
