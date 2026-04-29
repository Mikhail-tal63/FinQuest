import { Request, Response } from 'express';
import User from '../models/User';

// POST /api/users
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, role } = req.body;
    if (!name || !role) {
      res.status(400).json({ success: false, message: 'name and role are required' });
      return;
    }
    const user = await User.create({ name, role });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// GET /api/users
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, 'name role balance xp riskLevel awarenessScore securityScore');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// GET /api/users/:id
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).populate('completedScenarios', 'title source');
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
