import 'dotenv/config';
import express, { Request, Response, Application } from 'express';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Railway!");
});