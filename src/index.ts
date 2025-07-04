// src/index.ts
import 'dotenv/config';
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);

app.use('/api-interface', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Railway!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
