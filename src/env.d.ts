declare namespace NodeJS {
  interface ProcessEnv {
    // Server
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PORT: string;
    
    // MongoDB
    readonly MONGODB_URI: string;
    
    // Authentication
    readonly SESSION_SECRET: string;
    readonly JWT_SECRET: string;
    
    // CORS
    readonly CORS_ORIGIN: string;
    
    // File Upload
    readonly MAX_FILE_SIZE: string;
    readonly UPLOAD_DIR: string;
  }
}
