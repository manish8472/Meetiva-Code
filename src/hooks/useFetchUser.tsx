import {useState, useEffect} from 'react'
import { useAppSelector } from '../app/hooks';
import { getDocs, query, where } from 'firebase/firestore';
import { userRef } from '../utils/FirebaseConfig';
import { UserType } from '../utils/Type';

// useFetchUser: get all user which is registor on this application but not current user

export default function useFetchUser() {
 const [users, setUsers] = useState<Array<UserType>>([]);
 const uid = useAppSelector((zoom) => zoom.auth.userInfo?.uid);

 useEffect(() => {
    if(uid){
        const getUsers = async() => {
            
            // find all users which is registor on this application but not current user
            const firestoreQuery = query(userRef, where("uid", "!=" , uid ));
            const data = await getDocs(firestoreQuery);
            const firebaseUsers : Array<UserType> = [];
            
            // add data to firebaseUsers array
            data.forEach((user) => {
                const userData = user.data() as UserType;
                firebaseUsers.push({
                    ...userData,
                    label:userData.email,
                })
            });
            setUsers(firebaseUsers);
        }
        getUsers();
    }
 },[uid]);

 return users;
}


