import Firebase from '../config/Firebase';
import RNFetchBlob from 'rn-fetch-blob'
import 'firebase/storage'

class UploadAva {

    addAvatar = async ({ localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);
    };

    uploadImage = (uri, imageName, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
          const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null
            const imageRef = Firebase.storage().ref('posts').child(imageName)
            fs.readFile(uploadUri, 'base64')
            .then((data) => {
              return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
              uploadBlob = blob
              return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
              uploadBlob.close()
              return imageRef.getDownloadURL()
            })
            .then((url) => {
              resolve(url)
            })
            .catch((error) => {
              reject(error)
            })
        })
      }

    get firestore() {
        return Firebase.firestore();
    }

    get uid() {
        return (Firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}

UploadAva.shared = new UploadAva();
export default UploadAva;
