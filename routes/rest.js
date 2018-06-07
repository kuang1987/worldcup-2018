import express from 'express';
import { login, changePassword } from '../controller/auth'

const apiRoutes = express.Router();

apiRoutes.post('/login', login);
apiRoutes.post('/changePassword', changePassword);

export default apiRoutes;
