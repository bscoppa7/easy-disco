# Easy Disco - Gestionale per Discoteche

Un sistema di gestione moderno e intuitivo per discoteche con piantina interattiva in tempo reale.

## Caratteristiche

### 🎯 Funzionalità Attuali
- **Piantina Interattiva**: Visualizzazione della discoteca con tutte le zone principali
- **Monitoraggio Occupazione**: Hover tooltip che mostra posti occupati/totali per ogni zona
- **Aggiornamenti in Tempo Reale**: Simulazione di cambiamenti nell'occupazione delle zone
- **Design Responsivo**: Ottimizzato per desktop e dispositivi mobili
- **Interfaccia Moderna**: Design accattivante con effetti visivi

### 🏢 Zone Gestite
1. **DJ Booth** - Postazione del DJ
2. **Bar Principale** - Area bar principale
3. **Bar Secondario** - Area bar secondaria
4. **Pista da Ballo** - Area centrale per il ballo
5. **Area VIP** - Zona riservata VIP
6. **Zona Tavoli** - Area con tavoli per gruppi
7. **Zona Lounge** - Area relax e conversazione
8. **Zona Fumatori** - Area dedicata ai fumatori
9. **Ingresso** - Area di ingresso
10. **Bagni** - Servizi igienici

## Tecnologie Utilizzate

- **HTML5** - Struttura della pagina
- **CSS3** - Styling e animazioni
- **JavaScript (Vanilla)** - Logica interattiva
- **Design Responsivo** - Compatibile con tutti i dispositivi

## Installazione e Utilizzo

1. **Clona o scarica** i file del progetto
2. **Apri** il file `index.html` in un browser web moderno
3. **Interagisci** con la piantina passando il mouse sulle diverse zone

## Struttura del Progetto

```
easy-disco/
├── index.html          # Pagina principale
├── styles.css          # Fogli di stile
├── script.js           # Logica JavaScript
└── README.md           # Documentazione
```

## Funzionalità Future

### 🚀 Prossimi Sviluppi
- [ ] **Sistema di Prenotazioni** - Gestione prenotazioni tavoli e aree VIP
- [ ] **Dashboard Amministrativa** - Pannello di controllo per il personale
- [ ] **Gestione Eventi** - Calendario e organizzazione eventi
- [ ] **Sistema di Pagamenti** - Integrazione con sistemi di pagamento
- [ ] **App Mobile** - Versione mobile nativa
- [ ] **Analytics** - Statistiche e reportistica
- [ ] **Gestione Staff** - Assegnazione personale alle zone
- [ ] **Sistema di Code** - Gestione code d'ingresso
- [ ] **Integrazione IoT** - Sensori per conteggio automatico
- [ ] **Notifiche Push** - Avvisi in tempo reale

### 📊 Metriche e Analytics
- Tempo medio di permanenza per zona
- Picchi di affluenza
- Analisi dei ricavi per zona
- Reportistica giornaliera/settimanale/mensile

## Personalizzazione

### Modifica delle Zone
Per aggiungere o modificare zone, edita:
1. **HTML** - Aggiungi nuovi elementi `.zone` in `index.html`
2. **CSS** - Definisci posizione e stile in `styles.css`
3. **JavaScript** - Aggiungi dati zona nell'oggetto `zoneData` in `script.js`

### Colori di Occupazione
I colori cambiano automaticamente in base alla percentuale di occupazione:
- 🔵 **Blu** (0-29%) - Quasi vuoto
- 🟢 **Verde** (30-49%) - Poco pieno
- 🟡 **Giallo** (50-69%) - Metà pieno
- 🟠 **Arancione** (70-89%) - Abbastanza pieno
- 🔴 **Rosso** (90-100%) - Quasi pieno

## API JavaScript

### Funzioni Disponibili
```javascript
// Ottieni tutti i dati delle zone
const data = getZoneData();

// Aggiorna occupazione di una zona
updateZoneOccupancy('vip', 15, 20); // zona, occupati, totali
```

## Compatibilità Browser

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Licenza

Questo progetto è sviluppato per scopi dimostrativi e di apprendimento.

## Contatti

Per domande, suggerimenti o collaborazioni, contatta il team di sviluppo.

---

**Easy Disco** - Rendere la gestione delle discoteche semplice e moderna! 🎵✨
