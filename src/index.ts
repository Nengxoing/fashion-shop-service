import 'dotenv/config';
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import allRoute from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Loading...</title>
      <meta http-equiv="refresh" content="1.5;url=/api-interface" />
      <style>
        body {
          margin: 0;
          height: 100vh;
          background: rgb(236, 241, 255);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: white;
          flex-direction: column;
        }
          
        h2 {
          margin-top: 20px;
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          color: rgb(61, 106, 255);
        }
          
        .spinner {
          width: 50px;
          height: 50px;
          border: 6px solid rgb(152, 176, 255);
          border-top-color:rgb(61, 106, 255);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
          
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="spinner"></div>
      <h2>Loading...</h2>
    </body>
    </html>
  `);
});

app.use('/user', allRoute);

app.use('/api-interface', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
