import app from './app';
import { mongoDB } from './config/database';

const PORT = process.env.PORT ?? 3000;

const startServer = async () => {
  try {
    await mongoDB.connect();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
