import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'child_process'
import path from 'path'

function cameraPlugin() {
  let pythonProcess = null;
  let sseClients = [];
  let currentFrame = null;

  return {
    name: 'camera-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Start Camera
        if (req.url === '/api/camera/start' && req.method === 'POST') {
          if (!pythonProcess) {
            const scriptPath = path.resolve(__dirname, 'src/script/video.py');
            const port = server.httpServer?.address()?.port || 5173;
            // Run python unbuffered (-u) and pass the Vite port
            pythonProcess = spawn('python', ['-u', scriptPath], {
              env: { ...process.env, VITE_PORT: port.toString() }
            });
            
            pythonProcess.stdout.on('data', (data) => console.log(`[Python CV]: ${data}`));
            pythonProcess.stderr.on('data', (data) => console.error(`[Python CV Error]: ${data}`));
            
            pythonProcess.on('close', (code) => {
              console.log(`[Python CV] exited with code ${code}`);
              pythonProcess = null;
            });
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'started' }));
        }
        // Stop Camera
        else if (req.url === '/api/camera/stop' && req.method === 'POST') {
          if (pythonProcess) {
            pythonProcess.kill();
            pythonProcess = null;
          }
          currentFrame = null;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'stopped' }));
        }
        // Receive JSON violations from Python
        else if (req.url === '/api/cv/frame' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk.toString());
          req.on('end', () => {
             // broadcast JSON payload to SSE clients
             sseClients.forEach(c => c.res.write(`data: ${body}\n\n`));
             res.end('ok');
          });
        }
        // Provide SSE to frontend
        else if (req.url === '/api/cv/stream' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          });
          const client = { id: Date.now(), res };
          sseClients.push(client);
          req.on('close', () => {
            sseClients = sseClients.filter(c => c.id !== client.id);
          });
        }
        // Receive raw video frame from Python
        else if (req.url === '/api/cv/video_frame' && req.method === 'POST') {
          let chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', () => {
            currentFrame = Buffer.concat(chunks);
            res.end('ok');
          });
        }
        // Serve MJPEG video stream to frontend
        else if (req.url === '/api/cv/video_stream' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache'
          });
          
          const interval = setInterval(() => {
            if (currentFrame) {
              res.write(`--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${currentFrame.length}\r\n\r\n`);
              res.write(currentFrame);
              res.write('\r\n');
            }
          }, 33); // approx 30 fps
          
          req.on('close', () => {
            clearInterval(interval);
          });
        }
        else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cameraPlugin()
  ],
  define: {
    global: 'globalThis',
  },
})
