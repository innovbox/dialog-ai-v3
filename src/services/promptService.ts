import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDoc,
  arrayUnion,
  arrayRemove,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Prompt } from '../types';
import { samplePrompts } from '../data/samplePrompts';

export class PromptService {
  private promptsCollection = collection(db, 'prompts');

  // Méthodes statiques pour l'accès direct
  static async getPublicPrompts(): Promise<Prompt[]> {
    try {
      const q = query(
        collection(db, 'prompts'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const prompts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prompt[];

      console.log('✅ Prompts publics chargés:', prompts.length);
      
      // Si aucun prompt public, initialiser avec les exemples
      if (prompts.length === 0) {
        console.log('🔄 Aucun prompt public trouvé, initialisation des exemples...');
        const service = new PromptService();
        await service.initializeSamplePrompts();
        return await PromptService.getPublicPrompts();
      }
      
      return prompts;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des prompts publics:', error);
      return [];
    }
  }

  static async getUserPrompts(userId: string): Promise<Prompt[]> {
    try {
      const q = query(
        collection(db, 'prompts'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prompt[];
    } catch (error) {
      console.error('❌ Erreur lors du chargement des prompts utilisateur:', error);
      return [];
    }
  }

  static async toggleLike(promptId: string, userId: string): Promise<boolean> {
    try {
      const promptRef = doc(db, 'prompts', promptId);
      const promptDoc = await getDoc(promptRef);
      
      if (!promptDoc.exists()) {
        throw new Error('Prompt non trouvé');
      }

      const promptData = promptDoc.data() as Prompt;
      const likes = promptData.likes || [];
      const isLiked = likes.includes(userId);

      if (isLiked) {
        await updateDoc(promptRef, {
          likes: arrayRemove(userId)
        });
        return false;
      } else {
        await updateDoc(promptRef, {
          likes: arrayUnion(userId)
        });
        return true;
      }
    } catch (error) {
      console.error('❌ Erreur lors du toggle like:', error);
      throw error;
    }
  }

  static async hasUserLiked(promptId: string, userId: string): Promise<boolean> {
    try {
      const promptRef = doc(db, 'prompts', promptId);
      const promptDoc = await getDoc(promptRef);
      
      if (!promptDoc.exists()) {
        return false;
      }

      const promptData = promptDoc.data() as Prompt;
      const likes = promptData.likes || [];
      return likes.includes(userId);
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du like:', error);
      return false;
    }
  }

  async createPrompt(promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(this.promptsCollection, {
        ...promptData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        likes: [],
        views: 0
      });
      
      console.log('✅ Prompt créé avec ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur lors de la création du prompt:', error);
      throw error;
    }
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<void> {
    try {
      const promptRef = doc(db, 'prompts', id);
      await updateDoc(promptRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Prompt mis à jour:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du prompt:', error);
      throw error;
    }
  }

  async deletePrompt(id: string): Promise<void> {
    try {
      const promptRef = doc(db, 'prompts', id);
      await deleteDoc(promptRef);
      
      console.log('✅ Prompt supprimé:', id);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du prompt:', error);
      throw error;
    }
  }

  async uploadImage(file: File, promptId: string): Promise<string> {
    try {
      const imageRef = ref(storage, `prompts/${promptId}/${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Image uploadée:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      
      console.log('✅ Image supprimée:', imageUrl);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'image:', error);
      throw error;
    }
  }

  async initializeSamplePrompts(): Promise<void> {
    try {
      console.log('🔄 Initialisation des prompts d\'exemple...');
      
      for (const prompt of samplePrompts) {
        await addDoc(this.promptsCollection, {
          ...prompt,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          likes: [],
          views: Math.floor(Math.random() * 100) + 10
        });
      }
      
      console.log('✅ Prompts d\'exemple initialisés:', samplePrompts.length);
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation des prompts d\'exemple:', error);
    }
  }
}

export default PromptService;