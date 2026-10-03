# Elo Saúde — protótipo

Protótipo navegável de um agregador de dados de saúde pessoais: a pessoa
autoriza suas fontes (laboratórios, Meu SUS Digital, app de saúde do celular) e
o histórico aparece unificado num só lugar.

**Todos os dados são fictícios.** Não há backend, não há chamada de rede e
nenhuma integração real está ativa. As telas de conexão e sincronização são
simulações do fluxo pretendido.

## Rodar

```bash
cd elo-saude
npm install
npx expo start          # abra o QR no Expo Go
npx expo start --tunnel # se o celular não estiver na mesma rede
```

O app não usa nenhuma dependência nativa além das que o Expo Go já traz, de
propósito — **roda no Expo Go sem development build**. Os gráficos são
desenhados com `View`s, sem `react-native-svg`.

## Subir uma versão de teste

Requer uma conta Expo e o EAS CLI (`npx eas-cli@latest`).

```bash
npx eas-cli@latest login
npx eas-cli@latest init            # cria o projeto e grava o projectId no app.json

# APK Android para instalar e compartilhar por link
npx eas-cli@latest build --profile preview --platform android

# iOS (precisa de conta Apple Developer, distribui por TestFlight/interno)
npx eas-cli@latest build --profile preview --platform ios
```

Para atualizações over-the-air depois do primeiro build:

```bash
npx eas-cli@latest update:configure    # instala e configura expo-updates
npx eas-cli@latest update --channel preview --message "ajustes da demo"
```

Os perfis de build já estão no `eas.json`. O `init` e o `update:configure`
precisam rodar numa máquina com acesso a `api.expo.dev`.

## Estrutura

```
src/
  app/                  rotas (Expo Router — cada arquivo é uma tela)
    (tabs)/             Início, Exames, Conexões, Perfil
    exame/[id]          detalhe de um exame, com tabela de resultados
    evolucao/[codigo]   gráfico de evolução de um indicador
    conectar/[fonteId]  fluxo de consentimento de uma fonte
    adicionar           ingestão: foto, PDF, e-mail, digitação
    compartilhar        link temporário + QR para o médico
    privacidade         consentimentos ativos e trilha de acesso
    emergencia          cartão de emergência
    medicamentos · vacinas · documentos · familia
  components/
    ui.tsx              Card, Row, badges, botões
    chart.tsx           gráfico de evolução e sparkline
  data/mock.ts          toda a massa de dados fictícios
  theme.ts              tokens de cor (claro/escuro)
```

### Camada de dados

`src/data/mock.ts` segue de perto um subconjunto de FHIR (Observation,
Immunization, MedicationStatement, Encounter). É de propósito: quando houver
integração real, troca-se a camada de dados sem mexer nas telas.

Cada analito carrega seu código **LOINC**. É isso que permite juntar no mesmo
gráfico um exame do Fleury e um da Dasa — o casamento é por código, não pelo
nome que cada laboratório imprime no laudo.

### Cores

A paleta de identidade das fontes e as cores de status foram validadas para
daltonismo (protan/deutan/tritan) e contraste contra as superfícies claras e
escuras do app. Três cores de fonte ficam abaixo de 3:1 no fundo claro — por
isso **todo badge de fonte carrega a sigla em texto**, e todo status vem com
ícone + rótulo. A cor nunca é o único canal de informação.

## O que o protótipo deliberadamente não faz

- Não interpreta resultado nem sugere conduta (isso levaria o app para a zona
  de dispositivo médico, com ANVISA e CFM envolvidos).
- Não pede senha de portal de laboratório, em nenhum fluxo.
- Não tem tela que prometa integração que não exista — as fontes sem caminho
  viável hoje aparecem como "em breve", com o motivo.
