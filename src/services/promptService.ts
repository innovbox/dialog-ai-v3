import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Prompt, User } from '../types';

export class PromptService {
  // Collection references
  private promptsCollection = collection(db, 'prompts');
  private usersCollection = collection(db, 'users');
  private likesCollection = collection(db, 'likes');

  /**
   * Initialize sample prompts (for development/demo)
   */
  async initializeSamplePrompts(): Promise<void> {
    try {
      const { samplePrompts } = await import('../data/samplePrompts');
      
      console.log('🔄 Initialisation des prompts d\'exemple...');
      
      for (const promptData of samplePrompts) {
        await addDoc(this.promptsCollection, {
          ...promptData,
          authorId: 'demo-user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      
      console.log(`✅ ${samplePrompts.length} prompts d'exemple ajoutés`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation des prompts:', error);
      throw error;
    }
  }

  /**
   * Get all public prompts with optional filtering
   */
  static async getPublicPrompts(category?: string): Promise<Prompt[]> {
    try {
      let q = query(
        collection(db, 'prompts'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );

      if (category && category !== 'all') {
        q = query(
          collection(db, 'prompts'),
          where('isPublic', '==', true),
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as Prompt));
    } catch (error) {
      console.error('Error fetching public prompts:', error);
      return []; // Retourner un tableau vide au lieu de throw
    }
  }

  /**
   * Get prompts created by a specific user
   */
  static async getUserPrompts(userId: string): Promise<Prompt[]> {
    try {
      const q = query(
        collection(db, 'prompts'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as Prompt));
    } catch (error) {
      console.error('Error fetching user prompts:', error);
      return []; // Retourner un tableau vide au lieu de throw
    }
  }

  /**
   * Create a new prompt
   */
  async createPrompt(promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'copies'>, image?: File): Promise<string> {
    try {
      // Créer d'abord le document pour obtenir l'ID
      const docRef = await addDoc(this.promptsCollection, {
        ...promptData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        copies: 0
      });

      // Upload de l'image si fournie
      if (image) {
        try {
          const imageUrl = await this.uploadPromptImage(docRef.id, image);
          await updateDoc(docRef, { imageUrl });
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          // Continue sans l'image si l'upload échoue
        }
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating prompt:', error);
      throw new Error('Failed to create prompt');
    }
  }

  /**
   * Update an existing prompt
   */
  async updatePrompt(promptId: string, updates: Partial<Prompt>): Promise<void> {
    try {
      const promptRef = doc(db, 'prompts', promptId);
      await updateDoc(promptRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating prompt:', error);
      throw new Error('Failed to update prompt');
    }
  }

  /**
   * Delete a prompt
   */
  async deletePrompt(promptId: string): Promise<void> {
    try {
      const promptRef = doc(db, 'prompts', promptId);
      
      // Get prompt data to delete associated image
      const promptDoc = await getDoc(promptRef);
      if (promptDoc.exists()) {
        const promptData = promptDoc.data() as Prompt;
        
        // Delete associated image if exists
        if (promptData.imageUrl) {
          try {
            const imageRef = ref(storage, `prompt-images/${promptId}`);
            await deleteObject(imageRef);
          } catch (imageError) {
            console.warn('Error deleting image:', imageError);
          }
        }
      }

      // Delete the prompt document
      await deleteDoc(promptRef);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw new Error('Failed to delete prompt');
    }
  }

  /**
   * Upload image for a prompt
   */
  static async toggleLike(promptId: string, userId: string): Promise<boolean> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        collection(db, 'likes'),
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB');
      const promptRef = doc(db, 'prompts', promptId);

      const imageRef = ref(storage, `prompt-images/${promptId}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
        await addDoc(collection(db, 'likes'), {
   */
  async toggleLike(promptId: string, userId: string): Promise<boolean> {
    try {
      // Chercher si le like existe déjà
      const q = query(
        this.likesCollection,
        where('userId', '==', userId),
        where('promptId', '==', promptId)
      );
      
      const snapshot = await getDocs(q);
      return false; // Retourner false au lieu de throw
      
      const isLiked = !snapshot.empty;

      if (isLiked) {
        // Unlike: remove like document and decrement counter
        const likeDoc = snapshot.docs[0];
  static async hasUserLiked(promptId: string, userId: string): Promise<boolean> {
        await updateDoc(promptRef, {
          likes: increment(-1)
        collection(db, 'likes'),
        return false;
      } else {
        // Like: create like document and increment counter
        await addDoc(this.likesCollection, {
          userId,
          promptId,
          createdAt: serverTimestamp()
        });
        await updateDoc(promptRef, {
          likes: increment(1)
        });
        return true;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
  static async incrementCopyCount(promptId: string, userId?: string): Promise<void> {
    }
      const promptRef = doc(db, 'prompts', promptId);

  /**
   * Check if user has liked a prompt
   */
  async hasUserLiked(promptId: string, userId: string): Promise<boolean> {
    try {
      const q = query(
        this.likesCollection,
        where('userId', '==', userId),
        where('promptId', '==', promptId)
      );
      
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  }

  /**
  static async searchPrompts(searchTerm: string): Promise<Prompt[]> {
   */
  async incrementCopyCount(promptId: string, userId?: string): Promise<void> {
    try {
      const allPrompts = await PromptService.getPublicPrompts();
      await updateDoc(promptRef, {
        copies: increment(1)
      });
      
      // Optionnel: enregistrer qui a copié
      if (userId) {
        await addDoc(collection(db, 'copies'), {
          userId,
          promptId,
      return []; // Retourner un tableau vide au lieu de throw
        });
      }
    } catch (error) {
      console.error('Error incrementing copy count:', error);
      // Don't throw error for copy count as it's not critical
    }
  static async getPromptById(promptId: string): Promise<Prompt | null> {

      const promptRef = doc(db, 'prompts', promptId);
   * Search prompts by title or content
   */
  async searchPrompts(searchTerm: string): Promise<Prompt[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation that filters on the client side
      const allPrompts = await this.getPublicPrompts();
      
      const searchLower = searchTerm.toLowerCase();
      return allPrompts.filter(prompt => 
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.content.toLowerCase().includes(searchLower) ||
        prompt.category.toLowerCase().includes(searchLower)
      return null; // Retourner null au lieu de throw
    } catch (error) {
      console.error('Error searching prompts:', error);
      throw new Error('Failed to search prompts');
    }
  }

  static async getUserProfile(userId: string): Promise<User | null> {
   * Get prompt by ID
      const userRef = doc(db, 'users', userId);
  async getPromptById(promptId: string): Promise<Prompt | null> {
    try {
      const promptRef = doc(this.promptsCollection, promptId);
      const promptDoc = await getDoc(promptRef);
      
      if (promptDoc.exists()) {
        return {
          id: promptDoc.id,
          ...promptDoc.data(),
          createdAt: promptDoc.data()?.createdAt?.toDate() || new Date()
        } as Prompt;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching prompt:', error);
      throw new Error('Failed to fetch prompt');
    }
  }

  /**
      const userRef = doc(db, 'users', userId);
   */
  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const userRef = doc(this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return {
          uid: userDoc.id,
          ...userDoc.data()
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
      const userRef = doc(this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing profile
        await updateDoc(userRef, {
          ...userData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'prompts'), {
        await updateDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      // Ne pas throw pour éviter de casser l'app
    }
  }
}

// Export singleton instance
export const promptService = new PromptService();
      const docRef = await addDoc(collection(db, 'prompts'), {