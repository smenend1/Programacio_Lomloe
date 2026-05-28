# Programació LOMLOE v0.6.0

PWA independent en català per crear i exportar programacions LOMLOE.

## Novetats v0.6.0

- Programació 4t ESO Tecnologia Aplicada 2025-2026 precarregada.
- Docents: Sergio Menéndez i Isabel Marginet.
- SA reals del curs: sostenibilitat/materials, màquina de Rube Goldberg, Floorplanner, circuits amb protoboard/Tinkercad, electricitat aplicada a l’habitatge, electrònica digital i autòmat simple.
- Vista document preparada per exportar a PDF o Word editable.
- Taules netes sense peus de pàgina ni notes internes.
- Selector de font visible per a PDF/Word: Times New Roman, Arial, Georgia, Verdana i Sistema.
- Times New Roman com a font predeterminada per evitar el problema visual amb la lletra l en exportació/impressió.
- Nou botó **Copia per Word/Docs**: copia la vista document com a HTML ric, mantenint taules i format quan s’enganxa a Word o Google Docs.
- Nou botó **HTML copiable**: descarrega una versió `.html` del document per obrir-la al navegador i copiar-la amb taules, sense dependre del PDF ni de Google Drive.

## Ús recomanat

Obre `index.html`, revisa la secció **Vista document** i tria la font si cal.

Per copiar a una altra fitxa o document:
1. Prem **Copia per Word/Docs**.
2. Enganxa directament a Word o Google Docs.

Per exportar:
- **PDF / imprimeix**: genera un PDF visual.
- **Word editable**: genera un document editable.
- **HTML copiable**: genera un HTML que conserva les taules i es pot copiar des del navegador.

Nota: copiar text des d’un PDF o des de la previsualització de Google Drive pot perdre taules i tabulacions. Per conservar l’estructura, utilitza preferentment **Copia per Word/Docs**, **Word editable** o **HTML copiable**.

Per publicar a GitHub Pages, puja tots els fitxers a un repositori i activa Pages.

## v0.6.0
- `index.html` ara inclou CSS i JavaScript incrustats perquè també funcioni quan s'obre directament des d'Android com a fitxer local/content://.
- Es mantenen `styles.css` i `app.js` com a fitxers font separats.
- Per instal·lar com a PWA real, cal publicar-la en HTTPS, per exemple GitHub Pages. Obrint-la com a fitxer local al mòbil no es pot registrar el service worker.


## v0.6.0

- Afegits botons al Gestor de SA per carregar les SA de 4t ESO 2025-2026 sense haver d'anar a Biblioteca.
- Opció separada per carregar només SA, sabers, CE, CA i indicadors mantenint les dades generals actuals.
- Opció per carregar tota la programació completa de 4t ESO 2025-2026.


## Novetat v0.6.0

- Importació de situacions d'aprenentatge en JSON des del Gestor de SA.
- Importació de paquets amb diverses SA.
- Botó per enganxar una SA en text estructurat i repartir camps bàsics.
- Exportació d'una SA o de totes les SA en JSON per facilitar l'intercanvi amb DocentKit.

## v0.6.0

- Correcció del diagnòstic PWA perquè funcioni també quan l’app s’obre en local (`file://`) o des d’Android (`content://`).
- El botó de diagnòstic ara mostra sempre una resposta i inclou còpia del diagnòstic.


Actualització recent:
- Programació LOMLOE v0.6.0: validació abans d’exportar, plantilla Word més estable, plantilles buides per 1r-4t ESO de tecnologia i millor importació de SA DocentKit.


## v0.6.0
- Les competències específiques de cada SA es mostren desenvolupades a la taula final quan s'han escrit com a CE1, CE2...
- Exportació Word reforçada amb taules HTML amb vores i estils en línia.
- Impressió/PDF reforçada amb format A4 apaïsat i vores de taula més explícites.
- Es manté l'HTML copiable com a format més fidel per enganxar a Word o Google Docs.


## Novetats v0.6.0

- Millora de sortides documentals.
- Selector de densitat de taules: normal, compacta i ultra compacta.
- Selector d'orientació PDF: A4 apaïsat o vertical.
- Botó "Copia optimitzat Docs" per enganxar millor a Google Docs.
- PDF/impressió amb estils injectats segons la densitat escollida.
- HTML copiable continua sent la sortida recomanada per conservar els quadres.


## v0.6.0 - Sortides finals clares

Aquesta versió tanca la branca v0.4.x de sortides documentals amb tres camins diferenciats:

- **HTML copiable (recomanat)**: sortida més fidel per conservar quadres i copiar cap a Word o Google Docs.
- **PDF plantilla (portàtil)**: manté el model de taula original i està pensat per generar el PDF final des d’un portàtil.
- **PDF per blocs (mòbil)**: sortida alternativa per mòbil. No intenta conservar una única taula gegant; separa les SA en blocs per reduir talls de pàgina.

El Word editable continua sent provisional. El proper bloc de treball és la v0.6.0 amb generació DOCX real.


## v0.6.0

- Reforç del mode PDF per blocs en mòbil perquè ocupi l'amplada completa d'un A4 apaïsat.
- El mode mòbil continua depenent del motor d'impressió d'Android; si el PDF definitiu és crític, HTML copiable o PDF des de portàtil continuen sent les opcions més fiables.


## v0.6.0 - DOCX real

Aquesta versio afegeix exportacio **DOCX real**: el boto `DOCX real` genera un fitxer `.docx` natiu amb estructura OOXML i taules editables, sense dependre de l'antic `.doc` basat en HTML.

Sortides recomanades:

- `HTML copiable`: continua sent la sortida mes fidel per copiar a Google Docs.
- `PDF plantilla`: recomanat des de portatil.
- `PDF per blocs`: alternativa per mobil.
- `DOCX real`: fitxer Word editable amb taules natives, pensat sobretot per Microsoft Word i tambe provable a Google Docs.
