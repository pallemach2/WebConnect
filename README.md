
# WebConnect (Bachelor-Projekt)

**WebConnect** ist ein Live-Web-Chat, der im Rahmen meiner Bachelorarbeit zum Thema _"Vergleich der Web-Frameworks React und Svelte anhand einer prototypischen Web-Chat Applikation"_ entwickelt wurde. Es handelt sich um ein Testprojekt, das die Stärken und Schwächen der beiden Frontend-Frameworks React und Svelte anhand eines praxisnahen Beispiels untersucht.

## Features

- **Node.js API**: Eine API, die als Backend dient und die Chat-Funktionalitäten über WebSockets bereitstellt.
- **React Webclient**: Ein moderner Webclient, der in React umgesetzt wurde und alle Funktionalitäten der Web-Chat-Anwendung bietet.
- **Svelte Webclient**: Ein alternativer Webclient, der mit dem Framework Svelte entwickelt wurde und ebenfalls die komplette Chat-Funktionalität unterstützt.
- **WebSocket-Integration**: Echtzeit-Chat-Kommunikation durch die Nutzung von WebSockets für bidirektionale Datenübertragung.
- **Voll funktionsfähig mit beiden Clients**: Sowohl der React- als auch der Svelte-Client sind vollständig funktional und bieten ein vergleichbares Nutzererlebnis.

## Installation

1. **Clone das Repository**:
   ```bash
   git clone https://github.com/pallemach2/WebConnect.git
   cd WebConnect
   ```

2. **Installiere die Abhängigkeiten**:
   - Für das Backend:
     ```bash
     cd backend
     npm install
     ```
   - Für den React-Client:
     ```bash
     cd react-client
     npm install
     ```
   - Für den Svelte-Client:
     ```bash
     cd svelte-client
     npm install
     ```

3. **Starte das Backend**:
   ```bash
   cd backend
   npm start
   ```

4. **Starte die Clients**:
   - React-Client:
     ```bash
     cd react-client
     npm start
     ```
   - Svelte-Client:
     ```bash
     cd svelte-client
     npm run dev
     ```

## Usage

Öffne den React- oder Svelte-Client in deinem Browser und teste den Live-Web-Chat. Die beiden Clients bieten eine ähnliche Benutzeroberfläche, jedoch mit unterschiedlichen Implementierungen, was den Vergleich der Frameworks ermöglicht.

## Fazit der Bachelorarbeit

Der WebConnect-Prototyp zeigt, dass sowohl React als auch Svelte leistungsfähige Frameworks für Webanwendungen sind. Die Wahl des Frameworks hängt von spezifischen Anforderungen wie Performance, Entwicklungsaufwand und Community-Support ab.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Informationen findest du in der [LICENSE](./LICENSE) Datei.
