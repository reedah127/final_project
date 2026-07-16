# Testing notes:
Issues with the backend and frontend not connecting. Took me two whole days just to be able to connect them. After many, MANY, attempts I figured out it was a port issue. I also found out hoe to stop any ports running in the background of the mac so if this issue happens again I can fix it. 

Seperate terminals WERE required to get this to work. On top of this Mongodb had its own issues with me. 


# Other comments:
Tracking app is not where I want it to be but because of testing issues and all that went into the code I have it where it needs to be. I would have liked to fix the buttons and change up the layout again. I changed it about 4 times before I just gave up. I want to learn more about React and Vite, I had to look up a few things to get the code and css to work cohesivley but all in all It looks decent. 

# Technologies:
Backend API foundation: Node.js, Express framework, Mongoose 
Frontend user interface: React functional components, JSX, CSS Custom Variables
Database storage engine: MongoDB Atlas 
Security: JSON Web Tokens (jsonwebtoken), bcrypt 

# Features:
Account Onboarding
Stateless Session Control
User Data
Full CRUD Management
Dynamic Feedback Alerts

# Routes:
GET /api/health 
POST /api/auth/register 
POST /api/auth/login 
GET /api/tasks 
POST /api/tasks 
PUT /api/tasks/:id
DELETE /api/tasks/:id 

# Locallly run server
Frontend: cd frontend -> npm run dev
Backend: cd backend -> npm run dev



