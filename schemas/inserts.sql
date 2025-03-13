USE teste_hugo

-- Inserting audit types
INSERT INTO audit_types (name)
VALUES ('Produção'), ('Administrativo');

-- Inserting categories
INSERT INTO categories (name, audit_type)
VALUES
    ('Triagem', 1),
    ('Arrumação', 1),
    ('Limpeza', 1),
    ('Normalização', 1),
    ('Disciplina', 1);

-- Inserting checklists
INSERT INTO checklists (category, factor, criteria)
VALUES 
    -- Triagem
    (1, 'Peças ou Materiais', 'Existem máquinas e objetos na área do trabalho que não são utilizados'),
    (1, 'Máquinas e Equipamentos', 'Existem máquinas ou equipamentos não utilizados ou avariados'),
    (1, 'Úteis e Ferramentas', 'Todas as maquetes e ferramentas são usados regularmente'),
    (1, 'Controlo Visual', 'O acesso a material e ferramentas a utilizar diáriamente é adequado'),
    (1, 'Padrões para Eliminação', 'Há padrões claros para eliminação de excessos'),

    -- Arrumação
    (2, 'Etiquetas de Armazenagem', 'Há etiquetas a identificar locais de armazenagem (matéria-prima, produto final, ferramentas)'),
    (2, 'Itens Armazenados', 'Todas as caixas estão identificadas e sem sujidade'),
    (2, 'Indicadores de Quantidade', 'Há indicações claras sobre a quantidade mínima e máxima de stock'),
    (2, 'Identificação da Linha, Linhas Divisórias', 'A linha dispõe de placa identificativa com o nome e produto que se fabrica; As linhas divisórias são visíveis.'),
    (2, 'Úteis e Ferramentas', 'A armazenagem de maquetes de controlo e ferramentas está bem organizada, com fácil acesso e minimizando o movimento de pessoas'),

    -- Limpeza
    (3, 'Piso', 'O piso está limpo? Existe água ou óleo no chão? As marcações de identificação de máquinas ou materiais estão bem colocadas no chão?'),
    (3, 'Máquinas', 'Existem máquinas, equipamentos, material ou ferramentas sujos ou em mau estado de conservação?'),
    (3, 'Limpeza e Verificação', 'Existe material não identificado? De um modo geral o posto está limpo?'),
    (3, 'Responsabilidades de Limpeza', 'Há um sistema de limpeza por turno?'),
    (3, 'Ar e iluminação', 'O ângulo e intensidade de iluminação são apropriados? O ar é limpo e inodoro?'),

    -- Normalização
    (4, 'Áreas de Trabalho', 'Há locais marcados para maquetes e ferramentas? É possível identificar se alguma coisa está em falta?'),
    (4, 'Áreas de Trabalho', 'Há marcações na área de trabalho para máquinas, equipamentos e materiais? Existindo, estas estão devidamente coladas ao chão?'),
    (4, 'Documentação', 'Estão identificadas na área de trabalho a zona de arrumação para documentação'),
    (4, 'Normas', 'Existem normas no posto de trabalho (gamas de controlo, gamas de operação, gamas de embalagem), e são utilizados?'),
    (4, 'Criação de OPL''s', 'Existem instruções sobre como trabalhar com equipamentos? Essas instruções incluem também dicas sobre como se comportar em caso de avaria ou em situações imprevistas'),

    -- Disciplina
    (5, 'Cumprimento dos Regulamentos', 'As normas descritas na Normalização são respeitadas em todos os locais?'),
    (5, 'Planos de acções', 'Os planos de melhoria são realizados nos prazos estabelecidos?'),
    (5, 'Desmultiplicação', 'Há exemplos de áreas modelo e são reaplicadas por toda a organização, neste e noutros departamentos'),
    (5, 'Regras e Procedimentos', 'Todas as regras e conhecimentos de trabalho são conhecidos e respeitados'),
    (5, 'Auditorias', 'São feitas auditorias com frequência, actualizando-se indicadores planos de acção e seguimentos.');

INSERT INTO categories (name, audit_type)
VALUES
    ('Triagem', 2),
    ('Arrumação', 2),
    ('Limpeza', 2),
    ('Normalização', 2),
    ('Disciplina', 2);

INSERT INTO checklists (category, factor, criteria)
VALUES
    (6, 'Peças ou Materiais', 'Existem peças, materiais ou utéis na área de trabalho que não são utilizados?'),
    (6, 'Máquinas e Equipamentos', 'Existem equipamentos, máquinas de escritório, componentes não utilizados ou avariados?'),
    (6, 'Mobiliário', 'Existe mobiliário desnecessário nesta área? Ex. armários, prateleiras, cadeiras, mesas, etc.'),
    (6, 'Controlo Visual', 'Existem informações desnecessárias ou redundantes na zona de trabalho? (Também inclui o arquivo, etc)'),
    (6, 'Padrões para Eliminação', 'Há padrões claros para eliminação de excessos'),

    (7, 'Locais de arrumação (1)', 'Existem locais bem definidos para a arrumação de utensílios de escritório. Estes locais encontram-se arrumados?'),
    (7, 'Locais de arrumação (2)', 'Existem locais bem definidos para a arrumação de itens, peças, consumiveis, formulários, Estes locais encontram-se arrumados?'),
    (7, 'Locais para desperdícios', 'Existem locais adequados para a segregação de materiais (papel,toners, plástico)? A sua dimensão é adequada?'),
    (7, 'Facilidade de acesso', 'A armazenagem de documentos, equipamentos e materiais está bem organizada, facilitando o seu acesso'),
    (7, 'Layout', 'A arrumação de secretárias, equipamentos e componentes está organizada para minimizar os movimentos de pessoas?'),

    (8, 'Materiais e secretárias', 'Os equipamentos de escritório, objectos e locais de trabalho encontram-se bem limpos e sem sujidade? Ex. pó, cola, lixo, papel'),
    (8, 'Limpeza geral', 'O ambiente de trabalho, ou seja, pisos, paredes, janelas, portas encontram-se bem limpos, sem sujidade?'),
    (8, 'Equipamentos', 'Os equipamentos tecnológicos encontram-se livres de sujidade?'),
    (8, 'Material eléctrico', 'Existem as ligações eléctricas e telefónicas adequadas, organizadas e em bom estado de conservação?'),
    (8, 'Limpeza Habitual', 'Há regras ou planos de limpeza definidos para os equipamentos? '),

    (9, 'Utensílios', 'Há locais marcados para utensílios de escritório instrumentos metrologia,etc. É possível identificar se alguma coisa está em falta?'),
    (9, 'Áreas de Trabalho', 'Há marcações na zona de trabalho para os locais de arrumação de documentos comuns e documentos de uso pessoal profissional.'),
    (9, 'Áreas de Trabalho', 'Há marcações da zona de trabalho para as máquinas de escritório (computador, impressora, scanner, fax, equipamentos de lab.)? É possível identificar qual é o dispositivo e quem o usa.'),
    (9, 'Normas', 'Existem normas na área de trabalho e são utilizadas? Ex. Norma de marcação de arquivos, sinalética, etc.'),
    (9, 'Criação de OPLs', 'Existem instruções sobre como trabalhar com os equipamentos? Essas instruções incluem também dicas sobre como se comportar em caso de avaria ou em situações imprevistas?'),

    (10, 'Cumprimento dos Regulamentos', 'As normas descritas na Normalização são respeitadas em todos os locais?'),
    (10, 'Planos de acções', 'Os planos de melhoria são realizados nos prazos estabelecidos?'),
    (10, 'Desmultiplicação', 'Há exemplos de áreas modelo e são reaplicadas por toda a organização, neste e noutros departamentos'),
    (10, 'Regras e Procedimentos', 'As normas descritas na Normalização são melhoradas e optimizadas?'),
    (10, 'Auditorias', 'São feitas auditorias com frequência, actualizando-se indicadores planos de acção e seguimentos.');

INSERT INTO departments (name, audit_type)
VALUES
    ('Coolers', 1),
    ('Valves', 1),
    ('Electronics', 1),
    ('Heaters', 1),
    ('Tubes', 1),
    ('Warehouse', 1),
    ('HR', 2),
    ('Finance', 2),
    ('IT', 2),
    ('Quality', 2),
    ('Supply Chain Management', 2),
    ('Program Management', 2),
    ('Application Engineering', 2),
    ('Other / Non identified', 2),
    ('Manufacturing Services', 2);
