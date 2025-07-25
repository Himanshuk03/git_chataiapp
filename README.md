## This is **Overview**
This project is a **ChatGPT-like AI application** that runs locally and uses the **open-source LLM (Gemma:1B) from Ollama**.  
It provides a clean UI with chat history, message streaming, and session storage.

**Key Features:**
- Real-time AI responses (streaming token-by-token)
- Chat history with "New Chat" option
- Stop/abort ongoing AI response
- PostgreSQL database for persistent chat storage
- Clean UI (Next.js + TailwindCSS)
- Node.js backend integrated with Ollama

---

## This part **Tech Stack**
- **Frontend:** Next.js (React 19), TailwindCSS
- **Backend:** Node.js (Express)
- **LLM:** Ollama (`gemma:2b`)
- **Database:** PostgreSQL
- **Other Tools:** TypeScript, Prisma (for DB schema)

---

## **Now lets strart**

### **1. Clone this Repository**
In bash
git clone https://github.com/Himanshuk03/git_chataiapp.git
cd git_chataiapp

### **2.Setup Frontend **
In bash
cd frontend
npm install
npm run dev
The app will start on: http://localhost:3000

### **3.Setup Backend**
In bash
open bash under this '/backend' folder/file
Run below :
npm install
node server.js
Backend API will start on: http://localhost:3210 (or your configured port)

### **4.Setup PostgreSQL Database**
Now, start your PostgreSQL server, go to  'Windows+S' keyword type pgAdmin, Run as Administrator, then follow below.
Create a database (e.g., chataiapp).
Now Under Schemas-> under Tables-> right click-> now again click to Query Tool, then paste below code :

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

After that , under Tables , here two table chats and message will create.

### **5. Setup Ollama**
Install Ollama by typing below in bash: 
ollama pull gemma:2b ,
ollama run gemma:2b , thus successfully ollama is running.

### **6.Project Structure would be as below : **
chataiapp/backend & chataiapp/frontend
chataiapp/
 ├── backend/         # Node.js + Express API
 ├── frontend/        # Next.js UI
 ├── README.md        # Project Documentation
 └── .gitignore

### **At last, here below is video link**
Visit: https://drive.google.com/file/d/1M_YxYj7Fkfrx0jTIhu43wYLcePmDxp3q/view?usp=drivesdk
