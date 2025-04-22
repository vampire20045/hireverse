import express from 'express';
//@ts-ignore
import cors from 'cors';
//@ts-ignore
import router from './routes/user';
import routerHr from './routes/Hr';
import { PrismaClient } from '@prisma/client';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use("/company",routerHr);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
