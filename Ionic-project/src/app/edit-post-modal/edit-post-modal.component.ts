import { Component , Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: './edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.scss'],
})
export class EditPostModalComponent {
  @Input() post: any;
  updatedDescription!: string;
  updatedCategory!: string;
  updatedImage: string | null = null;
  categories: string[] = ['Circulation', 'Administratif', 'Info Métier' , 'Plan charge/dépose ' , 'Événement client' , 'Autres'];

  ngOnInit() {
    this.updatedDescription = this.post.description;
    this.updatedCategory = this.post.category;
    this.updatedImage = this.post.image;
  }

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss();
  }
  onDescriptionInput(event: any): void {
    this.updatedDescription = event.target.value;
  }
  onCategoryChange(event: any): void {
    this.updatedCategory = event.detail.value;
  }
  saveChanges() {
    this.modalCtrl.dismiss({
      description: this.updatedDescription,
      category: this.updatedCategory,
      image: this.updatedImage
    });
  }

  openFileSelector() {
    const fileInput = document.getElementById('modalFileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.updatedImage = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
}
