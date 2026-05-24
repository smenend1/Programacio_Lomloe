# Programació LOMLOE · Matèries i situacions d’aprenentatge

Primera versió funcional d’una PWA educativa independent per crear programacions anuals o trimestrals de matèries segons la LOMLOE.

## Fitxers

- `index.html`: estructura de la PWA.
- `styles.css`: disseny visual, targetes, taules i mode impressió.
- `app.js`: editor, biblioteca local, importació/exportació, vista document i diagnòstic.
- `manifest.json`: configuració instal·lable de la PWA.
- `sw.js`: service worker i cache bàsic offline.
- `README.md`: instruccions.

## Funcions incloses a la v0.1

- PWA instal·lable.
- Disseny en català, verd suau, targetes i ús còmode en mòbil.
- Editor de dades generals.
- Editor de competències clau.
- Editor de temporització per trimestres/períodes.
- Editor de situacions d’aprenentatge, sabers, competències específiques i criteris.
- Editor d’indicadors d’avaluació AS / AN / AE.
- Apartats de metodologia, recursos, inclusió, activitats complementàries, avaluació i recuperació.
- Vista document neta, inspirada en la plantilla de programació anual.
- Exportació a PDF mitjançant impressió del navegador.
- Exportació Word editable en format `.doc` basat en HTML compatible amb Word/LibreOffice/Google Docs.
- Importació/exportació JSON.
- Còpia de seguretat JSON de la biblioteca.
- Biblioteca local amb `localStorage`.
- Importació TXT directa com a base de treball.
- Mòdul IA preparat amb mode local sense IA externa.
- Diagnòstic de service worker, cache, connexió i biblioteca.

## Ús local

Obre `index.html` directament al navegador. Per provar la PWA i el service worker correctament, és millor servir-la amb un servidor local:

```bash
python3 -m http.server 8000
```

Després visita:

```text
http://localhost:8000
```

## Publicació a GitHub Pages

1. Crea un repositori nou.
2. Puja tots els fitxers a l’arrel del repositori.
3. Ves a Settings → Pages.
4. Activa GitHub Pages des de la branca principal.
5. Obre l’URL publicada.

## Notes importants

- Aquesta app és independent de DocentKit, Tecnologia ESO i Matemàtiques ESO.
- Les dades es desen només al navegador de l’usuari mitjançant `localStorage`.
- La importació PDF/DOCX queda preparada com a flux de treball per a versions posteriors. En aquesta v0.1 només el TXT s’importa directament.
- La IA externa no és obligatòria. La primera versió funciona sense API key.
- L’exportació Word és editable, però en aquesta primera versió s’exporta com a `.doc` HTML. Una versió posterior pot generar `.docx` real amb una llibreria específica.

## Properes versions proposades

### v0.2

- Camps més detallats de competències específiques, criteris i sabers.
- Banc de plantilles per matèria.
- Més opcions DUA.
- Millora de la vista document.

### v0.3

- Exportació `.docx` real.
- Exportació PDF amb millor control de salts de pàgina.
- Plantilles visuals alternatives.

### v0.4

- Importació DOCX amb extracció de text.
- Importació PDF assistida.
- Detector automàtic d’apartats.

### v0.5

- Integració opcional amb Gemini.
- Generació assistida de situacions d’aprenentatge.
- Propostes d’indicadors NA / AS / AN / AE.
