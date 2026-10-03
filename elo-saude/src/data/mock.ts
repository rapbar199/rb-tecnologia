/**
 * Dados mockados do protótipo. Nenhuma chamada de rede acontece no app — todo o
 * conteúdo abaixo é fictício e serve para demonstrar as telas e os fluxos.
 *
 * O formato segue de perto um subconjunto de FHIR (Observation / Immunization /
 * MedicationStatement / Encounter), de propósito: quando houver integração real,
 * a camada de dados troca sem mexer nas telas.
 */

export type FonteTipo = 'lab' | 'sus' | 'operadora' | 'wearable' | 'manual';
export type FonteStatus = 'conectado' | 'disponivel' | 'em-breve';

export type Fonte = {
  id: string;
  nome: string;
  tipo: FonteTipo;
  status: FonteStatus;
  /** Índice no array `series` do tema. Sempre acompanhado do nome em texto. */
  cor: number;
  sigla: string;
  ultimaSync?: string;
  metodo: string;
  escopos: string[];
};

export const fontes: Fonte[] = [
  {
    id: 'fleury',
    nome: 'Grupo Fleury',
    sigla: 'FL',
    tipo: 'lab',
    status: 'conectado',
    cor: 0,
    ultimaSync: '2026-09-20T08:12:00',
    metodo: 'Encaminhamento de e-mail + leitura do laudo',
    escopos: ['Resultados de exames', 'Laudos em PDF', 'Pedidos médicos'],
  },
  {
    id: 'dasa',
    nome: 'Dasa (Delboni, Alta)',
    sigla: 'DA',
    tipo: 'lab',
    status: 'conectado',
    cor: 1,
    ultimaSync: '2026-09-18T19:40:00',
    metodo: 'Encaminhamento de e-mail + leitura do laudo',
    escopos: ['Resultados de exames', 'Laudos em PDF'],
  },
  {
    id: 'sus',
    nome: 'Meu SUS Digital',
    sigla: 'SUS',
    tipo: 'sus',
    status: 'conectado',
    cor: 2,
    ultimaSync: '2026-09-21T07:05:00',
    metodo: 'Login gov.br (nível prata ou ouro)',
    escopos: ['Vacinas', 'Atendimentos', 'Medicamentos dispensados'],
  },
  {
    id: 'saude-ios',
    nome: 'Saúde do iPhone',
    sigla: 'iOS',
    tipo: 'wearable',
    status: 'conectado',
    cor: 4,
    ultimaSync: '2026-10-03T06:30:00',
    metodo: 'HealthKit, no próprio aparelho',
    escopos: ['Passos', 'Frequência cardíaca', 'Sono', 'Peso'],
  },
  {
    id: 'sabin',
    nome: 'Laboratório Sabin',
    sigla: 'SB',
    tipo: 'lab',
    status: 'disponivel',
    cor: 3,
    metodo: 'Encaminhamento de e-mail + leitura do laudo',
    escopos: ['Resultados de exames', 'Laudos em PDF'],
  },
  {
    id: 'pardini',
    nome: 'Hermes Pardini',
    sigla: 'HP',
    tipo: 'lab',
    status: 'disponivel',
    cor: 5,
    metodo: 'Encaminhamento de e-mail + leitura do laudo',
    escopos: ['Resultados de exames', 'Laudos em PDF'],
  },
  {
    id: 'unimed',
    nome: 'Unimed',
    sigla: 'UN',
    tipo: 'operadora',
    status: 'em-breve',
    cor: 2,
    metodo: 'Depende de regulamentação do Open Health',
    escopos: ['Histórico de autorizações', 'Rede credenciada', 'Carteirinha'],
  },
  {
    id: 'health-connect',
    nome: 'Health Connect (Android)',
    sigla: 'HC',
    tipo: 'wearable',
    status: 'em-breve',
    cor: 1,
    metodo: 'API do Android, no próprio aparelho',
    escopos: ['Passos', 'Frequência cardíaca', 'Sono', 'Peso'],
  },
  // Fonte interna: o que você mesmo cadastrou (foto, PDF, digitação). Não
  // aparece na tela de Conexões, por não haver nada para autorizar.
  {
    id: 'manual',
    nome: 'Adicionado por você',
    sigla: 'EU',
    tipo: 'manual',
    status: 'conectado',
    cor: 0,
    ultimaSync: '2026-09-26T20:10:00',
    metodo: 'Foto, PDF ou digitação',
    escopos: ['Tudo que você cadastrar'],
  },
];

/** Fontes que aparecem na tela de Conexões — exclui a fonte interna. */
export const fontesConectaveis = fontes.filter((f) => f.tipo !== 'manual');

export function fonte(id: string): Fonte {
  const f = fontes.find((x) => x.id === id);
  if (!f) throw new Error(`fonte desconhecida: ${id}`);
  return f;
}

/* ------------------------------------------------------------------ analitos */

export type Analito = {
  codigo: string;
  /** Código LOINC — a chave que permite unificar o mesmo exame entre labs. */
  loinc: string;
  nome: string;
  abrev: string;
  unidade: string;
  refMin: number | null;
  refMax: number | null;
  /** 'baixo-melhor' = quanto menor, melhor (LDL). 'alto-melhor' = HDL. */
  direcao: 'baixo-melhor' | 'alto-melhor' | 'faixa';
  grupo: string;
};

export const analitos: Analito[] = [
  { codigo: 'hba1c', loinc: '4548-4', nome: 'Hemoglobina glicada', abrev: 'HbA1c', unidade: '%', refMin: null, refMax: 5.7, direcao: 'baixo-melhor', grupo: 'Metabolismo' },
  { codigo: 'glicose', loinc: '1558-6', nome: 'Glicose em jejum', abrev: 'Glicose', unidade: 'mg/dL', refMin: 70, refMax: 99, direcao: 'faixa', grupo: 'Metabolismo' },
  { codigo: 'colesterol', loinc: '2093-3', nome: 'Colesterol total', abrev: 'Col. total', unidade: 'mg/dL', refMin: null, refMax: 190, direcao: 'baixo-melhor', grupo: 'Lipídios' },
  { codigo: 'ldl', loinc: '2089-1', nome: 'Colesterol LDL', abrev: 'LDL', unidade: 'mg/dL', refMin: null, refMax: 130, direcao: 'baixo-melhor', grupo: 'Lipídios' },
  { codigo: 'hdl', loinc: '2085-9', nome: 'Colesterol HDL', abrev: 'HDL', unidade: 'mg/dL', refMin: 40, refMax: null, direcao: 'alto-melhor', grupo: 'Lipídios' },
  { codigo: 'triglicerideos', loinc: '2571-8', nome: 'Triglicerídeos', abrev: 'Triglic.', unidade: 'mg/dL', refMin: null, refMax: 150, direcao: 'baixo-melhor', grupo: 'Lipídios' },
  { codigo: 'tsh', loinc: '3016-3', nome: 'TSH', abrev: 'TSH', unidade: 'mUI/L', refMin: 0.4, refMax: 4.5, direcao: 'faixa', grupo: 'Tireoide' },
  { codigo: 'vitd', loinc: '1989-3', nome: 'Vitamina D (25-OH)', abrev: 'Vit. D', unidade: 'ng/mL', refMin: 30, refMax: 100, direcao: 'alto-melhor', grupo: 'Vitaminas' },
  { codigo: 'creatinina', loinc: '2160-0', nome: 'Creatinina', abrev: 'Creat.', unidade: 'mg/dL', refMin: 0.7, refMax: 1.3, direcao: 'faixa', grupo: 'Renal' },
  { codigo: 'hemoglobina', loinc: '718-7', nome: 'Hemoglobina', abrev: 'Hb', unidade: 'g/dL', refMin: 13.5, refMax: 17.5, direcao: 'faixa', grupo: 'Hemograma' },
  { codigo: 'ferritina', loinc: '2276-4', nome: 'Ferritina', abrev: 'Ferritina', unidade: 'ng/mL', refMin: 30, refMax: 400, direcao: 'faixa', grupo: 'Hemograma' },
  { codigo: 'tgp', loinc: '1742-6', nome: 'TGP / ALT', abrev: 'TGP', unidade: 'U/L', refMin: 7, refMax: 56, direcao: 'faixa', grupo: 'Fígado' },
];

export function analito(codigo: string): Analito {
  const a = analitos.find((x) => x.codigo === codigo);
  if (!a) throw new Error(`analito desconhecido: ${codigo}`);
  return a;
}

export type Flag = 'normal' | 'alto' | 'baixo';

export function flagDe(a: Analito, valor: number): Flag {
  if (a.refMax !== null && valor > a.refMax) return 'alto';
  if (a.refMin !== null && valor < a.refMin) return 'baixo';
  return 'normal';
}

/** Rótulo legível da faixa de referência. */
export function faixaTexto(a: Analito): string {
  if (a.refMin !== null && a.refMax !== null) return `${a.refMin} – ${a.refMax} ${a.unidade}`;
  if (a.refMax !== null) return `até ${a.refMax} ${a.unidade}`;
  if (a.refMin !== null) return `acima de ${a.refMin} ${a.unidade}`;
  return a.unidade;
}

/* -------------------------------------------------------------------- exames */

export type Resultado = { codigo: string; valor: number };

export type Exame = {
  id: string;
  nome: string;
  data: string;
  fonteId: string;
  solicitante: string;
  resultados: Resultado[];
  /** Mockado: no protótipo o PDF não existe de verdade. */
  temPdf: boolean;
};

export const exames: Exame[] = [
  {
    id: 'ex-2026-09',
    nome: 'Check-up completo',
    data: '2026-09-19',
    fonteId: 'fleury',
    solicitante: 'Dra. Helena Marques · Clínica Médica',
    temPdf: true,
    resultados: [
      { codigo: 'hba1c', valor: 5.6 },
      { codigo: 'glicose', valor: 94 },
      { codigo: 'colesterol', valor: 184 },
      { codigo: 'ldl', valor: 134 },
      { codigo: 'hdl', valor: 48 },
      { codigo: 'triglicerideos', valor: 128 },
      { codigo: 'tsh', valor: 2.1 },
      { codigo: 'vitd', valor: 29 },
      { codigo: 'creatinina', valor: 0.95 },
      { codigo: 'hemoglobina', valor: 15.1 },
      { codigo: 'ferritina', valor: 112 },
      { codigo: 'tgp', valor: 31 },
    ],
  },
  {
    id: 'ex-2026-03',
    nome: 'Perfil metabólico e lipídico',
    data: '2026-03-15',
    fonteId: 'dasa',
    solicitante: 'Dra. Helena Marques · Clínica Médica',
    temPdf: true,
    resultados: [
      { codigo: 'hba1c', valor: 5.8 },
      { codigo: 'glicose', valor: 99 },
      { codigo: 'colesterol', valor: 196 },
      { codigo: 'ldl', valor: 121 },
      { codigo: 'hdl', valor: 45 },
      { codigo: 'triglicerideos', valor: 149 },
      { codigo: 'vitd', valor: 27 },
      { codigo: 'tgp', valor: 36 },
    ],
  },
  {
    id: 'ex-2025-09',
    nome: 'Check-up completo',
    data: '2025-09-08',
    fonteId: 'fleury',
    solicitante: 'Dr. Paulo Serra · Endocrinologia',
    temPdf: true,
    resultados: [
      { codigo: 'hba1c', valor: 6.1 },
      { codigo: 'glicose', valor: 106 },
      { codigo: 'colesterol', valor: 212 },
      { codigo: 'ldl', valor: 136 },
      { codigo: 'hdl', valor: 42 },
      { codigo: 'triglicerideos', valor: 171 },
      { codigo: 'tsh', valor: 2.6 },
      { codigo: 'vitd', valor: 25 },
      { codigo: 'creatinina', valor: 1.02 },
      { codigo: 'hemoglobina', valor: 14.8 },
      { codigo: 'ferritina', valor: 98 },
      { codigo: 'tgp', valor: 44 },
    ],
  },
  {
    id: 'ex-2025-03',
    nome: 'Perfil metabólico',
    data: '2025-03-22',
    fonteId: 'dasa',
    solicitante: 'Dr. Paulo Serra · Endocrinologia',
    temPdf: true,
    resultados: [
      { codigo: 'hba1c', valor: 6.4 },
      { codigo: 'glicose', valor: 114 },
      { codigo: 'colesterol', valor: 218 },
      { codigo: 'ldl', valor: 148 },
      { codigo: 'hdl', valor: 39 },
      { codigo: 'triglicerideos', valor: 182 },
      { codigo: 'vitd', valor: 22 },
      { codigo: 'tgp', valor: 52 },
    ],
  },
  {
    id: 'ex-2024-09',
    nome: 'Check-up admissional',
    data: '2024-09-14',
    fonteId: 'fleury',
    solicitante: 'Medicina do trabalho',
    temPdf: true,
    resultados: [
      { codigo: 'hba1c', valor: 6.2 },
      { codigo: 'glicose', valor: 109 },
      { codigo: 'colesterol', valor: 205 },
      { codigo: 'ldl', valor: 142 },
      { codigo: 'hdl', valor: 41 },
      { codigo: 'triglicerideos', valor: 164 },
      { codigo: 'tsh', valor: 3.1 },
      { codigo: 'vitd', valor: 18 },
      { codigo: 'creatinina', valor: 0.98 },
      { codigo: 'hemoglobina', valor: 14.6 },
      { codigo: 'ferritina', valor: 86 },
      { codigo: 'tgp', valor: 48 },
    ],
  },
];

/** Série temporal de um analito, do mais antigo para o mais novo. */
export type Ponto = { data: string; valor: number; exameId: string; fonteId: string };

export function serie(codigo: string): Ponto[] {
  return exames
    .filter((e) => e.resultados.some((r) => r.codigo === codigo))
    .map((e) => ({
      data: e.data,
      valor: e.resultados.find((r) => r.codigo === codigo)!.valor,
      exameId: e.id,
      fonteId: e.fonteId,
    }))
    .sort((a, b) => a.data.localeCompare(b.data));
}

/** Analitos que têm pelo menos 2 medições — os que valem um gráfico. */
export function analitosComHistorico(): Analito[] {
  return analitos.filter((a) => serie(a.codigo).length >= 2);
}

export function ultimoResultado(codigo: string): Ponto | null {
  const s = serie(codigo);
  return s.length ? s[s.length - 1] : null;
}

/* ------------------------------------------------------------------- vacinas */

export type Vacina = {
  id: string;
  nome: string;
  dose: string;
  data: string;
  local: string;
  fonteId: string;
  lote?: string;
};

export const vacinas: Vacina[] = [
  { id: 'v1', nome: 'Influenza', dose: 'Campanha 2026', data: '2026-04-28', local: 'UBS Vila Mariana', fonteId: 'sus', lote: '240FL8812' },
  { id: 'v2', nome: 'Febre amarela', dose: 'Dose única', data: '2025-11-10', local: 'UBS Vila Mariana', fonteId: 'sus', lote: 'FA-5521' },
  { id: 'v3', nome: 'dT (difteria e tétano)', dose: 'Reforço', data: '2025-06-02', local: 'Clínica Mais Saúde', fonteId: 'manual' },
  { id: 'v4', nome: 'Covid-19 (bivalente)', dose: '5ª dose', data: '2024-12-18', local: 'UBS Vila Mariana', fonteId: 'sus', lote: 'CV-77120' },
  { id: 'v5', nome: 'Hepatite B', dose: '3ª dose', data: '2024-03-09', local: 'UBS Vila Mariana', fonteId: 'sus' },
];

/* -------------------------------------------------------------- medicamentos */

export type Medicamento = {
  id: string;
  nome: string;
  dose: string;
  posologia: string;
  inicio: string;
  fim?: string;
  prescritor: string;
  ativo: boolean;
  fonteId: string;
};

export const medicamentos: Medicamento[] = [
  { id: 'm1', nome: 'Vitamina D3', dose: '7.000 UI', posologia: '1 cápsula por semana', inicio: '2025-09-20', prescritor: 'Dr. Paulo Serra', ativo: true, fonteId: 'manual' },
  { id: 'm2', nome: 'Metformina', dose: '500 mg', posologia: '1 comprimido após o almoço', inicio: '2025-04-02', prescritor: 'Dr. Paulo Serra', ativo: true, fonteId: 'sus' },
  { id: 'm3', nome: 'Losartana', dose: '50 mg', posologia: '1 comprimido ao acordar', inicio: '2026-02-11', prescritor: 'Dra. Helena Marques', ativo: true, fonteId: 'manual' },
  { id: 'm4', nome: 'Amoxicilina', dose: '500 mg', posologia: '8/8h por 7 dias', inicio: '2026-01-14', fim: '2026-01-21', prescritor: 'Dr. Caio Nunes', ativo: false, fonteId: 'sus' },
];

/* ----------------------------------------------------------------- consultas */

export type Consulta = {
  id: string;
  especialidade: string;
  profissional: string;
  local: string;
  data: string;
  fonteId: string;
  nota?: string;
};

export const consultas: Consulta[] = [
  { id: 'c1', especialidade: 'Clínica Médica', profissional: 'Dra. Helena Marques', local: 'Clínica Mais Saúde', data: '2026-09-26', fonteId: 'manual', nota: 'Retorno com check-up. Manter metformina e vitamina D.' },
  { id: 'c2', especialidade: 'Clínica Médica', profissional: 'Dra. Helena Marques', local: 'Clínica Mais Saúde', data: '2026-02-11', fonteId: 'manual', nota: 'Pressão 142/90. Iniciada losartana.' },
  { id: 'c3', especialidade: 'Pronto atendimento', profissional: 'Dr. Caio Nunes', local: 'UPA Vila Mariana', data: '2026-01-14', fonteId: 'sus', nota: 'Amigdalite bacteriana.' },
  { id: 'c4', especialidade: 'Endocrinologia', profissional: 'Dr. Paulo Serra', local: 'Hospital São Camilo', data: '2025-09-20', fonteId: 'manual', nota: 'HbA1c em queda. Reduzir carboidrato refinado.' },
];

/* ---------------------------------------------------------------- documentos */

export type Documento = {
  id: string;
  titulo: string;
  tipo: 'Laudo' | 'Receita' | 'Pedido médico' | 'Atestado' | 'Relatório';
  data: string;
  fonteId: string;
  paginas: number;
};

export const documentos: Documento[] = [
  { id: 'd1', titulo: 'Laudo — Check-up completo', tipo: 'Laudo', data: '2026-09-19', fonteId: 'fleury', paginas: 4 },
  { id: 'd2', titulo: 'Receita — Losartana 50 mg', tipo: 'Receita', data: '2026-02-11', fonteId: 'manual', paginas: 1 },
  { id: 'd3', titulo: 'Pedido — Perfil metabólico', tipo: 'Pedido médico', data: '2026-03-02', fonteId: 'manual', paginas: 1 },
  { id: 'd4', titulo: 'Atestado — 2 dias de afastamento', tipo: 'Atestado', data: '2026-01-14', fonteId: 'sus', paginas: 1 },
  { id: 'd5', titulo: 'Laudo — Ultrassom de abdome', tipo: 'Laudo', data: '2025-09-08', fonteId: 'fleury', paginas: 2 },
];

/* ------------------------------------------------------------------- perfil  */

export const perfil = {
  nome: 'Rafael Barbosa',
  nascimento: '1992-04-17',
  cpfMascarado: '•••.•••.789-02',
  cns: '•••• •••• •••• 4410',
  tipoSanguineo: 'O+',
  altura: 178,
  peso: 81.4,
  alergias: ['Dipirona', 'Camarão'],
  condicoes: ['Pré-diabetes', 'Hipertensão leve'],
  emergencia: { nome: 'Camila Barbosa', relacao: 'Esposa', telefone: '(11) 9••••-4120' },
  planoSaude: { operadora: 'Unimed', plano: 'Nacional Plus', carteirinha: '•••• •••• 7781' },
  caixaEntrada: 'rafael.a8f3@caixa.elosaude.app',
};

export const familiares = [
  { id: 'f1', nome: 'Lívia Barbosa', relacao: 'Filha', idade: 7, pendencia: '2 vacinas em atraso' },
  { id: 'f2', nome: 'Dona Marta', relacao: 'Mãe', idade: 68, pendencia: 'Exame de rotina vencido' },
];

/* ------------------------------------------- consentimentos e trilha de acesso */

export type Consentimento = {
  fonteId: string;
  escopos: string[];
  concedidoEm: string;
  validadeEm: string;
};

export const consentimentos: Consentimento[] = [
  { fonteId: 'fleury', escopos: ['Resultados de exames', 'Laudos em PDF', 'Pedidos médicos'], concedidoEm: '2026-02-03', validadeEm: '2027-02-03' },
  { fonteId: 'dasa', escopos: ['Resultados de exames', 'Laudos em PDF'], concedidoEm: '2026-02-03', validadeEm: '2027-02-03' },
  { fonteId: 'sus', escopos: ['Vacinas', 'Atendimentos', 'Medicamentos dispensados'], concedidoEm: '2026-01-28', validadeEm: '2027-01-28' },
  { fonteId: 'saude-ios', escopos: ['Passos', 'Frequência cardíaca', 'Sono', 'Peso'], concedidoEm: '2026-01-28', validadeEm: '2027-01-28' },
];

export type Acesso = {
  id: string;
  quem: string;
  oque: string;
  quando: string;
  tipo: 'voce' | 'medico' | 'sistema';
};

export const trilhaAcesso: Acesso[] = [
  { id: 'a1', quem: 'Você', oque: 'Abriu o laudo do check-up de 19/09', quando: '2026-10-02T21:14:00', tipo: 'voce' },
  { id: 'a2', quem: 'Dra. Helena Marques', oque: 'Acessou o link compartilhado (perfil lipídico)', quando: '2026-09-26T14:02:00', tipo: 'medico' },
  { id: 'a3', quem: 'Elo Saúde', oque: 'Sincronizou 12 resultados do Grupo Fleury', quando: '2026-09-20T08:12:00', tipo: 'sistema' },
  { id: 'a4', quem: 'Você', oque: 'Gerou link temporário com validade de 7 dias', quando: '2026-09-25T19:48:00', tipo: 'voce' },
  { id: 'a5', quem: 'Elo Saúde', oque: 'Sincronizou 5 vacinas do Meu SUS Digital', quando: '2026-09-21T07:05:00', tipo: 'sistema' },
];

export const compartilhamentos = [
  { id: 's1', para: 'Dra. Helena Marques', escopo: 'Perfil lipídico + metabólico', criadoEm: '2026-09-25', expiraEm: '2026-10-02', aberturas: 2, ativo: false },
  { id: 's2', para: 'Link aberto (QR code)', escopo: 'Cartão de emergência', criadoEm: '2026-10-01', expiraEm: '2026-10-31', aberturas: 0, ativo: true },
];

/* -------------------------------------------------------- linha do tempo  */

export type Evento =
  | { kind: 'exame'; data: string; ref: Exame }
  | { kind: 'consulta'; data: string; ref: Consulta }
  | { kind: 'vacina'; data: string; ref: Vacina }
  | { kind: 'medicamento'; data: string; ref: Medicamento };

export function linhaDoTempo(): Evento[] {
  const eventos: Evento[] = [
    ...exames.map((e) => ({ kind: 'exame' as const, data: e.data, ref: e })),
    ...consultas.map((c) => ({ kind: 'consulta' as const, data: c.data, ref: c })),
    ...vacinas.map((v) => ({ kind: 'vacina' as const, data: v.data, ref: v })),
    ...medicamentos.map((m) => ({ kind: 'medicamento' as const, data: m.inicio, ref: m })),
  ];
  return eventos.sort((a, b) => b.data.localeCompare(a.data));
}

/* ------------------------------------------------------------------ utils  */

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** '2026-09-19' -> '19 set 2026' */
export function dataCurta(iso: string): string {
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d} ${MESES[Number(m) - 1]} ${a}`;
}

/** '2026-09-19' -> 'set/26' — para eixos de gráfico */
export function dataEixo(iso: string): string {
  const [a, m] = iso.slice(0, 10).split('-');
  return `${MESES[Number(m) - 1]}/${a.slice(2)}`;
}

export function dataHora(iso: string): string {
  const hora = iso.slice(11, 16);
  return `${dataCurta(iso)} · ${hora}`;
}

export function idade(nascimento: string): number {
  const hoje = new Date('2026-10-03');
  const nasc = new Date(nascimento);
  let i = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) i--;
  return i;
}

/** Quantos resultados fora da faixa no exame mais recente. */
export function alteradosNoExame(e: Exame): number {
  return e.resultados.filter((r) => flagDe(analito(r.codigo), r.valor) !== 'normal').length;
}

export const resumoDados = {
  fontesConectadas: fontesConectaveis.filter((f) => f.status === 'conectado').length,
  totalResultados: exames.reduce((n, e) => n + e.resultados.length, 0),
  totalExames: exames.length,
  totalDocumentos: documentos.length,
  desde: '2024-09-14',
};
