<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro e Geração de Certificados - Projeto ELLP</title>
    <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
    <div class="container">
        <h2>Cadastro de Aluno Voluntário - Projeto ELLP</h2>
        
        <form id="cadastroForm">
            <label for="nome">Nome Completo</label>
            <input type="text" id="nome" required>

            <label for="curso">Curso</label>
            <input type="text" id="curso" required>

            <label for="cargaHoraria">Carga Horária (em horas)</label>
            <input type="number" id="cargaHoraria" required>

            <label for="dataConclusao">Data de Conclusão</label>
            <input type="date" id="dataConclusao" required>

            <button type="button" onclick="enviarFormulario()">Gerar Certificado</button>
        </form>

        <div id="certificado" class="certificate" style="display: none;">
            <h3>Certificado de Participação</h3>
            <p>Certificamos que <span id="certNome"></span>, estudante do curso de <span id="certCurso"></span>,</p>
            <p>participou como voluntário no projeto ELLP, com carga horária de <span id="certCargaHoraria"></span> horas,</p>
            <p>concluído em <span id="certDataConclusao"></span>.</p>
            <p>Assinatura: ____________________________</p>
        </div>
    </div>

    <script src="/static/script.js"></script>
</body>
</html>
