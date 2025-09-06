import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { EditPostModalComponent } from '../edit-post-modal/edit-post-modal.component';
import { ProfilService } from '../utiles/services/profil/profil.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage {
  user!: any;
  newPost: { description: string; image?: string; category?: string } = { description: '', category: '' };
  posts: Array<{
    description: string;
    image?: string;
    date: Date;
    comments: { text: string; user: any }[];
    newComment?: string;
    likes: number;
    liked: boolean;
    category?: string;
  }> = [];

  // Liste des catégories
  categories: string[] = ['Circulation', 'Administratif', 'Info Métier' , 'Plan charge/dépose ' , 'Événement client'  , 'Autres'];

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private userProfile: ProfilService
  ) {}

  ngOnInit(): void {
    this.loadPostsFromLocalStorage();
    console.log(this.posts)
  }

  // Charger les publications depuis le stockage local
  loadPostsFromLocalStorage(): void {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
    }
  }

  // Sauvegarder les publications dans le stockage local
  savePostsToLocalStorage(): void {
    localStorage.setItem('posts', JSON.stringify(this.posts));
  }

  // Récupérer les informations utilisateur
  profil() {
    this.userProfile.$profil().subscribe(
      (data: any) => {
        this.userProfile.$userinfo = data;
        this.user = data;
        console.log('Auth user => ', this.user);
      },
      (err) => {
        console.error('Error: ', err);
      }
    );
  }

  async ionViewWillEnter(): Promise<void> {
    await this.profil();
  }

  // Ajouter une nouvelle publication
  addPost(): void {
    if ((this.newPost.description.trim() || this.newPost.image) && this.newPost.category) {
      this.posts.unshift({
        description: this.newPost.description,
        image: this.newPost.image,
        date: new Date(),
        comments: [],
        likes: 0,
        liked: false,
        category: this.newPost.category,
      });
      console.log('Publication ajoutée : ', this.newPost);

      // Réinitialisation
      this.newPost = { description: '', category: '' };
      this.savePostsToLocalStorage();
    } else {
      console.error('Veuillez ajouter une description et sélectionner une catégorie avant de publier.');
    }
  }

  // Modifier une publication
  async editPost(postIndex: number): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: EditPostModalComponent,
      componentProps: {
        post: this.posts[postIndex],
      },
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log("test 1 : ",result)
        this.posts[postIndex] = { ...this.posts[postIndex], ...result.data };
        this.savePostsToLocalStorage();
      }
    });
    await modal.present();
  }

  // Confirmer la suppression d'une publication
  async confirmDeletePost(postIndex: number): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer cette publication ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.posts.splice(postIndex, 1);
            this.savePostsToLocalStorage();
          },
        },
      ],
    });

    await alert.present();
  }

  // Ouvrir le sélecteur de fichiers
  openFileSelector() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  // Gérer le fichier sélectionné
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newPost.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Ajouter un commentaire
  addComment(post: any): void {
    if (post.newComment?.trim()) {
      post.comments.push({ text: post.newComment, user: this.user?.firstName });
      post.newComment = '';
      this.savePostsToLocalStorage();
    }
  }

  // Modifier un commentaire
  async editComment(post: any, commentIndex: number): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Modifier le commentaire',
      inputs: [
        {
          name: 'updatedText',
          type: 'text',
          value: post.comments[commentIndex]?.text || '',
          placeholder: 'Votre commentaire...',
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Modifier',
          handler: (data) => {
            if (data.updatedText.trim()) {
              post.comments[commentIndex].text = data.updatedText.trim();
              this.savePostsToLocalStorage();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Confirmer la suppression d'un commentaire
  async confirmDeleteComment(post: any, commentIndex: number): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            post.comments.splice(commentIndex, 1);
            this.savePostsToLocalStorage();
          },
        },
      ],
    });

    await alert.present();
  }

  // Aimer ou ne plus aimer une publication
  likePost(post: any): void {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    this.savePostsToLocalStorage();
  }
}
