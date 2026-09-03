# Guida ai parametri del wireframe

Tutti i parametri principali si trovano nel blocco `:root` di `styles.css`.
Modifica il valore dopo i due punti e salva il file. Non serve modificare le regole delle singole sezioni.

## Come leggere i valori

- Un colore si scrive in formato esadecimale, per esempio `#000000`.
- Una dimensione in `rem` scala in modo coerente con il font di base.
- Un valore `clamp(minimo, fluido, massimo)` si adatta automaticamente tra mobile e desktop.
- Un valore in `px` è fisso.

## Colori delle sezioni positive

Le sezioni con classe `theme-positive` usano questi parametri:

| Parametro | Controlla |
| --- | --- |
| `--positive-background` | Colore di sfondo della sezione positiva |
| `--positive-surface` | Sfondo di card, form e pannelli positivi |
| `--positive-text` | Titoli e testo principale positivo |
| `--positive-text-muted` | Paragrafi, descrizioni e testo secondario positivo |
| `--positive-border` | Bordi e contorni positivi |
| `--positive-accent` | CTA, link, etichette e dettagli positivi |
| `--positive-accent-contrast` | Colore del testo dentro gli elementi accent positivi |
| `--positive-placeholder` | Sfondo dei blocchi immagine e video positivi |

## Colori delle sezioni negative

Le sezioni con classe `theme-negative` usano questi parametri:

| Parametro | Controlla |
| --- | --- |
| `--negative-background` | Colore di sfondo della sezione negativa |
| `--negative-surface` | Sfondo di card, form e pannelli negativi |
| `--negative-text` | Titoli e testo principale negativo |
| `--negative-text-muted` | Paragrafi, descrizioni e testo secondario negativo |
| `--negative-border` | Bordi e contorni negativi |
| `--negative-accent` | CTA, link, etichette e dettagli negativi |
| `--negative-accent-contrast` | Colore del testo dentro gli elementi accent negativi |
| `--negative-placeholder` | Sfondo dei blocchi immagine e video negativi |

Per cambiare il tipo di una sezione, modifica la classe HTML:

```html
<section class="section theme-positive">
```

oppure:

```html
<section class="section theme-negative">
```

## Font

| Parametro | Controlla |
| --- | --- |
| `--font-family-headings` | Font di H1, H2, H3, H4 e H5 |
| `--font-family-paragraphs` | Font di paragrafi, descrizioni e testo normale |
| `--font-family-labels` | Font di eyebrow, label, kicker e label dei campi |
| `--font-weight-headings` | Peso di H1, H2 e H3 |
| `--font-weight-subtitles` | Peso di H4 e sottotitoli |
| `--font-weight-paragraphs` | Peso base dei paragrafi |
| `--font-weight-labels` | Peso di H5, eyebrow e label |
| `--font-weight-interface` | Peso di bottoni, navigazione e link |

Esempio:

```css
--font-family-headings: Anton, sans-serif;
--font-family-paragraphs: "IBM Plex Sans", Arial, sans-serif;
```

## Dimensioni dei titoli e dei testi

| Parametro | Controlla |
| --- | --- |
| `--font-size-h1` | Dimensione del titolo principale della pagina |
| `--typography-h1-max-width` | Larghezza massima di H1 e numero di righe del titolo hero |
| `--font-size-h2` | Dimensione dei titoli delle sezioni |
| `--font-size-h3` | Dimensione dei titoli delle card |
| `--font-size-h4` | Dimensione dei sottotitoli |
| `--font-size-h5` | Dimensione delle micro-intestazioni |
| `--font-size-paragraph` | Dimensione dei paragrafi standard |
| `--font-size-paragraph-large` | Dimensione dei paragrafi introduttivi e del testo hero |
| `--font-size-label` | Dimensione di eyebrow, kicker e label |
| `--line-height-headings-large` | Altezza delle righe di H1 |
| `--line-height-headings` | Altezza delle righe di H2, H3, H4 e H5 |
| `--line-height-paragraphs` | Altezza delle righe dei paragrafi |
| `--letter-spacing-headings` | Spaziatura tra le lettere dei titoli |
| `--letter-spacing-labels` | Spaziatura tra le lettere delle label |

## Larghezze e spaziature

| Parametro | Controlla |
| --- | --- |
| `--layout-page-gutter` | Margine laterale della pagina |
| `--layout-content-max-width` | Larghezza massima del contenuto centrale |
| `--layout-section-padding` | Spazio sopra e sotto ogni sezione |
| `--layout-section-compact-padding` | Spazio tra intestazione e griglie interne |
| `--layout-content-gap` | Distanza base tra blocchi di contenuto |
| `--layout-grid-gap` | Distanza tra colonne e card |
| `--layout-header-height` | Altezza dell'header fisso |
| `--layout-header-margin-block` | Spazio esterno sopra e sotto l'header flottante |
| `--layout-header-margin-inline` | Spazio esterno laterale dell'header flottante |
| `--layout-header-padding-inline` | Spazio interno laterale dell'header |
| `--layout-case-copy-max-width` | Larghezza massima del testo del caso studio |
| `--layout-contact-copy-max-width` | Larghezza massima del testo della sezione contatti |

Le larghezze mirate dei titoli e degli incipit sono controllate dai parametri
`--typography-*-max-width` nel blocco `:root`. I selettori con ID (`#problem-title`,
`#process-title`, `#fit-title` e le intro di sezione) applicano i valori specifici
senza alterare la griglia o il comportamento responsive.

## Card, bordi, bottoni e form

| Parametro | Controlla |
| --- | --- |
| `--shape-card-radius` | Arrotondamento di card, pannelli e form |
| `--shape-header-radius` | Arrotondamento dell'header a forma di pillola |
| `--shape-button-radius` | Arrotondamento dei bottoni |
| `--shape-border-width` | Spessore dei bordi |
| `--control-button-height` | Altezza dei bottoni |
| `--control-button-padding-inline` | Spazio interno orizzontale dei bottoni |
| `--control-card-padding` | Spazio interno delle card e del form |
| `--control-input-height` | Altezza dei campi input |
| `--motion-transition-fast` | Velocità dei cambiamenti al passaggio del mouse |

## Glassmorphism delle card

Questi parametri controllano l'effetto vetro applicato a card, pannelli, statistiche e form:

| Parametro | Controlla |
| --- | --- |
| `--glass-blur` | Intensità della sfocatura dello sfondo dietro la card |
| `--glass-saturation` | Intensità dei colori visibili attraverso il vetro |
| `--glass-opacity` | Trasparenza della superficie della card |
| `--positive-glass-background` | Fondo vetro delle card nelle sezioni positive |
| `--positive-glass-border` | Bordo vetro delle card nelle sezioni positive |
| `--positive-glass-highlight` | Riflesso interno delle card positive |
| `--positive-glass-shadow` | Ombra delle card positive |
| `--negative-glass-background` | Fondo vetro delle card nelle sezioni negative |
| `--negative-glass-border` | Bordo vetro delle card nelle sezioni negative |
| `--negative-glass-highlight` | Riflesso interno delle card negative |
| `--negative-glass-shadow` | Ombra delle card negative |

## Header flottante

| Parametro | Controlla |
| --- | --- |
| `--header-background` | Colore e trasparenza dello sfondo dell'header |
| `--header-positive-background` | Sfondo nero pieno quando l'header è sopra una sezione positiva |
| `--header-positive-border` | Bordo dell'header sopra una sezione positiva |
| `--header-negative-background` | Sfondo vetro quando l'header è sopra una sezione negativa |
| `--header-negative-border` | Bordo dell'header sopra una sezione negativa |
| `--header-text` | Colore principale del testo dell'header |
| `--header-text-muted` | Colore secondario di logo testuale e navigazione |
| `--header-border` | Colore del bordo glassmorphism dell'header |
| `--header-shadow` | Ombra esterna dell'header |
| `--header-blur` | Sfocatura dello sfondo dietro l'header |
| `--header-saturation` | Saturazione dei colori visibili attraverso l'header |
| `--brand-logo-size` | Dimensione quadrata del logo nell'header |

Esempio per rendere il vetro più evidente:

```css
--glass-blur: 26px;
--glass-opacity: 0.42;
--negative-glass-border: rgba(96, 216, 62, 0.28);
```

Il CSS include anche un fallback automatico: se il dispositivo chiede di ridurre la trasparenza, le card diventano superfici solide e leggibili.

## Breakpoint responsive

Questi due valori si trovano nelle media query in fondo a `styles.css`:

- `900px`: riduce le griglie da quattro o tre colonne a configurazioni più compatte.
- `720px`: trasforma i layout a più colonne in una singola colonna mobile e nasconde la navigazione principale.

## Ordine consigliato per la personalizzazione

1. Scegli colori positivi e negativi.
2. Imposta `--font-family-headings`.
3. Imposta `--font-family-paragraphs`.
4. Regola `--font-size-h1` e `--font-size-h2`.
5. Regola dimensioni di H3, H4, H5 e paragrafi.
6. Regola larghezza, padding e distanza tra sezioni.
7. Regola border radius, bordi, bottoni e campi form.
8. Controlla infine la resa mobile a 720px.
