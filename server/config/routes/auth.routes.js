import express from 'express';
import bcrypt from 'bcrypt';
import db from '../db/connection.db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { surname, last_name, email, password, birthday } = req.body;
        if (!password) {
          return res.status(400).json({ error: 'Password es requerido' });
        }
        // console.log('Password recibido:', password);
        const passwordHash = await bcrypt.hash(password, 10); 
        
      const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      const result = await db.query(
        `INSERT INTO users (surname, last_name, email, password_hash, birthday, avatar_url, avatar_key)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, surname, last_name, email`,
        [surname, last_name, email, passwordHash, birthday, 'https://placehold.co/100x100','placeholder-key' ]
      );
  
      res.status(201).json({ user: result.rows[0] });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Error registering user', details: err.message });
    }
  });
  
  export default router;
