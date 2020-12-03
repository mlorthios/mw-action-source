import Firebase, { db } from '../../config/Firebase';

export default class ActionsProfileFollow {

    follow(id, followid) {
        if(followid != Firebase.auth().currentUser.uid) {

            const user_subers = {
                subscribers: true
            }

            const user_subtions = {
                subscriptions: true
            }

            db.collection('users/').doc(followid).collection('subscribers/')
                .doc(Firebase.auth().currentUser.uid)
                .set(user_subers)

            db.collection('users/').doc(Firebase.auth().currentUser.uid).collection('subscriptions/')
                .doc(followid)
                .set(user_subtions)

            return true;
        } else {
            return false;
        }
    }

    unfollow(id, unfollowid) {
        if(unfollowid != Firebase.auth().currentUser.uid) {

            const user_data = {
                subscribers: true
            }

            db.collection('users/').doc(Firebase.auth().currentUser.uid).collection('subscriptions/')
                .doc(unfollowid)
                .delete()

            db.collection('users/').doc(unfollowid).collection('subscribers/')
                .doc(Firebase.auth().currentUser.uid)
                .delete()

            return true;
        } else {
            return false;
        }
    }

}
