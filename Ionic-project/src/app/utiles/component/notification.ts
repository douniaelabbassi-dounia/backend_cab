import { ToastController } from "@ionic/angular";

let toastController = new ToastController();

export  let  presentToast = async (message:string, position: 'top' | 'middle' | 'bottom' = 'bottom', color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark' = 'secondary') => {
    const toast = await toastController.create({
      message,
      duration: 5000,
      position: position,
      color,
      
    });

    await toast.present();
  }