import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  getArtworks,
  getFeaturedArtwork,
  hasSanityConfig,
  urlFor,
} from "./lib/sanityClient.js";

const navItems = [
  ["sobre", "Sobre"],
  ["galeria", "Galeria"],
  ["colecoes", "Coleções"],
  ["matarazzo", "Matarazzo"],
  ["extras", "Extras"],
  ["contato", "Contato"],
];

const pageNavItems = [
  ["/", "Início"],
  ["/galeria", "Galeria"],
  ["/matarazzo", "Matarazzo"],
  ["/colecoes", "Coleções"],
  ["/extras", "Extras"],
];

const collections = [
  {
    title: "Jamaica",
    year: "coleção 01",
    palette: "verde, sol, terra",
    note: "Retratos, botânica e deslocamento afetivo.",
  },
  {
    title: "Espelhos",
    year: "coleção 02",
    palette: "prata, sombra, pele",
    note: "Objetos, reflexos e corpo em cena.",
  },
  {
    title: "Cerâmica Fria",
    year: "coleção 03",
    palette: "volume, brilho, gesto",
    note: "Peças e estudos tridimensionais.",
  },
  {
    title: "Jardim Noturno",
    year: "coleção 04",
    palette: "vermelho, azul, folhas",
    note: "Flores densas, presença e memória tropical.",
  },
];

const fallbackGalleryItems = [
  ["Obra 01", "Retrato floral", "portrait"],
  ["Obra 02", "Estudo de espelho", "tall"],
  ["Obra 03", "Tela de coleção", "wide"],
  ["Obra 04", "Escultura", "portrait"],
  ["Obra 05", "Detalhe de tinta", "square"],
  ["Obra 06", "Registro no ateliê", "tall"],
  ["Obra 07", "Série botânica", "wide"],
  ["Obra 08", "Composição livre", "square"],
  ["Obra 09", "Peça especial", "portrait"],
];

const matarazzoPlan = [
  ["Ambiente", "Fotos amplas do espaço, circulação e instalação."],
  ["Obras", "Registros finais das telas e detalhes de textura."],
  ["Processo", "Montagem, bastidores e making of."],
  ["Vídeo", "Teasers, reels e recortes verticais."],
  ["Entrevista", "Depoimentos, falas da artista e imprensa."],
  ["Arquivo", "Materiais extras captados no local."],
];

const extras = {
  entrevistas: [
    "Entrevista em vídeo",
    "Matéria para redes",
    "Depoimento sobre processo",
  ],
  publicitarios: [
    "Vídeo publicitário 01",
    "Campanha com obra em cena",
    "Registro de bastidor comercial",
  ],
  diversos: [
    "Participação em evento",
    "Vídeo de ateliê",
    "Registro espontâneo",
  ],
};

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return <motion.div className="progress-bar" style={{ scaleX }} />;
}

function FluidBackdrop() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const xA = useTransform(scrollYProgress, [0, 1], ["-8vw", "12vw"]);
  const yA = useTransform(scrollYProgress, [0, 1], ["-8vh", "18vh"]);
  const xB = useTransform(scrollYProgress, [0, 1], ["10vw", "-10vw"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["18vh", "-10vh"]);
  const xC = useTransform(scrollYProgress, [0, 1], ["-4vw", "8vw"]);
  const yC = useTransform(scrollYProgress, [0, 1], ["22vh", "-4vh"]);
  const scaleA = useTransform(scrollYProgress, [0, 1], [1, 1.24]);
  const scaleB = useTransform(scrollYProgress, [0, 1], [1.14, 0.96]);
  const rotateA = useTransform(scrollYProgress, [0, 1], [-8, 18]);
  const rotateB = useTransform(scrollYProgress, [0, 1], [12, -14]);
  const hue = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const filter = useMotionTemplate`blur(26px) saturate(1.25) hue-rotate(${hue}deg)`;

  return (
    <motion.div
      className="fluid-backdrop"
      style={shouldReduceMotion ? undefined : { filter }}
      aria-hidden="true"
    >
      <motion.div className="fluid-layer fluid-layer-a" style={shouldReduceMotion ? undefined : { x: xA, y: yA, scale: scaleA, rotate: rotateA }} />
      <motion.div className="fluid-layer fluid-layer-b" style={shouldReduceMotion ? undefined : { x: xB, y: yB, scale: scaleB, rotate: rotateB }} />
      <motion.div className="fluid-layer fluid-layer-c" style={shouldReduceMotion ? undefined : { x: xC, y: yC }} />
      <div className="fluid-texture" />
    </motion.div>
  );
}

function Reveal({ children, className = "", delay = 0, as = "div" }) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}

function FluidHero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.35], ["0%", "-16%"]);
  const rotate = useTransform(scrollYProgress, [0, 0.35], [0, -5]);

  return (
    <motion.div
      className="hero-fluid"
      style={shouldReduceMotion ? undefined : { y, rotate }}
      aria-hidden="true"
    >
      <svg className="fluid-svg" viewBox="0 0 1200 820" preserveAspectRatio="none">
        <motion.path
          d="M-20 360C100 226 218 184 347 230C505 286 548 118 735 92C932 64 1098 168 1230 38V858H-20Z"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  d: [
                    "M-20 360C100 226 218 184 347 230C505 286 548 118 735 92C932 64 1098 168 1230 38V858H-20Z",
                    "M-20 320C126 198 252 250 376 202C534 140 598 160 748 110C930 48 1060 210 1230 86V858H-20Z",
                    "M-20 360C100 226 218 184 347 230C505 286 548 118 735 92C932 64 1098 168 1230 38V858H-20Z",
                  ],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          fill="url(#sunsetInk)"
        />
        <motion.path
          d="M-30 650C160 515 270 548 421 606C585 668 696 595 804 495C930 380 1020 394 1230 470V858H-30Z"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  d: [
                    "M-30 650C160 515 270 548 421 606C585 668 696 595 804 495C930 380 1020 394 1230 470V858H-30Z",
                    "M-30 612C134 570 268 492 436 560C600 628 675 558 812 472C980 368 1094 448 1230 410V858H-30Z",
                    "M-30 650C160 515 270 548 421 606C585 668 696 595 804 495C930 380 1020 394 1230 470V858H-30Z",
                  ],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          fill="url(#blueGreen)"
          opacity="0.88"
        />
        <defs>
          <linearGradient id="sunsetInk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f5f2e8" />
            <stop offset="30%" stopColor="#ff8c3a" />
            <stop offset="58%" stopColor="#e33d54" />
            <stop offset="100%" stopColor="#3e6e57" />
          </linearGradient>
          <linearGradient id="blueGreen" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c73a6" />
            <stop offset="46%" stopColor="#f4cc48" />
            <stop offset="100%" stopColor="#263f35" />
          </linearGradient>
        </defs>
      </svg>
      <div className="paint-grain" />
    </motion.div>
  );
}

function BrushLine() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <svg className="brush-line" viewBox="0 0 280 70" aria-hidden="true">
      <motion.path
        d="M6 44C52 10 89 66 132 34C173 4 206 14 274 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.35 }}
        animate={shouldReduceMotion ? undefined : { pathLength: [0, 1, 1], opacity: [0.35, 0.75, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function MediaSlot({ label, shape = "square", tone = "warm" }) {
  return (
    <div className={`media-slot ${shape}`} data-tone={tone}>
      <div className="slot-mark">
        <span>{label}</span>
      </div>
    </div>
  );
}

function getArtworkLayout(image) {
  const dimensions = image?.assetMetadata?.dimensions || image?.asset?.metadata?.dimensions;
  const width = dimensions?.width;
  const height = dimensions?.height;
  const ratio = dimensions?.aspectRatio || (width && height ? width / height : null);

  if (!ratio) {
    return "square";
  }

  return ratio > 1.18 ? "landscape" : ratio < 0.86 ? "portrait" : "square";
}

function ArtworkImage({ image, name, index }) {
  const orientation = getArtworkLayout(image);
  const imageUrl = urlFor(image)?.width(1200).quality(82).url();

  if (!imageUrl) {
    return (
      <MediaSlot
        label={name || "obra"}
        shape="square"
        tone={index % 3 === 0 ? "warm" : index % 3 === 1 ? "cool" : "green"}
      />
    );
  }

  return (
    <div className={`artwork-frame ${orientation}`}>
      <img src={imageUrl} alt={name} loading="lazy" decoding="async" />
    </div>
  );
}

function getGalleryColumnCount() {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth <= 720) return 1;
  if (window.innerWidth <= 1040) return 2;
  return 4;
}

function useGalleryColumnCount() {
  const [columnCount, setColumnCount] = useState(getGalleryColumnCount);

  useEffect(() => {
    const handleResize = () => setColumnCount(getGalleryColumnCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return columnCount;
}

function splitIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);

  items.forEach((item, index) => {
    columns[index % columnCount].push({ item, index });
  });

  return columns;
}

function useArtworksData() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(hasSanityConfig);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hasSanityConfig) return;

    let isMounted = true;

    async function loadArtworks() {
      try {
        const data = await getArtworks();
        if (isMounted) setArtworks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Não foi possível carregar as obras.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadArtworks();

    return () => {
      isMounted = false;
    };
  }, []);

  return { artworks, loading, error };
}

function useFeaturedArtwork() {
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(hasSanityConfig);

  useEffect(() => {
    if (!hasSanityConfig) return;

    let isMounted = true;

    async function loadFeaturedArtwork() {
      try {
        const data = await getFeaturedArtwork();
        if (isMounted) setArtwork(data || null);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFeaturedArtwork();

    return () => {
      isMounted = false;
    };
  }, []);

  return { artwork, loading };
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.replace("#", ""))?.scrollIntoView({ block: "start" });
        return;
      }

      window.scrollTo({ top: 0, left: 0 });
    });
  }, [pathname, hash]);

  return null;
}

function Nav() {
  return (
    <nav className="site-nav" aria-label="Navegação principal">
      <Link className="nav-brand" to="/">
        Nicole Kvsh
      </Link>
      <div className="nav-links">
        {pageNavItems.map(([href, label]) => (
          <NavLink key={href} to={href} end={href === "/"}>
            {label}
          </NavLink>
        ))}
        <a href="#contato">Contato</a>
      </div>
    </nav>
  );
}

function FeaturedArtwork({ artwork, loading }) {
  const imageUrl = artwork?.image ? urlFor(artwork.image)?.width(1100).quality(84).url() : null;

  if (imageUrl) {
    return (
      <>
        <div className="featured-artwork">
          <img src={imageUrl} alt={artwork.name} loading="eager" decoding="async" />
        </div>
        <div className="hero-note">
          <span>Obra destaque</span>
          <p>{artwork.name}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <MediaSlot label={loading ? "carregando" : "obra destaque"} shape="portrait" tone="cool" />
      <div className="hero-note">
        <span>{loading ? "Buscando destaque" : "Arquivo em construção"}</span>
        <p>Marque uma obra como destaque no Sanity para ocupar este espaço.</p>
      </div>
    </>
  );
}

function Hero({ featuredArtwork, featuredLoading }) {
  return (
    <header id="inicio" className="hero">
      <div className="hero-copy">
        <Reveal>
          <p className="eyebrow">Portfólio artístico</p>
          <h1>Nicole Kvsh</h1>
          <p className="hero-lede">
            Pintura, objeto e imagem em um arquivo visual leve, fluido e pronto
            para receber as obras finais.
          </p>
          <div className="hero-actions" aria-label="Ações principais">
            <Link className="button primary" to="/galeria">
              Ver galeria
            </Link>
            <Link className="button" to="/matarazzo">
              Projeto Matarazzo
            </Link>
          </div>
        </Reveal>
      </div>
      <Reveal className="hero-panel" delay={0.12}>
        <div className="featured-artwork-shell">
          <FeaturedArtwork artwork={featuredArtwork} loading={featuredLoading} />
        </div>
        <MediaSlot label="obra destaque" shape="portrait" tone="cool" />
        <div className="hero-note">
          <span>Arquivo em construção</span>
          <p>Espaços preparados para pinturas, vídeos, entrevistas e registros de exposição.</p>
        </div>
      </Reveal>
      <a className="scroll-cue" href="#sobre" aria-label="Ir para a apresentação">
        <span />
      </a>
    </header>
  );
}

function Intro() {
  return (
    <section id="sobre" className="section intro-section">
      <Reveal className="section-label">
        <span>01</span>
        <p>Sobre</p>
      </Reveal>
      <Reveal className="intro-copy" delay={0.08}>
        <h2>Um corpo de obra entre retrato, memória e matéria.</h2>
        <p>
          Esta base foi pensada para receber uma biografia mais precisa, textos
          curatoriais, statement da artista e informações de currículo sem pesar
          o visual. A experiência privilegia movimento suave, grandes respiros e
          áreas de mídia fáceis de substituir.
        </p>
      </Reveal>
      <Reveal className="atelier-strip" delay={0.16}>
        <MediaSlot label="ateliê" shape="wide" tone="green" />
        <MediaSlot label="detalhe" shape="square" tone="warm" />
        <MediaSlot label="processo" shape="portrait" tone="rose" />
      </Reveal>
    </section>
  );
}

function Gallery({ showHeading = true }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(hasSanityConfig);
  const [error, setError] = useState(null);
  const columnCount = useGalleryColumnCount();

  useEffect(() => {
    if (!hasSanityConfig) return;

    let isMounted = true;

    async function loadArtworks() {
      try {
        const data = await getArtworks();
        if (isMounted) setArtworks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Não foi possível carregar as obras.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadArtworks();

    return () => {
      isMounted = false;
    };
  }, []);

  const shouldUseFallback = !hasSanityConfig;
  const hasArtworks = artworks.length > 0;
  const fallbackColumns = useMemo(
    () => splitIntoColumns(fallbackGalleryItems, columnCount),
    [columnCount],
  );
  const artworkColumns = useMemo(
    () => splitIntoColumns(artworks, columnCount),
    [artworks, columnCount],
  );

  return (
    <section id="galeria" className={`section gallery-section ${showHeading ? "" : "is-page-content"}`}>
      <div className="section-heading">
        <Reveal>
          <p className="eyebrow">Galeria</p>
          <h2>Obras em primeira camada.</h2>
        </Reveal>
        <Reveal className="section-aside" delay={0.08}>
          <p>
            Grade flexível para pinturas, esculturas e vídeos curtos. Cada bloco
            pode virar imagem, vídeo ou carrossel depois.
          </p>
        </Reveal>
      </div>

      {loading ? <p className="gallery-state">Carregando obras...</p> : null}
      {error ? <p className="gallery-state is-error">{error}</p> : null}
      {!loading && !error && hasSanityConfig && !hasArtworks ? (
        <p className="gallery-state">Nenhuma obra publicada ainda.</p>
      ) : null}
      {shouldUseFallback ? (
        <p className="gallery-state">
          Configure o Sanity no `.env` para carregar obras reais. Enquanto isso,
          estes blocos seguem como marcação visual temporária.
        </p>
      ) : null}

      {shouldUseFallback || hasArtworks ? (
        <div className="gallery-grid" style={{ "--gallery-columns": columnCount }}>
          {shouldUseFallback
            ? fallbackColumns.map((column, columnIndex) => (
                <div className="gallery-column" key={`fallback-column-${columnIndex}`}>
                  {column.map(({ item, index }) => {
                    const [label, title, shape] = item;

                    return (
                      <Reveal as="figure" className={`gallery-item ${shape}`} key={label} delay={(index % 4) * 0.04}>
                        <MediaSlot label={label} shape={shape} tone={index % 3 === 0 ? "warm" : index % 3 === 1 ? "cool" : "green"} />
                        <figcaption>
                          <strong>{title}</strong>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        </figcaption>
                      </Reveal>
                    );
                  })}
                </div>
              ))
            : artworkColumns.map((column, columnIndex) => (
                <div className="gallery-column" key={`artwork-column-${columnIndex}`}>
                  {column.map(({ item: artwork, index }) => {
                    const orientation = getArtworkLayout(artwork.image);

                    return (
                      <Reveal as="figure" className={`gallery-item ${orientation}`} key={artwork._id} delay={(index % 4) * 0.04}>
                        <ArtworkImage image={artwork.image} name={artwork.name} index={index} />
                        <figcaption>
                          <strong>{artwork.name}</strong>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        </figcaption>
                      </Reveal>
                    );
                  })}
                </div>
              ))}
        </div>
      ) : null}
    </section>
  );
}

function Collections() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-54%"]);

  return (
    <section id="colecoes" className="collections-scroll" ref={containerRef}>
      <div className="collections-sticky">
        <div className="collections-heading">
          <p className="eyebrow">Coleções</p>
          <h2>Separação por séries de trabalho.</h2>
        </div>
        <motion.div className="collections-track" style={{ x }}>
          {collections.map((collection, index) => (
            <article className="collection-card" key={collection.title}>
              <MediaSlot
                label={`mídia ${String(index + 1).padStart(2, "0")}`}
                shape={index % 2 === 0 ? "portrait" : "wide"}
                tone={index % 2 === 0 ? "green" : "rose"}
              />
              <div>
                <span>{collection.year}</span>
                <h3>{collection.title}</h3>
                <p>{collection.note}</p>
                <small>{collection.palette}</small>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Matarazzo() {
  return (
    <section id="matarazzo" className="matarazzo-section">
      <div className="matarazzo-bg" aria-hidden="true" />
      <div className="matarazzo-copy">
        <Reveal>
          <p className="eyebrow">Especial</p>
          <h2>Exposição Matarazzo.</h2>
          <p>
            Seção dedicada ao projeto que será exposto em julho de 2026. A ideia
            aqui é receber tudo que foi captado no local: obra, ambiente,
            bastidor, entrevista, vídeo vertical e material de divulgação.
          </p>
        </Reveal>
        <BrushLine />
      </div>

      <div className="matarazzo-grid">
        {matarazzoPlan.map(([title, text], index) => (
          <Reveal as="article" className="matarazzo-card" key={title} delay={(index % 3) * 0.05}>
            <MediaSlot label={title} shape={index === 0 || index === 3 ? "wide" : "square"} tone={index % 2 ? "cool" : "warm"} />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Extras({ showHeading = true }) {
  const [active, setActive] = useState("entrevistas");

  return (
    <section id="extras" className={`section extras-section ${showHeading ? "" : "is-page-content"}`}>
      <div className="section-heading">
        <Reveal>
          <p className="eyebrow">Extras</p>
          <h2>Entrevistas, publicidade e vídeos diversos.</h2>
        </Reveal>
        <Reveal className="tabs" delay={0.08} role="tablist" aria-label="Tipos de extras">
          {Object.keys(extras).map((key) => (
            <button
              className="tab-button"
              type="button"
              role="tab"
              aria-selected={active === key}
              key={key}
              onClick={() => setActive(key)}
            >
              {key === "publicitarios" ? "publicitários" : key}
            </button>
          ))}
        </Reveal>
      </div>

      <div className="extras-grid">
        {extras[active].map((item, index) => (
          <Reveal as="article" className="extra-item" key={item} delay={index * 0.05}>
            <MediaSlot label={item} shape={index === 0 ? "wide" : "portrait"} tone={index % 2 ? "rose" : "cool"} />
            <h3>{item}</h3>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PageIntro({ eyebrow, title, text }) {
  return (
    <header className="page-intro">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </Reveal>
      <Reveal className="page-intro-copy" delay={0.08}>
        <p>{text}</p>
      </Reveal>
    </header>
  );
}

function HomeGalleryPreview() {
  const { artworks, loading, error } = useArtworksData();
  const previewArtworks = artworks.slice(0, 4);
  const useFallback = !hasSanityConfig || (!loading && !error && previewArtworks.length === 0);

  return (
    <section id="inicio-galeria" className="section home-preview">
      <div className="section-heading">
        <Reveal>
          <p className="eyebrow">Galeria</p>
          <h2>Primeiro recorte do acervo.</h2>
        </Reveal>
        <Reveal className="section-aside" delay={0.08}>
          <p>Uma seleção curta para a página inicial. O acervo completo fica em uma página própria.</p>
          <Link className="text-link" to="/galeria">Ver galeria completa</Link>
        </Reveal>
      </div>

      <div className="preview-grid">
        {useFallback
          ? fallbackGalleryItems.slice(0, 4).map(([label, title, shape], index) => (
              <Reveal as="figure" className="preview-item" key={label} delay={index * 0.04}>
                <MediaSlot label={label} shape={shape} tone={index % 2 ? "cool" : "warm"} />
                <figcaption>{title}</figcaption>
              </Reveal>
            ))
          : previewArtworks.map((artwork, index) => (
              <Reveal as="figure" className="preview-item" key={artwork._id} delay={index * 0.04}>
                <ArtworkImage image={artwork.image} name={artwork.name} index={index} />
                <figcaption>{artwork.name}</figcaption>
              </Reveal>
            ))}
      </div>
    </section>
  );
}

function HomeCollectionsPreview() {
  return (
    <section id="inicio-colecoes" className="section home-preview">
      <div className="section-heading">
        <Reveal>
          <p className="eyebrow">Coleções</p>
          <h2>Séries para entrar com calma.</h2>
        </Reveal>
        <Reveal className="section-aside" delay={0.08}>
          <p>Um resumo das frentes de trabalho. A página de coleções organiza cada série com mais respiro.</p>
          <Link className="text-link" to="/colecoes">Ver coleções</Link>
        </Reveal>
      </div>
      <div className="preview-collection-row">
        {collections.slice(0, 3).map((collection, index) => (
          <Reveal as="article" className="collection-card compact" key={collection.title} delay={index * 0.05}>
            <MediaSlot label={collection.title} shape={index === 1 ? "wide" : "square"} tone={index % 2 ? "rose" : "green"} />
            <div>
              <span>{collection.year}</span>
              <h3>{collection.title}</h3>
              <p>{collection.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function HomeMatarazzoPreview() {
  return (
    <section id="inicio-matarazzo" className="section home-preview matarazzo-preview">
      <div className="section-heading">
        <Reveal>
          <p className="eyebrow">Matarazzo</p>
          <h2>Projeto especial em desenvolvimento.</h2>
        </Reveal>
        <Reveal className="section-aside" delay={0.08}>
          <p>Uma chamada para a exposição, com a página própria reservada para fotos, vídeos, bastidores e entrevistas captadas no local.</p>
          <Link className="text-link" to="/matarazzo">Abrir Matarazzo</Link>
        </Reveal>
      </div>
      <div className="matarazzo-preview-grid">
        {matarazzoPlan.slice(0, 3).map(([title, text], index) => (
          <Reveal as="article" className="matarazzo-card" key={title} delay={index * 0.05}>
            <MediaSlot label={title} shape={index === 0 ? "wide" : "square"} tone={index % 2 ? "cool" : "warm"} />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function HomeExtrasPreview() {
  return (
    <section id="inicio-extras" className="section home-preview">
      <div className="section-heading">
        <Reveal>
          <p className="eyebrow">Extras</p>
          <h2>Vídeos, entrevistas e presenças.</h2>
        </Reveal>
        <Reveal className="section-aside" delay={0.08}>
          <p>Um espaço de arquivo para participações, campanhas, registros e materiais fora da galeria.</p>
          <Link className="text-link" to="/extras">Ver extras</Link>
        </Reveal>
      </div>
      <div className="extras-grid compact">
        {extras.entrevistas.slice(0, 3).map((item, index) => (
          <Reveal as="article" className="extra-item" key={item} delay={index * 0.05}>
            <MediaSlot label={item} shape={index === 0 ? "wide" : "portrait"} tone={index % 2 ? "rose" : "cool"} />
            <h3>{item}</h3>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const { artwork, loading } = useFeaturedArtwork();

  return (
    <main id="conteudo">
      <Hero featuredArtwork={artwork} featuredLoading={loading} />
      <Intro />
      <HomeGalleryPreview />
      <HomeCollectionsPreview />
      <HomeMatarazzoPreview />
      <HomeExtrasPreview />
    </main>
  );
}

function GalleryPage() {
  return (
    <main id="conteudo" className="page-main">
      <PageIntro
        eyebrow="Galeria"
        title="Obras"
        text="Acervo em expansão, carregado diretamente do Sanity. Novas obras publicadas entram aqui sem mexer no código."
      />
      <Gallery showHeading={false} />
    </main>
  );
}

function CollectionsPage() {
  return (
    <main id="conteudo" className="page-main">
      <Collections />
    </main>
  );
}

function MatarazzoPage() {
  return (
    <main id="conteudo" className="page-main">
      <Matarazzo />
    </main>
  );
}

function ExtrasPage() {
  return (
    <main id="conteudo" className="page-main">
      <PageIntro
        eyebrow="Extras"
        title="Entrevistas e vídeos"
        text="Materiais complementares: entrevistas, campanhas, registros de ateliê e aparições em outros contextos."
      />
      <Extras showHeading={false} />
    </main>
  );
}

function Contact() {
  return (
    <footer id="contato" className="contact-section">
      <Reveal>
        <p className="eyebrow">Contato</p>
        <h2>Próximos passos.</h2>
      </Reveal>
      <Reveal className="contact-links" delay={0.08}>
        <a href="mailto:contato@nicolekvsh.com">contato@nicolekvsh.com</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <Link to="/">Voltar ao início</Link>
      </Reveal>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ProgressBar />
      <FluidBackdrop />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/matarazzo" element={<MatarazzoPage />} />
        <Route path="/colecoes" element={<CollectionsPage />} />
        <Route path="/extras" element={<ExtrasPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Contact />
    </BrowserRouter>
  );
}
