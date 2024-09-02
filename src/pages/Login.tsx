import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiImage,
  EuiPanel,
  EuiProvider,
  EuiSpacer,
  EuiText,
  EuiTextColor,
} from "@elastic/eui";
import giftImage from "../assets/giftImage.gif";
import logo from "../assets/logo.png";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { firebaseAuth, userRef } from "../utils/FirebaseConfig";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate} from 'react-router-dom'
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../app/slices/AuthSlice";
import { useEffect } from "react";


// Login Page Component
const Login = () => {
    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Check if user is already logged in or not and redirect to Home Page
    useEffect(()=>{
      onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) navigate("/");
      });
    },[navigate, dispatch])

    
    // main login function to login with google
    const login = async ()=>{
        const provider = new GoogleAuthProvider();
        const {user: {displayName, email, uid}} = await signInWithPopup(firebaseAuth, provider);
        if(email){
            // Check user in Firebase DataBase
            const firestoreQuery = query(userRef, where("uid" , "==", uid));
            const fetchedUsers = await getDocs(firestoreQuery);
            
            // Add user if User not Exist
            if(fetchedUsers.docs.length == 0){
                await addDoc(userRef, {
                    uid,
                    name: displayName,
                    email,
                });
            }
        }
        // Update the 'setUser' to Redux store and access globally
        dispatch(setUser({ uid, name: displayName, email}));
        navigate("/");  
    }

  return (
    <EuiProvider colorMode="dark">
      <EuiFlexGroup
        alignItems="center"
        justifyContent="center"
        style={{ width: "100wh", height: "100vh" }}
      >
        <EuiFlexItem grow={false}>
          <EuiPanel paddingSize="xl">
            <EuiFlexGroup justifyContent="center" alignItems="center">
             
              <EuiFlexItem>
                <EuiText textAlign="center" grow={false}>
                    <h3>
                        <EuiTextColor color="#4F1787">Welcome to Meetiva Video Call Application</EuiTextColor>
                    </h3>
                </EuiText>
                <EuiImage src={logo} alt="logo" size="180px" />
                <EuiSpacer size="xs" />
                <EuiText textAlign="center" grow={false}>
                  <h3>
                    <EuiTextColor>Connect to </EuiTextColor>
                    <EuiTextColor color="#0b5cff">Meetiva</EuiTextColor>
                  </h3>
                </EuiText>
                <EuiSpacer size="l" />
                <EuiButton fill onClick={login}> Login with Google </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiImage src={giftImage} alt="gif" />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiProvider>
  );
};

export default Login;
