export const stringsPtBr = {
  meta: {
    title: 'TinyURL',
    description:
      'Landing page inspirada no TinyURL para encurtamento de links com suporte a múltiplos idiomas.',
  },
  brand: 'TINYURL',
  accessibility: {
    mainNavigation: 'Navegação principal',
    toolPanel: 'Ferramenta de encurtamento',
    mainMetrics: 'Indicadores principais',
    languageSelector: 'Idioma',
    closeCookieBanner: 'Fechar aviso de cookies',
  },
  navigation: {
    plans: 'Planos',
    features: 'Recursos',
    domains: 'Domínios',
    resources: 'Recursos',
    login: 'Entrar',
    signUp: 'Criar conta',
  },
  hero: {
    eyebrow: 'Encurtador de URL, links com marca e análise de cliques',
    titleLine1: 'URL Shortener, Branded',
    titleLine2: 'Short Links & Analytics',
    description:
      'Bem-vindo ao encurtador de links original, simplificando a internet com URLs desde 2002.',
    descriptionSecondary:
      'Use domínios personalizados, acompanhe estatísticas e crie links mais memoráveis com planos pagos.',
    primaryCta: 'Ver planos',
    secondaryCta: 'Criar conta grátis',
  },
  shortenerCard: {
    shortenerTab: 'Encurtar link',
    qrTab: 'Gerar QR Code',
    shortenerTitle: 'Encurtar link',
    qrTitle: 'Gerar QR Code',
    longUrlLabel: 'URL longa',
    longUrlPlaceholder: 'Cole a URL longa aqui',
    domainLabel: 'Domínio',
    domainValue: 'tinyurl.com',
    aliasLabel: 'Alias (opcional)',
    aliasPlaceholder: 'Digite o alias',
    aliasHint: 'Deve ter pelo menos 5 caracteres',
    submit: 'Encurtar link',
    disclaimer:
      'Ao clicar em Encurtar link, você concorda com nossos Termos de Serviço, Política de Privacidade e Uso de Cookies.',
    qrDescription:
      'Crie um QR Code a partir de qualquer link e compartilhe em materiais impressos, embalagens ou campanhas.',
    qrPreviewLabel: 'Pré-visualização',
    qrPreviewHint: 'O QR Code será gerado com a identidade do seu domínio.',
    qrPreviewAlt: 'QR Code gerado para a URL curta',
    qrFallbackTitle: 'QR Code gerado sem encurtar',
    qrFallbackHint: 'A API não respondeu, então o QR Code aponta para a URL original.',
    qrSubmit: 'Gerar QR Code',
    qrLoading: 'Gerando QR Code...',
    loading: 'Encurtando link...',
    resultTitle: 'Link encurtado com sucesso',
    resultShortUrlLabel: 'URL curta',
    resultOriginalUrlLabel: 'URL original',
    resultCopyHint: 'Copie e compartilhe este link.',
    copyShortUrl: 'Copiar URL curta',
    copiedShortUrl: 'URL copiada',
    copyFailed: 'Não foi possível copiar a URL curta.',
    errorPrefix: 'Não foi possível encurtar o link:',
    requiredUrl: 'Informe uma URL válida para continuar.',
    generatedLinksTitle: 'Links gerados',
  },
  recentLinks: {
    title: 'Seus links recentes:',
    emptyState: 'Nenhum link ainda no seu histórico',
    items: [
      {
        title: 'tinyurl.com/lancamento',
        subtitle: 'https://www.exemplo.com/produto/novo-lancamento',
        meta: 'Hoje, 09:42',
      },
      {
        title: 'tinyurl.com/campanha-abril',
        subtitle: 'https://site.com/campanha?utm_source=home',
        meta: 'Ontem, 18:15',
      },
    ],
  },
  plansSection: {
    title: 'Planos TinyURL incluem:',
    heading: 'Tudo pronto para escalar links com marca',
    items: ['Domínios personalizados', 'Estatísticas detalhadas', 'QR Codes dinâmicos'],
  },
  cookieConsent: {
    title: 'Consentimento de cookies',
    description:
      'Usamos cookies para melhorar sua experiência, analisar tráfego e aprimorar nossos serviços. Leia nossa Política de Cookies para saber mais.',
    necessary: 'Permitir apenas os necessários',
    all: 'Permitir todos os cookies',
    save: 'Salvar preferências',
    categories: {
      necessary: {
        label: 'Necessários',
        description: 'Mantêm o site funcionando e não podem ser desativados.',
      },
      analytics: {
        label: 'Analytics',
        description: 'Ajudam a entender o uso do site para melhorar a experiência.',
      },
      marketing: {
        label: 'Marketing',
        description: 'Permitem personalizar comunicações e campanhas.',
      },
    },
  },
  footer: {
    name: 'Nicholas Pucharelli',
    email: 'nicholas.pucharelli@gmail.com',
    location: 'Brasil',
    emailLabel: 'Enviar email para Nicholas Pucharelli',
    socialLabel: 'Links sociais do rodapé',
    linkedinLabel: 'Abrir LinkedIn de Nicholas Pucharelli',
    githubLabel: 'Abrir GitHub de Nicholas Pucharelli',
    linkedinUrl: 'https://www.linkedin.com/in/nicholas-pucharelli-fontanini-068377274',
    githubUrl: 'https://github.com/nicholaspuchaf',
    credit: 'Engineered in Svelte.',
  },
  formSections: {
    urlType: 'Tipo de link',
    freeBadge: 'Grátis',
    brandedBadge: 'Com marca',
  },
  metrics: [
    { value: '3,2M+', label: 'links criados' },
    { value: '99,9%', label: 'disponibilidade' },
    { value: '120+', label: 'países atendidos' },
  ],
} as const;

export type StringsPtBr = typeof stringsPtBr
