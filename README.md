![Screenshot 2024-11-25 131506](https://github.com/user-attachments/assets/3b072094-9fc8-4669-8cbc-fc3cbaee9805)
# WebConnect (Bachelor-Projekt)

**WebConnect** ist ein Live-Web-Chat, der im Rahmen meiner Bachelorarbeit zum Thema _"Vergleich der Web-Frameworks React und Svelte anhand einer prototypischen Web-Chat Applikation"_ entwickelt wurde. Es handelt sich um ein Testprojekt, das die Stärken und Schwächen der beiden Frontend-Frameworks React und Svelte anhand eines praxisnahen Beispiels untersucht.

## Features

- **Node.js API**: Eine API, die als Backend dient und die Chat-Funktionalitäten über WebSockets bereitstellt.
- **React Webclient**: Ein moderner Webclient, der in React umgesetzt wurde und alle Funktionalitäten der Web-Chat-Anwendung bietet.
- **Svelte Webclient**: Ein alternativer Webclient, der mit dem Framework Svelte entwickelt wurde und ebenfalls die komplette Chat-Funktionalität unterstützt.
- **WebSocket-Integration**: Echtzeit-Chat-Kommunikation durch die Nutzung von WebSockets für bidirektionale Datenübertragung.
- **Voll funktionsfähig mit beiden Clients**: Sowohl der React- als auch der Svelte-Client sind vollständig funktional und bieten ein vergleichbares Nutzererlebnis.

## Screenshots

![Screenshot 2024-10-29 100903](https://github.com/user-attachments/assets/443fbd28-08ba-4db4-915f-dd6ab32e2433)
![Screenshot 2024-10-29 101006](https://github.com/user-attachments/assets/cd1fdfe9-8940-414d-96f9-903c3f957c2d)
![Screenshot 2024-10-29 101025](https://github.com/user-attachments/assets/ccf631ac-79c1-4e09-9769-0e1a2c8175a2)
![Screenshot 2024-10-29 103301](https://github.com/user-attachments/assets/0c140ccf-10fb-428d-8b86-445471802745)
![Screenshot 2024-10-29 103330](https://github.com/user-attachments/assets/5d58279b-fd1c-474d-8a20-6bfb93300d57)
![Screenshot 2024-11-20 130009](https://github.com/user-attachments/assets/91fb09d2-b9c9-4446-8810-71c6840f3497)
![Screenshot 2024-11-20 130049](https://github.com/user-attachments/assets/0d43b1c7-cd73-43bc-80d0-32ac07379bee)

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

Öffne den React- oder Svelte-Client in deinem Browser und teste den Live-Web-Chat. Die beiden Clients bieten eine ähnliche Benutzeroberfläche, jedoch mit unterschiedlichen Implementierungen, was den Vergleich der Frameworks ermöglicht. Der React-Client ist unter http://localhost:5000 zu finden und der Svelte-Client unter http://localhost:5050.

## Fazit der Bachelorarbeit

Der WebConnect-Prototyp zeigt, dass sowohl React als auch Svelte leistungsfähige Frameworks für Webanwendungen sind. Die Wahl des Frameworks hängt von spezifischen Anforderungen wie Performance, Entwicklungsaufwand und Community-Support ab.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Informationen findest du in der [LICENSE](./LICENSE) Datei.
