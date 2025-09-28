import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';


export const getAllUsers = async () => {
  try{
    return await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    }).from(users);
    


  }catch(error){
    logger.error('Error fetching users:', error);
    throw error;
  }
}

export const getUserById = async (id) => {
  try {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    logger.error('Error fetching user by ID:', error);
    throw error;
  }
}

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);
    
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Add updatedAt timestamp
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      });

    logger.info(`User ${id} updated successfully`);
    return updatedUser;
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
}

export const deleteUser = async (id) => {
  try {
    // Check if user exists
    const existingUser = await getUserById(id);
    
    if (!existingUser) {
      throw new Error('User not found');
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role
      });

    logger.info(`User ${id} deleted successfully`);
    return deletedUser;
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}
