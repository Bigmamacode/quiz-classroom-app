# Quiz Classroom App

Applicazione web completa per quiz scolastici a risposta multipla con:

- autenticazione studenti e docenti
- esecuzione quiz una domanda alla volta
- correzione automatica immediata
- spiegazione teorica dopo ogni risposta
- storico risultati studente
- CRUD domande lato docente
- import massivo quiz da CSV
- statistiche di classe

## Stack

- Frontend: Next.js App Router
- Backend/Auth/DB: Supabase
- Hosting: Netlify
- UI: dark theme responsive

## Struttura progetto

```text
quiz-classroom-app/
  app/
    admin/
    api/
    dashboard/
    history/
    login/
    quiz/[materia]/
    signup/
  components/
  lib/
  supabase/
    schema.sql
  types/
  middleware.ts
  package.json
```

## Modello dati Supabase

Tabelle principali:

- `profiles`
- `quiz`
- `quiz_sessions`
- `tentativi`

Nota tecnica importante: oltre a `quiz` e `tentativi`, ho aggiunto:

- `profiles` per il ruolo `student/admin`
- `quiz_sessions` per raggruppare un intero quiz svolto

Senza `quiz_sessions` non avresti uno storico serio dei tentativi completi.

## SQL completo

Usa direttamente:

- [schema.sql](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/supabase/schema.sql)

## Variabili ambiente

Copia `.env.example` in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` serve per le route server-side protette di admin e quiz. Non va esposta nel frontend, ma va configurata nelle environment variables del deploy.

## API route implementate

### Studente

- `POST /api/quiz/session`
  - crea una sessione quiz
- `POST /api/quiz/submit`
  - salva la risposta alla singola domanda
- `POST /api/quiz/session/complete`
  - chiude la sessione e salva punteggio finale

### Admin

- `POST /api/admin/questions`
  - crea domanda
- `PATCH /api/admin/questions/:id`
  - modifica domanda
- `DELETE /api/admin/questions/:id`
  - elimina domanda
- `POST /api/admin/import-csv`
  - importa CSV
- `GET /api/admin/stats`
  - restituisce statistiche aggregate

## CSV import

Formato richiesto:

```csv
materia,argomento,domanda,A,B,C,D,E,corretta,spiegazione,difficolta
```

### Nuovo corpus originale consigliato

Per evitare errori di OCR e testi troncati dal PDF, il percorso consigliato adesso è usare il nuovo set di quiz originali:

- [quiz_originali_biologia_base.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/quiz_originali_biologia_base.csv)
- [quiz_originali_chimica_base.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/quiz_originali_chimica_base.csv)
- [quiz_originali_fisica_base.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/quiz_originali_fisica_base.csv)
- [quiz_originali_biologia_v2_calibrati.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/quiz_originali_biologia_v2_calibrati.csv)
- [quiz_originali_chimica_v2_calibrati.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/quiz_originali_chimica_v2_calibrati.csv)
- [quiz_originali_fisica_v2_calibrati.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/quiz_originali_fisica_v2_calibrati.csv)

Questi file sono:

- originali e non derivati da OCR rumoroso
- scritti direttamente per l'app
- pronti per l'import CSV
- coerenti per difficoltà `1-3`
- completi di spiegazione per ogni risposta

### Criterio di calibrazione v2

I file `v2_calibrati` sono più vicini allo stile dei quiz di ammissione:

- distrattori più plausibili
- meno domande puramente definitorie
- più peso a ragionamento, proporzioni e interpretazione
- difficoltà spostata soprattutto su livelli `2-4`
- formulazione più simile a item test-based

Esempio:

```csv
Biologia,Cellula,Qual è l'organulo che produce ATP?,Nucleo,Mitocondrio,Ribosoma,Reticolo,Membrana,B,Il mitocondrio è responsabile della respirazione cellulare.,2
```

### CSV già pronto dal PDF

Ho preparato un primo blocco verificato dal PDF indicato:

- [alpha_test_medicina_2019_biologia_sample.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_biologia_sample.csv)
- [alpha_test_medicina_2019_biologia_block_6457_6472.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_biologia_block_6457_6472.csv)
- [alpha_test_medicina_2019_biologia_block_6475_6486_filtered.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_biologia_block_6475_6486_filtered.csv)
- [alpha_test_medicina_2019_chimica_block_6501_6516.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6501_6516.csv)
- [alpha_test_medicina_2019_chimica_block_6517_6532.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6517_6532.csv)
- [alpha_test_medicina_2019_chimica_block_6533_6550.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6533_6550.csv)
- [alpha_test_medicina_2019_chimica_block_6551_6565.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6551_6565.csv)
- [alpha_test_medicina_2019_chimica_block_6566_6580.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6566_6580.csv)
- [alpha_test_medicina_2019_chimica_block_6581_6600.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6581_6600.csv)
- [alpha_test_medicina_2019_chimica_block_6601_6623.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6601_6623.csv)
- [alpha_test_medicina_2019_chimica_block_6624_6650.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6624_6650.csv)
- [alpha_test_medicina_2019_chimica_block_6651_6670.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6651_6670.csv)
- [alpha_test_medicina_2019_chimica_block_6671_6690.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6671_6690.csv)
- [alpha_test_medicina_2019_chimica_block_6691_6710.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6691_6710.csv)
- [alpha_test_medicina_2019_chimica_block_6711_6730.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6711_6730.csv)
- [alpha_test_medicina_2019_chimica_block_6731_6750.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6731_6750.csv)
- [alpha_test_medicina_2019_chimica_block_6751_6770.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6751_6770.csv)
- [alpha_test_medicina_2019_chimica_block_6771_6790.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6771_6790.csv)
- [alpha_test_medicina_2019_chimica_block_6791_6810.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6791_6810.csv)
- [alpha_test_medicina_2019_chimica_block_6811_6830.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6811_6830.csv)
- [alpha_test_medicina_2019_chimica_block_6831_6850.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6831_6850.csv)
- [alpha_test_medicina_2019_chimica_block_6851_6870.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6851_6870.csv)
- [alpha_test_medicina_2019_chimica_block_6871_6890.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6871_6890.csv)
- [alpha_test_medicina_2019_chimica_block_6891_6910.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6891_6910.csv)
- [alpha_test_medicina_2019_chimica_block_6911_6930.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6911_6930.csv)
- [alpha_test_medicina_2019_chimica_block_6931_6950.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6931_6950.csv)
- [alpha_test_medicina_2019_chimica_block_6951_6970.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6951_6970.csv)
- [alpha_test_medicina_2019_chimica_block_6971_6990.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6971_6990.csv)
- [alpha_test_medicina_2019_chimica_block_6991_7010.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_6991_7010.csv)
- [alpha_test_medicina_2019_chimica_block_7011_7030.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7011_7030.csv)
- [alpha_test_medicina_2019_chimica_block_7031_7050.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7031_7050.csv)
- [alpha_test_medicina_2019_chimica_block_7051_7070.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7051_7070.csv)
- [alpha_test_medicina_2019_chimica_block_7071_7090.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7071_7090.csv)
- [alpha_test_medicina_2019_chimica_block_7091_7110.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7091_7110.csv)
- [alpha_test_medicina_2019_chimica_block_7111_7130.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7111_7130.csv)
- [alpha_test_medicina_2019_chimica_block_7131_7150.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7131_7150.csv)
- [alpha_test_medicina_2019_chimica_block_7151_7170.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7151_7170.csv)
- [alpha_test_medicina_2019_chimica_block_7171_7190.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7171_7190.csv)
- [alpha_test_medicina_2019_chimica_block_7191_7210.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7191_7210.csv)
- [alpha_test_medicina_2019_chimica_block_7211_7230.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7211_7230.csv)
- [alpha_test_medicina_2019_chimica_block_7231_7250_filtered.csv](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/data/alpha_test_medicina_2019_chimica_block_7231_7250_filtered.csv)

Questi file contengono un set iniziale di quesiti di biologia e chimica con:

- testo domanda
- 5 opzioni
- risposta corretta verificata sulla pagina "Soluzioni"
- spiegazione sintetica aggiunta per l'uso in app

Nota: l'intero PDF usa pagine soluzioni grafiche. Per importare tutto il volume in modo affidabile serve una pipeline OCR/validazione aggiuntiva; ho quindi preferito caricare subito un blocco pulito e verificato invece di generare migliaia di record rumorosi.

## Sicurezza

RLS implementata in Supabase:

- gli studenti leggono quiz e vedono solo le proprie sessioni/tentativi
- solo gli admin inseriscono/modificano/eliminano quiz
- i tentativi possono essere scritti solo dall’utente autenticato

Ruolo admin:

1. registra normalmente l’utente docente
2. in Supabase esegui:

```sql
update public.profiles
set role = 'admin'
where email = 'docente@scuola.it';
```

## Avvio locale passo-passo

1. Crea progetto Supabase.
2. Apri SQL Editor e incolla [schema.sql](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/supabase/schema.sql).
3. Recupera `Project URL` e `anon public key`.
4. Crea `.env.local`.
5. Installa dipendenze:

```bash
npm install
```

6. Avvia:

```bash
npm run dev
```

7. Apri:

```text
http://localhost:3000
```

## Deploy su Netlify

Il progetto è pronto per Netlify con [netlify.toml](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/netlify.toml) e build verificata in produzione con `npm run build`.

Passi:

1. carica il progetto su GitHub/GitLab/Bitbucket
2. in Netlify scegli **Add new site** -> **Import from Git**
3. seleziona il repository
4. usa queste impostazioni:

```text
npm run build
```

Base directory:

```text
.
```

Node version:

```text
22
```

5. imposta le environment variables nel pannello Netlify:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

6. fai il deploy

7. dopo il primo deploy verifica:

- login studente
- login admin
- import CSV
- avvio quiz
- salvataggio storico

### Nota pratica per il deploy

Se hai già dati di test locali, non vengono copiati automaticamente su Supabase in produzione: il deploy porta il codice online, mentre quiz, utenti e tentativi restano nel progetto Supabase che hai configurato come backend.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Netlify indica che le variabili runtime per funzioni e middleware vanno impostate via UI/CLI/API e non affidate al solo file di configurazione: [Environment variables and functions](https://docs.netlify.com/functions/environment-variables/).

## File chiave

- Layout e tema: [layout.tsx](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/app/layout.tsx), [globals.css](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/app/globals.css)
- Auth: [auth-form.tsx](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/components/auth-form.tsx)
- Quiz runner: [quiz-runner.tsx](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/components/quiz-runner.tsx)
- Admin CRUD: [admin-question-form.tsx](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/components/admin-question-form.tsx)
- CSV import: [import-csv route](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/app/api/admin/import-csv/route.ts)
- Statistiche: [stats route](C:/Users/Utente/Documents/New%20project/quiz-classroom-app/app/api/admin/stats/route.ts)

## Possibili estensioni

- timer per quiz
- filtri per difficoltà
- import da PDF/estrazione OCR
- dashboard docente con grafici
- assegnazioni quiz per classe
